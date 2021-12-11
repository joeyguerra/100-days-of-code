import assert from 'assert';
import ObservableLog from '../ObservableLog.mjs';
import { Domain, DecisionState } from '../inventory/Domain.mjs';
import { InventoryWasAdjustedEvent } from '../inventory/Events.mjs';
import { AdjustInventoryCommand, CommandProcessor, InMemoryCommandQueue } from '../inventory/Commands.mjs';
import { InventoryViewBuilder } from '../inventory/ViewBuilders.mjs';
import { InventoryView } from '../inventory/Views.mjs';

describe('Left side: Command Processing', ()=>{
    it('Receiving an AdjustInventory command should result in an InventoryWasAdjustedEvent event', ()=>{
        const command = new AdjustInventoryCommand('123', 3, 'DC1');
        const expected = new ObservableLog(new InventoryWasAdjustedEvent('123', 3, 'DC1'));
        const domain = new Domain();
        const actual = new ObservableLog();
        for(const e of domain.handle({}, command)){
            actual.append(e);
        }
        assert.deepEqual(actual, expected, 'should be a list of 1 events');
    });
});
describe('Right side: Event Projection', ()=>{
    it('InventoryViewBuilder should build itself with an InventoryWasAdjustedEvent event', ()=>{
        const event = new InventoryWasAdjustedEvent('123', 3, 'DC1');
        const expected = new InventoryView('123', 3, 'DC1');
        const views = [];
        const viewBuidler = new InventoryViewBuilder(views);
        const actual = viewBuidler.apply(new InventoryView('123', 0, 'DC1'), event);
        assert.deepEqual(actual, expected);
    });
    it('2 InventoryWasAdjustedEvent events should result in the correct inventory quantity', ()=>{
        const events = new ObservableLog(
            new InventoryWasAdjustedEvent('123', 3, 'DC1'),
            new InventoryWasAdjustedEvent('123', -1, 'DC1')
        );
        const expected = new InventoryView('123', 2, 'DC1');
        const views = [];
        const viewBuidler = new InventoryViewBuilder(views);
        let actual = new InventoryView('123', 0, 'DC1'); 
        for(const e of events){
            actual = viewBuidler.apply(actual, e);
        }
        assert.deepEqual(actual, expected);
    });
    it('Negative InventoryWasAdjustedEvent events should not cause inventory to go below zero', ()=>{
        const events = new ObservableLog(
            new InventoryWasAdjustedEvent('123', 3, 'DC1'),
            new InventoryWasAdjustedEvent('123', -4, 'DC1')
        );
        const expected = new InventoryView('123', 0, 'DC1');
        const views = [];
        const viewBuidler = new InventoryViewBuilder(views);
        let actual = new InventoryView('123', 0, 'DC1'); 
        for(const e of events){
            actual = viewBuidler.apply(actual, e);
        }
        assert.deepEqual(actual, expected);
    });
});
describe('Right side: Event log traversal', ()=>{
    it('Remember a consumers last position in the event log', ()=>{
        const events = new ObservableLog(
            new InventoryWasAdjustedEvent('123', 1, 'DC1'),
            new InventoryWasAdjustedEvent('123', 1, 'DC1'),
            new InventoryWasAdjustedEvent('123', 1, 'DC1')
        );
        for(const e of events.getForConsumerId("consumter-1")){

        }
        const expected = new InventoryWasAdjustedEvent('123', 3, 'DC1');
        events.append(expected);
        const actual = [];
        for(const e of events.getForConsumerId("consumter-1")) actual.push(e);
        assert.deepEqual(actual, [expected]);
    });
    it('Consuming for the first time should start from the beginning of the log', ()=>{
        const expected = [
            new InventoryWasAdjustedEvent('123', 1, 'DC1'),
            new InventoryWasAdjustedEvent('123', 1, 'DC1')
        ];
        const events = new ObservableLog(...expected);
        for(const e of events.getForConsumerId("consumter-1")){}
        expected.push(new InventoryWasAdjustedEvent('887', 4, 'DC1'));
        events.append(new InventoryWasAdjustedEvent('887', 4, 'DC1'));
        const actual = [];
        for(const e of events.getForConsumerId("consumter-2")) actual.push(e);
        assert.deepEqual(actual, expected);
    });
});

describe('Imperative Shell', ()=>{
    it('Given an AdjustInventoryCommand, when processing, then expect an InventoryWasAdjustedEvent', async ()=>{
        const domain = new Domain();
        const queue = new InMemoryCommandQueue();
        const store = new ObservableLog();
        const processor = new CommandProcessor(new DecisionState(), queue, store, domain);
        await processor.Process(queue, store, domain);
        queue.enqueue(new AdjustInventoryCommand('123', 3, 'DC-SHELL1'));
        await processor.Process(queue, store, domain);
        const expected = new InventoryWasAdjustedEvent('123', 3, 'DC-SHELL1');
        const actual = store.getForConsumerId("consumter-1").next().value;
        assert.deepEqual(expected, actual);
    });
});

/*
build views
f(events) -> state
    match f(state, event) -> state

receive commands
f(state, command) -> events
*/
