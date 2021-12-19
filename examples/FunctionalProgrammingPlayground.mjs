
'use strict';
import assert from 'assert';
import ObservableLog from '../ObservableLog.mjs';

class Int {
    constructor(value) {
        this.value = value;
    }
}
const commands = new ObservableLog();

class Command {

}

const checkPayload = (payload, problems) => {
    if(!payload['eventId']) problems.push({eventId: 'is missing'});
    if(!payload['message']) problems.push({message: 'is missing'});
    return [payload, problems];
};

const duplicates = {};
const checkDuplicates = (payload, problems) => {
    if(duplicates[payload['eventId']]) problems.push({eventId: 'is a duplicate'});
    return [payload, problems];
};
const validate = (payload, problems) => {
    if(problems.length == 0) payload = new Command();
    else payload = null;
    return [payload, problems];
};
const sendCommand = (payload, problems) => {
    if(problems.length == 0) commands.append(payload);
    return [payload, problems];
};
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
const pipeWith = (initial, bind, ...fns) => {
    return fns.reduce(bind, initial);
};
describe('Functional programming playground', ()=>{
    it('Execute functions in sequence, passing the result from the previous one to the next', ()=>{       
        const expected = 3;
        const [a, actual] = pipe((a)=>{
            return [a, a+1];
        },
        ([a, v])=>{
            return [a, v + 1];
        })(1);
        assert.deepEqual(actual, expected);
    });
    it('Monading Binding', ()=>{
        const expected = [new Int(2), new Int(6), new Int(100)];
        const actual = [2, 6, 100].map(x=>new Int(x));
        assert.deepEqual(actual, expected);
    });
    it('Monad logging', ()=>{
        const unit = value => [value, []]; // 1st argument is the subject, 2nd argument is the ancillary one.
        const bind = (args, fn) => {
            const [value, ancillary] = args; // from unit call.
            const [result, updates] = fn(value, ancillary);
            return [result, ancillary.concat(updates)];
        };
        const squared = x => [x * x, [`squared ${x}`]];
        const havled = x => [x / 2, [`halved ${x}`]];
        const actual = pipeWith(unit(4), bind, squared, havled);
        const expected = [8, ['squared 4', 'halved 16']];
        assert.deepEqual(actual, expected);
    });
});

describe('Realish world', ()=>{
    const unit = value => [value, []]; // 1st argument is the subject, 2nd argument is the ancillary one.
    const bind = (args, fn) => {
        const [value, ancillary] = args; // from unit call.
        const [result, updates] = fn(value, ancillary);
        return [result, ancillary];
    };
    it('Given a pipeline, when eventid and message exist, then get a valid command', done=>{
        let actual = null;
        const interval = setInterval(()=>{
            for(actual of commands.getForConsumerId("consumter-1")){
                assert.deepEqual(actual, expected);
                clearInterval(interval);
                done();
            }
        }, 60);
        const expected = new Command();
        const result = pipeWith(
            unit({eventId: 1, message: JSON.stringify({name: 'joey'})}),
            bind, 
            checkPayload,
            checkDuplicates,
            validate,
            sendCommand);
    });
    it('Given a pipeline, when eventid is missing, then get no command and errors', done=>{
        const interval = setInterval(()=>{
            for(let c of commands.getForConsumerId("consumter-2")){
                clearInterval(interval);
                done();
            }
        }, 60);
        const expected = {eventId: 'is missing'};
        const [_, [actual]] = pipeWith(
            unit({message: JSON.stringify({name: 'joey'})}),
            bind,
            checkPayload,
            checkDuplicates,
            validate,
            sendCommand);
        assert.deepEqual(actual, expected);
    });
});