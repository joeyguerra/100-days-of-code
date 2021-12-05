import { AdjustInventory } from './Commands.mjs';

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
export default Domain;