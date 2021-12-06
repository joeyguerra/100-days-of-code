import { InventoryWasAdjusted } from './Events.mjs';
class AdjustInventory {
    constructor(sku, quantity, location) {
        this.sku = sku;
        this.quantity = quantity;
        this.location = location;
    }
    *handle(command) {
        yield new InventoryWasAdjusted(command.sku, command.quantity, command.location);
    }
}

export {
    AdjustInventory
};