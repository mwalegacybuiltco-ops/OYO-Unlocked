import test from 'node:test';
import assert from 'node:assert/strict';
import * as f from '../../functions/index.js';
import {freshGame} from '../../functions/game/engine.js';
import {guideReply,assessBoss} from '../../functions/adapters/compass.js';
import {createCheckoutSession,verifyBillingEvent} from '../../functions/adapters/subscription.js';
for(const name of ['getPlayer','gameAction','submitProof','reviewQueue','reviewProof','askGuide','battle','createCheckout','saveResources','getAdminOverview','saveAnnouncement'])test(`${name} rejects anonymous callers`,async()=>{await assert.rejects(()=>f[name].run({data:{}}),e=>e.code==='unauthenticated');});
test('players cannot forge trusted review or boss actions',async()=>{for(const type of ['review','boss','submit'])await assert.rejects(()=>f.gameAction.run({auth:{uid:'alice',token:{}},data:{type}}),/server-only/);});
test('unprivileged accounts cannot review evidence',async()=>{await assert.rejects(()=>f.reviewProof.run({auth:{uid:'alice',token:{}},data:{uid:'bob',proofId:'p1',approved:true}}),/Owner access/);});
test('reviewers cannot review their own evidence',async()=>{await assert.rejects(()=>f.reviewProof.run({auth:{uid:'alice',token:{reviewer:true}},data:{uid:'alice',proofId:'p1',approved:true,feedback:'Own proof review attempt.'}}),/own evidence/);});
test('unprivileged accounts cannot list the review queue',async()=>{await assert.rejects(()=>f.reviewQueue.run({auth:{uid:'alice',token:{}},data:{}}),/Owner access/);});
test('unconnected checkout and webhook fail closed',async()=>{await assert.rejects(()=>createCheckoutSession({uid:'alice',email:null}),/not configured/);await assert.rejects(()=>verifyBillingEvent(Buffer.from('{}'),{}),/not configured/);});
test('missing Compass secret fails instead of inventing a response',async()=>{const before=process.env.OPENAI_API_KEY;delete process.env.OPENAI_API_KEY;try{await assert.rejects(()=>guideReply({game:freshGame(),proofs:[],guideId:'strategist',message:'Help me start'}),/connection is unavailable/);}finally{if(before!==undefined)process.env.OPENAI_API_KEY=before;}});
test('live Compass response uses the existing model and separates system from player input',async()=>{
 const oldFetch=globalThis.fetch,oldKey=process.env.OPENAI_API_KEY,oldModel=process.env.OPENAI_MODEL;
 process.env.OPENAI_API_KEY='test-only-not-a-real-key';process.env.OPENAI_MODEL='gpt-5';let captured;
 globalThis.fetch=async(url,req)=>{captured={url,body:JSON.parse(req.body)};return {ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:'A response supplied by the mocked service for this test.'}]}]})};};
 try{const result=await guideReply({game:freshGame(),proofs:[],guideId:'strategist',message:'Help me start'});assert.equal(captured.url,'https://api.openai.com/v1/responses');assert.equal(captured.body.model,'gpt-5');assert.equal(captured.body.input[0].role,'system');assert.equal(captured.body.input[1].role,'user');assert.equal(captured.body.store,false);assert.equal(result.mode,'compass');assert.match(result.text,/mocked service/);}
 finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=oldKey;if(oldModel===undefined)delete process.env.OPENAI_MODEL;else process.env.OPENAI_MODEL=oldModel;}
});
test('players cannot change resources or moderate gamer chat',async()=>{for(const name of ['saveResources','getAdminOverview','saveAnnouncement'])await assert.rejects(()=>f[name].run({auth:{uid:'alice',token:{}},data:{}}),/access required/);});

test('boss assessment requires every criterion and returns a reactive objection',async()=>{
 const oldFetch=globalThis.fetch,oldKey=process.env.OPENAI_API_KEY;process.env.OPENAI_API_KEY='test-only-not-a-real-key';let captured;
 globalThis.fetch=async(url,req)=>{captured=JSON.parse(req.body);return {ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({understanding:true,action:false,check:true,feedback:'You understood the budget concern, but need to clarify scope before proposing payment.',nextObjection:'I still do not know which deliverables I would receive for that price.'})}]}]})};};
 try{const {worlds}=await import('../../functions/game/content.js');const result=await assessBoss({game:freshGame(),proofs:[],world:worlds[2],answer:'I hear that budget is a concern; let us clarify the scope and next step.'});assert.equal(result.passed,false);assert.match(result.nextObjection,/deliverables/);assert.equal(captured.text.format.strict,true);assert.match(captured.input[0].content,/No cartoon insults/);}
 finally{globalThis.fetch=oldFetch;if(oldKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=oldKey;}
});
for(const name of ['sendChat','reportChat','moderateChat','getChatReports','resolveChatReport'])test(`${name} community endpoint rejects anonymous callers`,async()=>{await assert.rejects(()=>f[name].run({data:{}}),e=>e.code==='unauthenticated');});
for(const name of ['moderateChat','getChatReports','resolveChatReport'])test(`${name} requires owner privileges`,async()=>{await assert.rejects(()=>f[name].run({auth:{uid:'player',token:{}},data:{}}),/Owner access required/);});
