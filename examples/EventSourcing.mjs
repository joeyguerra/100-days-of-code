import assert from 'assert';
import ObservableLog from '../ObservableLog.mjs';

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

// View builder
class InventoryViewBuilder {
    constructor(){}
    apply(initial, events){
        return events.reduce((state, current)=>{
            if(current instanceof InventoryWasAdjusted){
                return this.#applyEvent(state, current);
            }
            return state;
        }, initial);
    }
    #applyEvent(state, event){
        let quantity = Math.max(state.quantity + event.quantity, 0);
        return new Inventory(event.sku, quantity, event.location);
    }
}

// Model
class Inventory {
    constructor(sku, quantity, location){
        this.sku = sku;
        this.quantity = quantity;
        this.location = location;
    }
}
/*
build views
f(events) -> state
    match f(state, event) -> state

receive commands
f(state, command) -> events
*/

// Domain
class Domain {
    #adjustInventory = new AdjustInventory();
    constructor() {}
    *receive(command) {
        if(command instanceof AdjustInventory){
            yield* this.#adjustInventory.receive(command);
        }
        return null;
    }
}

// Commands
class AdjustInventory {
    constructor(sku, quantity, location) {
        this.sku = sku;
        this.quantity = quantity;
        this.location = location;
    }
    *receive(command) {
        yield new InventoryWasAdjusted(command.sku, command.quantity, command.location);
    }
}

// Events
class InventoryWasAdjusted {
    constructor(sku, quantity, location) {
        this.sku = sku;
        this.quantity = quantity;
        this.location = location;
    }
}