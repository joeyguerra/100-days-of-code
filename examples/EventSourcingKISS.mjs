import assert from 'assert';
import ObservableLog from '../ObservableLog.mjs';
import { InventoryWasAdjustedEvent } from '../inventory/Events.mjs';
import { AdjustInventoryCommand, InMemoryCommandQueue } from '../inventory/Commands.mjs';
import { InventoryView } from '../inventory/Views.mjs';

describe('Experimenting: reduce indirection', ()=>{
    it('Given a command, get an event', async ()=>{
        const queue = new InMemoryCommandQueue();
        const events = new ObservableLog();
        const theWorld = {
            views: []
        };
        const expected = {
            views: [ new InventoryView('123', 3, 'DC-KISS') ]
        };
        const handle = (state, command)=>{
            if(command instanceof AdjustInventoryCommand){
                events.append(new InventoryWasAdjustedEvent(command.sku, command.quantity, command.location));
            }
        };
        const match = (state, e)=>{
            if(e instanceof InventoryWasAdjustedEvent){
                let view = state.views.find(v => v instanceof InventoryView && v.sku == e.sku && v.location == e.location);
                if(!view) {
                    view = new InventoryView(e.sku, e.quantity, e.location);
                    state.views.push(view);
                } else {
                    view.quantity += e.quantity;
                }
            }
            return state;
        };
        const apply = events => {
            return events.reduce((accumulator, e) => {
                return match(accumulator, e);
            }, theWorld);
        };
        await queue.enqueue(new AdjustInventoryCommand('123', 3, 'DC-KISS'));
        handle(theWorld, queue.dequeue().next().value);
        const actual = apply(events);
        assert.deepEqual(actual, expected);
    });
});