import { InventoryWasAdjustedEvent } from './Events.mjs';
class AdjustInventoryCommand {
    constructor(sku, quantity, location) {
        this.sku = sku;
        this.quantity = quantity;
        this.location = location;
    }
    *handle(initialState, command) {
        yield new InventoryWasAdjustedEvent(command.sku, command.quantity, command.location);
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
class CommandProcessor {
    #queue;
    #events;
    #domain;
    #initialDecisionState;
    constructor(initialDecisionState, queue, events, domain){
        this.#queue = queue;
        this.#events = events;
        this.#domain = domain;
        this.#initialDecisionState = initialDecisionState;
    }
    async Process(){
        for(let c of this.#queue.dequeue()){
            if(!c) continue;
            const state = this.#domain.apply(this.#events);
            const events = this.#domain.handle(state, c);
            this.#events.append(...events);
        }
    }
}
export {
    AdjustInventoryCommand,
    CommandProcessor,
    InMemoryCommandQueue
};