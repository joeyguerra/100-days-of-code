import assert from 'assert';
import fs from 'fs';
import { createClient } from 'redis';
import Parser from '../inventory/SqlParser.mjs'
import AdjustmentMessage from '../inventory/AdjustmentMessage.mjs';

const streamKey = process.env.STREAM_KEY || 'parseit';
const sqlFileName = process.env.SQL_FILE;
if(!sqlFileName) {
    throw new Error('SQL_FILE environment variable is not set');
}
describe('Parse some code', ()=>{
    it.skip('Delete it', async ()=>{
        const client = createClient({password: 'hgmaDVMDFTv'});
        client.on('error', err => console.error(err));
        await client.connect()
        await client.del(streamKey);
        assert.ok(true);
    });
    it('Parse it', async ()=>{
        const data = await fs.promises.readFile(sqlFileName, 'utf8');
        const actual = Parser.parse(data);
        const expected = new AdjustmentMessage({
            sku: "224746",
            quantity: "66",
            source: "",
            adj_type: "ADJ AVLS",
            line_id: "1",
            source_id: "241289572000001",
            target: "RN1"
        }, "Nov 13 2021  5:25PM");
        assert.ok(actual.length > 0);
        assert.deepEqual(actual[0], expected);
    });
    it.skip('Map it', async ()=>{
        const client = createClient({password: 'hgmaDVMDFTv'});
        client.on('error', err => console.error(err));
        await client.connect()

        const data = await fs.promises.readFile(sqlFileName, 'utf8');
        const actual = Parser.parse(data);
        const streamFormat = actual.map(adjustmentMessage=>{
            return Object.keys(adjustmentMessage).flatMap(key =>  [key, adjustmentMessage[key]]);
        });
        for await (const message of actual){
            const stream = await client.xAdd(streamKey, '*', message);
        }
        assert.ok(actual.length > 0);
    });
});

//INSERT INTO StageShipmentMessage([ShipmentMessageID],[ResponseObject],[ShipmentType],[ShipmentTypeStepSetID],[ErrorMessage],[AddDate])VALUES('ID:gs-supplychain-inv-adj-service-7cdcc5755c-6tqmv-40283-1634859520123-3:2111:1:1:1',
//'{"sku":"202704","quantity":-1,"source":"","target":"RN1","adj_type":"ADJ AVLS","source_id":"241275414000001","line_id":"1"}','ADJ_AVLS','10000','','Nov 13 2021  4:06PM')

/*
build views
f(events) -> state
    match f(state, event) -> state

receive commands
f(state, command) -> events
*/
