import { InventoryWasAdjustedEvent } from './Events.mjs';
import { InventoryView } from './Views.mjs';
class InventoryViewBuilder {
    constructor(views){
        this.views = views;
    }
    apply1(initial, events){
        const v = events.reduce((state, current)=>{
            if(current instanceof InventoryWasAdjustedEvent){
                return this.#applyEvent(state, current);
            }
            return state;
        }, initial);
        return v;
    }
    #applyEvent(state, event){
        const quantity = Math.max(state.quantity + event.quantity, 0);
        let view = this.views.find(v => v.sku == event.sku && v.location == event.location);
        if(!view){
            view = new InventoryView(event.sku, quantity, event.location);
            this.views.push(view);
        } else {
            view.quantity = quantity;
        }
        return view;
    }
    apply(state, event){
        const quantity = Math.max(state.quantity + event.quantity, 0);
        let view = this.views.find(v => v.sku == event.sku && v.location == event.location);
        if(!view){
            view = new InventoryView(event.sku, quantity, event.location);
            this.views.push(view);
        } else {
            view.quantity = quantity;
        }
        return view;
    }
}

export {
    InventoryViewBuilder
};