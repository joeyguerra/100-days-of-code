class InventoryWasAdjustedEvent {
    constructor(sku, quantity, location) {
        this.sku = sku;
        this.quantity = quantity;
        this.location = location;
    }
}
export {
    InventoryWasAdjustedEvent
};