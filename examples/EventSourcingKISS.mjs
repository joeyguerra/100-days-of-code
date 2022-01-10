import assert from 'assert';
import ObservableLog from '../ObservableLog.mjs';
import Match from '../Match.mjs';

class AdjustInventoryCommand {
    constructor(sku, quantity, location, occurred) {
        this.Sku = sku;
        this.Quantity = quantity;
        this.Location = location;
        this.Occurred = occurred;
    }
}
class ReportDamagedInventoryCommand {
    constructor(sku, quantity, location, occurred) {
        this.Sku = sku;
        this.Quantity = quantity;
        this.Location = location;
        this.Occurred = occurred;
    }
}
class InventoryWasDamagedEvent {
    constructor(sku, quantity, location, occurred) {
        this.Sku = sku;
        this.Quantity = quantity;
        this.Location = location;
        this.Occurred = occurred;
    }
}
class InventoryWasAdjustedEvent {
    constructor(sku, quantity, location, occurred) {
        this.Sku = sku;
        this.Quantity = quantity;
        this.Location = location;
        this.Occurred = occurred;
    }
}
class InMemoryCommandQueue {
    #queue = [];
    constructor(){}
    async enqueue(command){
        this.#queue.push(command);
    }
    *dequeue(){
        yield this.#queue.shift();
        return null;
    }
}
class InventoryView {
    constructor(sku, quantity, location, date){
        this.Sku = sku;
        this.Quantity = quantity;
        this.Location = location;
        this.AsOf = date;
    }
    static GetInventoryByDay(state, getEvents){
        return getEvents().reduce((acc, event) => {
            return Match({
                InventoryWasAdjustedEvent: (view, e)=> InventoryView.#adjustInventory(view, e),
                InventoryWasDamagedEvent: (view, e)=> InventoryView.#damageInventory(view, e)
            }, event.constructor.name)(acc, event);
        }, state);
    }
    static #damageInventory(state, event){
        if(event.Sku === state.Sku && event.Location === state.Location && event.Occurred.getDate() == state.AsOf.getDate()){
            state.Location = event.Location;
            state.Quantity -= event.Quantity;
        }
        return state;
    }
    static #adjustInventory(state, event){
        if(event.Sku === state.Sku && event.Location === state.Location && event.Occurred.getDate() == state.AsOf.getDate()){
            state.Location = event.Location;
            state.Quantity += event.Quantity;
        }
        return state;
    }
}
class DamangedInventoryView {
    constructor(sku, quantity, location, occurred){
        this.Sku = sku;
        this.Quantity = quantity;
        this.Location = location;
        this.AsOf = occurred;
    }
}

class ImperativeShell {
    #interval;
    #queue;
    constructor(decisionState, queue, events) {
        this.DecisionState = decisionState;
        this.#queue = queue;
        this.Events = events;
    }
    IterateOverCommandQueue() {
        for(let c of this.#queue.dequeue()) {
            for(let e of this.#handle(this.DecisionState, c)) {
                this.Events.append(e);
            }
        }
    }
    Start(period = 1000) {
        this.#interval = setInterval(() => this.IterateOverCommandQueue(), period);
    }
    Apply(events) {
        return events.reduce((accumulator, e) => {
            return this.#match(accumulator, e);
        }, this.DecisionState);
    }
    async Input(command) {
        await this.#queue.enqueue(command);
    }
    *#handle(state, command){
        if(command instanceof AdjustInventoryCommand){
            yield new InventoryWasAdjustedEvent(command.Sku, command.Quantity, command.Location, command.Occurred);        
        } else if(command instanceof ReportDamagedInventoryCommand){
            yield new InventoryWasDamagedEvent(command.Sku, command.Quantity, command.Location, command.Occurred);
        }
        return null;
    }
    #match(state, e){
        if(!state.Views) state.Views = [];
        return Match({
            InventoryWasAdjustedEvent: (state, e) => this.#adjustInventory(state, e),
            InventoryWasDamagedEvent: (state, e) => this.#damageInventory(state, e)
        }, e.constructor.name)(state, e);
    }
    #adjustInventory(state, e){
        let view = state.Views.find(v => v instanceof InventoryView && v.Sku == e.Sku && v.Location == e.Location);
        if(!view) {
            view = new InventoryView(e.Sku, e.Quantity, e.Location);
            state.Views.push(view);
        } else {
            view.Quantity += e.Quantity;
        }
        return state;
    }
    #damageInventory(state, e){
        let view = state.Views.find(v => v instanceof DamangedInventoryView && v.Sku == e.Sku && v.Location == e.Location);
        let inventoryView = state.Views.find(v => v instanceof InventoryView && v.Sku == e.Sku && v.Location == e.Location);
        if(!view) {
            view = new DamangedInventoryView(e.Sku, e.Quantity, e.Location, e.Occurred);
            state.Views.push(view);
        } else {
            view.Quantity += e.Quantity;
            view.Occurred = e.Occurred;
        }
        if(!inventoryView) {
            inventoryView = new InventoryView(e.Sku, -1 * e.Quantity, e.Location);
            state.Views.push(inventoryView);
        } else {
            inventoryView.Quantity -= e.Quantity;
        }
        return state;
    }
}

describe('Experimenting: reduce indirection', ()=>{
    it('Given a AdjustInventoryCommand, get an InventoryView', async ()=>{
        const queue = new InMemoryCommandQueue();
        const theWorld = {
            Views: []
        };
        const events = new ObservableLog();
        const expected = {
            Views: [ new InventoryView('123-ADJUST', 3, 'DC-KISS') ]
        };
        const shell = new ImperativeShell(theWorld, queue, events);
        await shell.Input(new AdjustInventoryCommand('123-ADJUST', 3, 'DC-KISS'));
        shell.IterateOverCommandQueue();
        const actual = shell.Apply(events);
        assert.deepEqual(actual, expected);
    });
    it('Report damaged inventory results in a damnaged inventory event and an inventory adjustment event with negative the damaged quantity', async ()=>{
        const queue = new InMemoryCommandQueue();
        const theWorld = {
            Views: []
        };
        const today = new Date();
        const events = new ObservableLog();
        const expected = new ObservableLog(
            new InventoryWasDamagedEvent('123-DAMAGED-EVENTS', 3, 'DC-DAMANAGED', today)
        );
        const shell = new ImperativeShell(theWorld, queue, events);
        await shell.Input(new ReportDamagedInventoryCommand('123-DAMAGED-EVENTS', 3, 'DC-DAMANAGED', today));
        shell.IterateOverCommandQueue();
        const actual = shell.Events;
        assert.deepEqual(actual, expected);
    });
    it('Report damanged inventory, inventory view should reflect reduction in quantity', async ()=>{
        const queue = new InMemoryCommandQueue();
        const theWorld = {
            Views: []
        };
        const today = new Date();
        const events = new ObservableLog();
        const expected = {
            Views: [
                new DamangedInventoryView('123-DAMANGED', 2, 'DC-DAMANAGED', today),
                new InventoryView('123-DAMANGED', -2, 'DC-DAMANAGED')
            ]
        };
        const shell = new ImperativeShell(theWorld, queue, events);
        await shell.Input(new ReportDamagedInventoryCommand('123-DAMANGED', 2, 'DC-DAMANAGED', today));
        shell.IterateOverCommandQueue();
        const actual = shell.Apply(events);
        assert.deepEqual(actual, expected);
    });
    it('ViewBuilder can project from a list of events', async ()=>{
        const today = new Date();
        const events = new ObservableLog(
            new InventoryWasDamagedEvent('123-DAMANGED', 2, 'DC-DAMANAGED', today),
            new InventoryWasAdjustedEvent('123-DAMANGED', 3, 'DC-DAMANAGED', today)
        );
        const actual = InventoryView.GetInventoryByDay(new InventoryView('123-DAMANGED', 0, 'DC-DAMANAGED', today), ()=>events);
        const expected = new InventoryView('123-DAMANGED', 1, 'DC-DAMANAGED', today);
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
