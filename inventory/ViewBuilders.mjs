import { InventoryWasAdjusted } from './Events.mjs';
import { Inventory } from './Views.mjs';
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

export {
    InventoryViewBuilder
};