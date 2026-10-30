import type{WarehouseData}from"./types";
const KEY="warehouse-fefo-demo";
const empty:WarehouseData={materials:[],packs:[],boxes:[],locations:[],movements:[]};
export const config={get url(){return localStorage.getItem("warehouse-api-url")||""},set url(v:string){localStorage.setItem("warehouse-api-url",v)}};
export function localData():WarehouseData{try{return JSON.parse(localStorage.getItem(KEY)||"null")||empty}catch{return empty}}
export function saveLocal(d:WarehouseData){localStorage.setItem(KEY,JSON.stringify(d))}
export function hasData(d:WarehouseData){return d.materials.length+d.packs.length+d.boxes.length+d.locations.length+d.movements.length>0}
export async function request<T>(action:string,payload:Record<string,unknown>={}):Promise<T>{if(!config.url)throw new Error("Není nastavená URL Apps Script API.");const u=new URL(config.url);if(action==="get"){u.searchParams.set("action","get");const r=await fetch(u);const j=await r.json();if(!j.ok)throw new Error(j.error||"API chyba");return j.data as T}const r=await fetch(u,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({action,...payload})});const j=await r.json();if(!j.ok)throw new Error(j.error||"API chyba");return j.data as T}
export {nextId,expiry,isValidExpiry} from "./domain";
export const seed:WarehouseData={materials:[{id:"MAT-MB-01",name:"Magnesium bisglycinate 12%",unit:"kg"},{id:"MAT-AA-01",name:"Bylinný extrakt",unit:"kg"}],locations:[{id:"REG-A-01",name:"Regál A · pozice 01"},{id:"PAL-A-01",name:"Paleta A · pozice 01"}],boxes:[{id:"BOX-A-01",locationId:"REG-A-01"}],packs:[{id:"P-26-0001",materialId:"MAT-MB-01",batch:"MB-2026-01",expiry:"06/27",boxId:"BOX-A-01",status:"nový",initialWeight:5,receivedAt:new Date().toISOString()}],movements:[]};
const PENDING_KEY="warehouse-fefo-pending";
export interface PendingMutation{id:string;action:string;payload:Record<string,unknown>}
export function pendingMutations():PendingMutation[]{try{const parsed=JSON.parse(localStorage.getItem(PENDING_KEY)||"[]");return Array.isArray(parsed)?parsed:[]}catch{return[]}}
export function enqueueMutation(action:string,payload:Record<string,unknown>){const items=pendingMutations();items.push({id:crypto.randomUUID(),action,payload});localStorage.setItem(PENDING_KEY,JSON.stringify(items))}
export function removePendingMutation(id:string){const items=pendingMutations().filter(item=>item.id!==id);localStorage.setItem(PENDING_KEY,JSON.stringify(items))}
