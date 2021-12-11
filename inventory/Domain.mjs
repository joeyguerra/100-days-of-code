import { AdjustInventoryCommand } from './Commands.mjs';
import { InventoryWasAdjustedEvent } from './Events.mjs';
import { InventoryViewBuilder } from './ViewBuilders.mjs';
import { InventoryView } from './Views.mjs';

class Domain {
    #adjustInventoryCommand = new AdjustInventoryCommand();
    #inventoryView = new InventoryView('', 0, '');    
    constructor() {
        this.views = [];
        this.inventoryViewBuilder = new InventoryViewBuilder(this.views);
    }

    apply(events) {
        for(let event of events){
            if(event instanceof InventoryWasAdjustedEvent){
                this.#applyInventoryWasAdjusted(this.#inventoryView, event);
            }
        }
    }
    #applyInventoryWasAdjusted(state, event){
        return this.inventoryViewBuilder.apply(state, event);
    }
    *handle(initialState, command) {
        if(command instanceof AdjustInventoryCommand){
            yield* this.#adjustInventoryCommand.handle(initialState, command);
        }
        return null;
    }
}
class DecisionState {
    constructor(){}
}

export {
    Domain,
    DecisionState
};