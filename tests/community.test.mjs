import test from 'node:test';
import assert from 'node:assert/strict';
import {cleanResources,cleanChat} from '../functions/game/community.js';
const product={id:'p1',title:'A specific LWA product',description:'Optional additional education.',url:'https://example.com/product?ref=owner',world:'sales'};
test('product referral URLs and their parameters are preserved',()=>{const c=cleanResources({mainUrl:'https://example.com/?ref=owner',mainTitle:'My LWA link',products:[product]});assert.equal(c.products[0].url,product.url);assert.equal(c.mainUrl,'https://example.com/?ref=owner');});
test('resources can be empty without affecting progression',()=>{assert.deepEqual(cleanResources({mainUrl:'',mainTitle:'Explore LWA',products:[]}).products,[]);});
test('unsafe, invalid, duplicate and oversized resource lists are rejected',()=>{assert.throws(()=>cleanResources({products:[{...product,url:'javascript:alert(1)'}]}));assert.throws(()=>cleanResources({products:[{...product,world:'unknown'}]}));assert.throws(()=>cleanResources({products:[product,product]}));assert.throws(()=>cleanResources({products:Array(21).fill(product)}));});
test('chat requires meaningful bounded text',()=>{assert.equal(cleanChat('  Hello fellow players!  '),'Hello fellow players!');assert.throws(()=>cleanChat(' '));assert.throws(()=>cleanChat('x'.repeat(801)));});
