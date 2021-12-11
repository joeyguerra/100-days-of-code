
import { AdjustInventoryCommand, CommandProcessor, InMemoryCommandQueue } from './Commands.mjs';
import Domain from './Domain.mjs';
import ObservableLog from '../ObservableLog.mjs';

const domain = new Domain();
const queue = new InMemoryCommandQueue();
const store = new ObservableLog();
const processor = new CommandProcessor(new DecisionState(), queue, store, domain);

setInterval(()=>{
    queue.enqueue(new AdjustInventoryCommand(`sku-${Math.ceil(Math.random()*10)}`, Math.floor(Math.random()*100), 'LOC'));
}, 1000);

let interval = setInterval(async ()=>{
    await processor.Process(queue, store, domain);
}, 500);
