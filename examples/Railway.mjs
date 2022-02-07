import assert from 'assert';
describe('Railway oriented programming', ()=>{
    it('should use Promises', ()=>{
        const expected = {};
        const actual = {};
        const apples = ['apple', 'apple', 'apple'];
        const bannanas = ['bannana', 'bannana', 'bannana'];
        apples
            .map(apple =>  switchFunction(toBananna)([apple, null]))

        assert.equal(actual, expected);

    });
});

const switchFunction = fn => tuple => {
    if(tuple[0]) return fn(tuple[0]);
    else return tuple[1];
}

const toBananna = apple => {
    return ['bannana', null];
};
const toOranages = bananna => {
    return [null, 'failure'];
};
