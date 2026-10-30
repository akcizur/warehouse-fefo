import test from "node:test";
import assert from "node:assert/strict";
import {expiry,isValidExpiry,nextId} from "../src/domain.ts";

test("pack IDs follow P-RR-0001 and increment only within the same year",()=>{
  assert.equal(nextId("P-26",["P-26-0001","P-26-0003","P-25-9999"]), "P-26-0004");
});

test("movement IDs use six digits",()=>{
  assert.equal(nextId("MOV",["MOV-000002","MOV-000009"]), "MOV-000010");
});

test("expiry accepts MM/RR only",()=>{
  assert.equal(isValidExpiry("06/27"),true);
  assert.equal(isValidExpiry("6/27"),false);
  assert.equal(isValidExpiry("13/27"),false);
  assert.equal(isValidExpiry("00/27"),false);
});

test("FEFO date sorting places earlier expiry first and invalid dates last",()=>{
  assert.ok(expiry("06/27")<expiry("12/27"));
  assert.ok(expiry("12/27")<expiry("01/28"));
  assert.equal(expiry("bad"),Number.MAX_SAFE_INTEGER);
});
