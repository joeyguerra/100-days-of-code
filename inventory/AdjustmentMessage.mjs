class AdjustmentMessage {
    constructor({sku, quantity, source, target, adj_type, source_id, line_id}, date) {
        this.sku = sku.toString();
        this.quantity = quantity?.toString();
        this.sourceFc = source?.toString() || '';
        this.targetFc = target?.toString() || '';
        this.adjtype = adj_type?.toString() || '';
        this.sourceId = source_id?.toString() || '';
        this.lineId = line_id?.toString() || '';
        this.sourceSendTimeStamp = date?.toString() || '';
    }
}
export default AdjustmentMessage;