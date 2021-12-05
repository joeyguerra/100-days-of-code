import assert from 'assert';
import ObservableLog from '../ObservableLog.mjs';
import Domain from '../inventory/Domain.mjs';
import { InventoryWasAdjusted } from '../inventory/Events.mjs';
import { AdjustInventory } from '../inventory/Commands.mjs';
import { InventoryViewBuilder } from '../inventory/ViewBuilders.mjs';

describe('Event Sourcing inventory', ()=>{
    it('Receiving an AdjustInventory command should result in an InventoryWasAdjusted event', ()=>{
        const command = new AdjustInventory('123', 3, 'DC1');
        const expected = new ObservableLog(new InventoryWasAdjusted('123', 3, 'DC1'));
        const domain = new Domain();
        const actual = new ObservableLog();
        for(const e of domain.receive(command)){
            actual.append(e);
        }
        assert.deepEqual(actual, expected, 'should be a list of 1 events');
    });
    it('InventoryViewBuilder should build itself with an InventoryWasAdjusted event', ()=>{
        const events = new ObservableLog(new InventoryWasAdjusted('123', 3, 'DC1'));
        const expected = {
            sku: '123',
            quantity: 3,
            location: 'DC1'
        };
        const viewBuidler = new InventoryViewBuilder()
        const actual = viewBuidler.apply({quantity: 0}, events);
        assert.deepEqual(actual, expected);
    });
    it('2 InventoryWasAdjusted events should result in the correct inventory quantity', ()=>{
        const events = new ObservableLog(
            new InventoryWasAdjusted('123', 3, 'DC1'),
            new InventoryWasAdjusted('123', -1, 'DC1')
        );
        const expected = {
            sku: '123',
            quantity: 2,
            location: 'DC1'
        };
        const viewBuidler = new InventoryViewBuilder()
        const actual = viewBuidler.apply({quantity: 0}, events);
        assert.deepEqual(actual, expected);
    });
    it('Negative InventoryWasAdjusted events should not cause inventory to go below zero', ()=>{
        const events = new ObservableLog(
            new InventoryWasAdjusted('123', 3, 'DC1'),
            new InventoryWasAdjusted('123', -4, 'DC1')
        );
        const expected = {
            sku: '123',
            quantity: 0,
            location: 'DC1'
        };
        const viewBuidler = new InventoryViewBuilder(events);
        const actual = viewBuidler.apply({
            quantity: 0,
            sku: '',
            location: ''
        }, events);
        assert.deepEqual(actual, expected);
    });
});

/*
build views
f(events) -> state
    match f(state, event) -> state

receive commands
f(state, command) -> events
*/
