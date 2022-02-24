import assert from 'assert';

class ProductCatalog {
    #cache = {};
    constructor(){
    }
    addProduct(key, product){
        this.#cache[key] = product;
    }
    getProductCount(){
        return Object.keys(this.#cache).length;
    }
}

describe('Product Catalog', ()=>{
    it('how much memory is a 1000 products', ()=>{
        const catalog = new ProductCatalog();
        const expected = 1000000;
        for(let i = 0; i < expected; i++){
            catalog.addProduct(`Product ${i}`, {
                name: 'iPhone 3xs 11.0 iOs blah blah blah',
                priceInt: 99999,
                description: 'blah blah blah'
            });
        }
        const actual = catalog.getProductCount();
        assert.equal(actual, expected);
    });
});