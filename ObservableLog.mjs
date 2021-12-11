import KeyValueObservable from './KeyValueObservable.mjs';
class ObservableLog extends Array{
    #observable = new KeyValueObservable(null);
    #consumers = {};
    constructor(...args) {
        super(...args);
    }
    append(item){
        super.push(item);
        this.#observable.changed("append", null, item);
    }
    observe(key, observer){
        this.#observable.observe(key, observer);
    }
    last(){
        return this[this.length - 1];
    }
    *getForConsumerId(consumerId){
        if(!this.#consumers[consumerId]) this.#consumers[consumerId] = {position: 0};
        let i = this.#consumers[consumerId].position;
        for(i; i < this.length; i++){
            yield this[i];
        }
        this.#consumers[consumerId].position = i;
        return null;
    }
}
export default ObservableLog;