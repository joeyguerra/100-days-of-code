import assert from 'assert';


const multipleAListOfNumbers = (...operands) => {
    const rightSide = operands.slice(2);
    if(rightSide.length >= 1){
        return multipleAListOfNumbers(operands[0] * operands[1], ...rightSide);
    }
    return operands[0] * operands[1];
}

const applyToEachArgument = (action, ...operands) => {
    const rightSide = operands.slice(2);
    if(rightSide.length >= 1){
        const r = action(operands[0], operands[1]);
        return applyToEachArgument(action, r, ...rightSide);
    }
    return action(operands[0], operands[1]);
}

describe('Exploring Lisp concepts', ()=>{
    it('Should process a list of args recursively', ()=>{
        const expected = 720;
        const actual = multipleAListOfNumbers(1, 2, 3, 4, 5, 6);
        assert.equal(actual, expected);
    });

    it('Should apply an action to each argument', ()=>{
        const expected = 720;
        const actual = applyToEachArgument((x, y) => x * y, 1, 2, 3, 4, 5, 6);
        assert.deepEqual(actual, expected);
    });
});

