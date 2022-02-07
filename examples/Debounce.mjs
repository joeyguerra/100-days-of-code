import assert from 'assert';
describe('Debounce', ()=>{
    it('When called super fast, then should only increment once', done=>{
        const debounce = timer => (fn, timeout) => {
            clearTimeout(timer);
            timer = setTimeout(fn, timeout);
            return timer;
        };
        let timer = null
        let actual = 0;
        [1,2,3,4,5].forEach(()=>{
            timer = debounce(timer)(()=>{
                actual++;
            }, 10);
        });
        setTimeout(()=>{
            assert.deepEqual(actual, 1);
            done();
        }, 10);
    });
});