import KeyValueObservable from './KeyValueObservable.mjs';
class ObservableList extends Array{
    #observable = new KeyValueObservable(null);
    constructor(...args) {
        super(...args);
    }
    push(item){
        super.push(item);
        this.#observable.changed("push", null, item);
    }
    pop(){
        const item = super.pop();
        this.#observable.changed("pop", null, item);
        return item;
    }
    remove(d){
        let i = 0;
        let ubounds = this.length;
        let deleted = [];
        for(i; i<ubounds;i++){
            if(d(this[i], i)){
                deleted = this.splice(i, 1);
                this.delegate.changed("remove", deleted[0], i);
                break;
            }
        }
        return deleted[0];
    }
    observe(key, observer){
        this.#observable.observe(key, observer);
    }
}
export default ObservableList;