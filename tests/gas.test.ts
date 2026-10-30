import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";

function createHarness(){
  const sheets=new Map();
  const properties=new Map();
  const spreadsheet={
    getId(){return "test-spreadsheet-id";},
    getSheetByName(name){return sheets.get(name)||null;},
    insertSheet(name){
      const sheet={
        rows:[],
        appendRow(row){this.rows.push([...row]);return this;},
        setFrozenRows(){},
        getLastRow(){return this.rows.length;},
        getDataRange(){return {getValues:()=>this.rows.map(row=>[...row])};},
        getRange(row,col){return {setValue:value=>{this.rows[row-1][col-1]=value;}};}
      };
      sheets.set(name,sheet);
      return sheet;
    }
  };
  const context={
    SpreadsheetApp:{getActive:()=>spreadsheet,openById:()=>spreadsheet},
    PropertiesService:{getScriptProperties:()=>({getProperty:key=>properties.get(key)||null,setProperty:(key,value)=>properties.set(key,value)})},
    LockService:{getScriptLock:()=>({waitLock(){},releaseLock(){}})},
    ContentService:{MimeType:{JSON:"application/json"},createTextOutput(content){return {content:String(content),setMimeType(){return this;},getContent(){return this.content;}};}},
    Utilities:{getUuid:()=>"test-uuid",formatDate(date,_zone,format){if(format==="MM/yy")return String(date.getMonth()+1).padStart(2,"0")+"/"+String(date.getFullYear()).slice(-2);return date.toISOString();}},
    Session:{getScriptTimeZone:()=>"Europe/Prague"}
  };
  const source=readFileSync(new URL("../gas/Code.gs",import.meta.url),"utf8");
  runInNewContext(source,context);
  context.setupWarehouse();
  return {context,sheets};
}

function post(context,action,payload={}){
  const response=context.doPost({postData:{contents:JSON.stringify({action,...payload})}});
  return JSON.parse(response.getContent());
}

function seedReferences(sheets){
  sheets.get("DB_MATERIALS").appendRow(["MAT-AA-01","Materiál","kg"]);
  sheets.get("DB_LOCATIONS").appendRow(["REG-A-01","Regál A"]);
  sheets.get("DB_LOCATIONS").appendRow(["REG-B-01","Regál B"]);
  sheets.get("DB_BOXES").appendRow(["BOX-A-01","REG-A-01"]);
  sheets.get("DB_BOXES").appendRow(["BOX-B-01","REG-B-01"]);
}

test("Apps Script setup creates all warehouse sheets and GET returns their collections",()=>{
  const {context}=createHarness();
  const result=JSON.parse(context.doGet({parameter:{action:"get"}}).getContent());
  assert.equal(result.ok,true);
  assert.deepEqual(Object.keys(result.data).sort(),["boxes","locations","materials","movements","packs"]);
});

test("Apps Script add, move and status operations preserve an accurate movement ledger",()=>{
  const {context,sheets}=createHarness();
  seedReferences(sheets);
  const pack={id:"P-26-0001",materialId:"MAT-AA-01",batch:"BATCH-A",expiry:"06/27",boxId:"BOX-A-01",status:"nový",initialWeight:2.5,receivedAt:"2026-10-30T10:00:00.000Z"};
  const added=post(context,"addPack",{pack});
  assert.equal(added.ok,true);
  assert.equal(added.data.movements[0].id,"MOV-000001");
  const moved=post(context,"movePack",{packId:pack.id,boxId:"BOX-B-01",fromBoxId:"BOX-STALE"});
  assert.equal(moved.ok,true);
  assert.equal(moved.data.movements[0].id,"MOV-000002");
  assert.equal(moved.data.movements[0].from,"BOX-A-01");
  assert.equal(moved.data.packs[0].boxId,"BOX-B-01");
  const status=post(context,"updatePackStatus",{packId:pack.id,status:"otevřený"});
  assert.equal(status.ok,true);
  assert.equal(status.data.movements[0].id,"MOV-000003");
  assert.equal(status.data.movements[0].from,"nový");
  assert.equal(status.data.packs[0].status,"otevřený");
});

test("Apps Script rejects duplicate IDs, invalid expiry, unknown positions and invalid statuses",()=>{
  const {context,sheets}=createHarness();
  seedReferences(sheets);
  const base={id:"P-26-0001",materialId:"MAT-AA-01",batch:"A",expiry:"06/27",boxId:"BOX-A-01",status:"nový",initialWeight:1};
  assert.equal(post(context,"addPack",{pack:base}).ok,true);
  assert.equal(post(context,"addPack",{pack:{...base}}).ok,false);
  assert.equal(post(context,"addPack",{pack:{...base,id:"P-26-0002",expiry:"13/27"}}).ok,false);
  assert.equal(post(context,"addPack",{pack:{...base,id:"P-26-0003",status:"neznámý"}}).ok,false);
  assert.equal(post(context,"addPack",{pack:{...base,id:"P-26-0004",boxId:"BOX-UNKNOWN"}}).ok,false);
  assert.equal(sheets.get("DB_PACKS").getLastRow(),2);
});

test("Apps Script reads Sheets date cells back as MM/RR expiry values",()=>{
  const {context,sheets}=createHarness();
  const date=runInNewContext("new Date(2027,5,1)",context);
  sheets.get("DB_PACKS").appendRow(["P-26-0001","MAT-AA-01","A",date,"BOX-A-01","nový",1,"2026-10-30T10:00:00.000Z"]);
  const result=JSON.parse(context.doGet({parameter:{action:"get"}}).getContent());
  assert.equal(result.data.packs[0].expiry,"06/27");
});
