class KeyValueObservable {
    #dependents = {};
    constructor(observable = {}){
        observable = observable || {};
        const changed = this.changed.bind(this);
        const cached = Object.assign({}, observable);
        Object.keys(observable).forEach(key => {
            Reflect.defineProperty(this, key, {
                get(){
                    return cached[key];
                },
                set(value){
                    const old = cached[key];
                    cached[key] = value;
                    changed(key, old, value);
                }
            })
        })
    }
    changed(key, old, value){
        if(!this.#dependents[key]) return;
        this.#dependents[key]?.forEach(o=>o.update(key, old, value));
    }
    observe(key, dependent){
        if(!this.#dependents[key]) this.#dependents[key] = [];
        this.#dependents[key].push(dependent);
    }
    commit(){

    }
}
export default KeyValueObservable;