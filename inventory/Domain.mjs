import { AdjustInventory } from './Commands.mjs';

class Domain {
    #adjustInventory = new AdjustInventory();
    constructor() {}
    *handle(command) {
        if(command instanceof AdjustInventory){
            yield* this.#adjustInventory.handle(command);
        }
        return null;
    }
}
export default Domain;