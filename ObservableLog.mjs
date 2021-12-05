import KeyValueObservable from './KeyValueObservable.mjs';
class ObservableLog extends Array{
    #observable = new KeyValueObservable(null);
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
}
export default ObservableLog;