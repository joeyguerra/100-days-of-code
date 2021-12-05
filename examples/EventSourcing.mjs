import assert from 'assert';

describe('just starting up', ()=>{
    it('should just do something', ()=>{
        const command = new AdjustInventory('123', 3, 'DC1');
        const expected = [new InventoryWasAdjusted('123', 3, 'DC1')];
        const domain = new Domain();
        const actual = [];
        for(const e of domain.receive(command)){
            actual.push(e);
        }
        assert.deepEqual(actual, expected, 'should be a list of 1 events');
    });
    it('should take events and produce state', ()=>{
        const events = [new InventoryWasAdjusted('123', 3, 'DC1')];
        const expected = {
            sku: '123',
            quantity: 3,
            location: 'DC1'
        };
        const viewBuidler = new InventoryViewBuilder()
        const actual = viewBuidler.apply({quantity: 0}, events);
        assert.deepEqual(actual, expected);
    });
    it('should add the adjusted quantity to the inventory', ()=>{
        const events = [
            new InventoryWasAdjusted('123', 3, 'DC1'),
            new InventoryWasAdjusted('123', -1, 'DC1')
        ];
        const expected = {
            sku: '123',
            quantity: 2,
            location: 'DC1'
        };
        const viewBuidler = new InventoryViewBuilder()
        const actual = viewBuidler.apply({quantity: 0}, events);
        assert.deepEqual(actual, expected);
    });
    it('should never be less than zero', ()=>{
        const events = [
            new InventoryWasAdjusted('123', 3, 'DC1'),
            new InventoryWasAdjusted('123', -4, 'DC1')
        ];
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

class InventoryViewBuilder {
    constructor(){}
    apply(initial, events){
        return events.reduce((state, current)=>{
            if(current instanceof InventoryWasAdjusted){
                return this.applyEvent(state, current);
            }
            return state;
        }, initial);
    }
    applyEvent(state, event){
        let quantity = Math.max(state.quantity + event.quantity, 0);
        return new Inventory(event.sku, quantity, event.location);
    }
}

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

class Domain {
    constructor() {}
    *receive(command) {
        yield new InventoryWasAdjusted(command.sku, command.quantity, command.location);
    }
}

class AdjustInventory {
    constructor(sku, quantity, location) {
        this.sku = sku;
        this.quantity = quantity;
        this.location = location;
    }
}
class InventoryWasAdjusted {
    constructor(sku, quantity, location) {
        this.sku = sku;
        this.quantity = quantity;
        this.location = location;
    }
}