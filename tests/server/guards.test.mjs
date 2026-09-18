import test from 'node:test';
import assert from 'node:assert/strict';
import * as f from '../../functions/index.js';
import {freshGame} from '../../functions/game/engine.js';
import {createCheckoutSession,verifyBillingEvent} from '../../functions/adapters/subscription.js';
for(const name of ['getPlayer','gameAction','submitProof','reviewQueue','reviewProof','askGuide','battle','createCheckout','saveResources','getAdminOverview','saveAnnouncement'])test(`${name} rejects anonymous callers`,async()=>{await assert.rejects(()=>f[name].run({data:{}}),e=>e.code==='unauthenticated');});
test('players cannot forge trusted review or boss actions',async()=>{for(const type of ['review','boss','submit'])await assert.rejects(()=>f.gameAction.run({auth:{uid:'alice',token:{}},data:{type}}),/server-only/);});
test('unprivileged accounts cannot review evidence',async()=>{await assert.rejects(()=>f.reviewProof.run({auth:{uid:'alice',token:{}},data:{uid:'bob',proofId:'p1',approved:true}}),/Owner access/);});
test('reviewers cannot review their own evidence',async()=>{await assert.rejects(()=>f.reviewProof.run({auth:{uid:'alice',token:{reviewer:true}},data:{uid:'alice',proofId:'p1',approved:true,feedback:'Own proof review attempt.'}}),/own evidence/);});
test('unprivileged accounts cannot list the review queue',async()=>{await assert.rejects(()=>f.reviewQueue.run({auth:{uid:'alice',token:{}},data:{}}),/Owner access/);});
test('unconnected checkout and webhook fail closed',async()=>{await assert.rejects(()=>createCheckoutSession({uid:'alice',email:null}),/not configured/);await assert.rejects(()=>verifyBillingEvent(Buffer.from('{}'),{}),/not configured/);});
test('players cannot change resources or moderate gamer chat',async()=>{for(const name of ['saveResources','getAdminOverview','saveAnnouncement'])await assert.rejects(()=>f[name].run({auth:{uid:'alice',token:{}},data:{}}),/access required/);});

for(const name of ['sendChat','reportChat','moderateChat','getChatReports','resolveChatReport'])test(`${name} community endpoint rejects anonymous callers`,async()=>{await assert.rejects(()=>f[name].run({data:{}}),e=>e.code==='unauthenticated');});
for(const name of ['moderateChat','getChatReports','resolveChatReport'])test(`${name} requires owner privileges`,async()=>{await assert.rejects(()=>f[name].run({auth:{uid:'player',token:{}},data:{}}),/Owner access required/);});
