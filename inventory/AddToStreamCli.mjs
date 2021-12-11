import fs from 'fs';
import { createClient } from 'redis';
import Parser from '../inventory/SqlParser.mjs'

const streamKey = process.argv[2];
const sqlFileName = process.argv[3];
const count = process.argv[4];
if(!streamKey){
    throw new Error('Stream key is required');
}
if(!sqlFileName) {
    throw new Error('SQL_FILE environment variable is not set');
}
if(!count) {
    console.log('No count specified, defaulting to all');
}


await (async()=>{
    console.log('starting');
    const client = createClient({password: 'hgmaDVMDFTv'});
    client.on('error', err => console.error(err));
    await client.connect()
    
    const data = await fs.promises.readFile(sqlFileName, 'utf8');
    const actual = Parser.parse(data);
    const streamFormat = actual.map(adjustmentMessage=>{
        return Object.keys(adjustmentMessage).flatMap(key =>  [key, adjustmentMessage[key]]);
    });
    let counter = 0;
    for await (const message of actual){
        const stream = await client.xAdd(streamKey, '*', message);
        counter++;
        if(count && counter >= count){
            break;
        }
    }
    await client.disconnect();
    console.log('done');
})();

