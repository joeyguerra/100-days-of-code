import assert from 'assert';

describe('Parse Key Value Pairs', ()=> {
    it('Given a 1 dimension array of key value pairs, when parsed, then I have a javascript object', ()=>{
        const keyValuePairs = `id1:name1=FirstName
id1:value1=Joey
id1:name2=LastName
id1:value2=Tribbiani
id1:name3=Id
id1:value3=1
id2:name1=FirstName
id2:value1=Monica
id2:name2=LastName
id2:value2=Geller
id2:name3=Id
id2:value3=2
id3:name1=FirstName
id3:value1=Jonathan
id3:name2=LastName
id3:value2=Keith
id3:name3=Id
id3:value3=3
`;

        const expected = [
            { Id: '1', FirstName: 'Joey', LastName: 'Tribbiani' },
            { Id: '2', FirstName: 'Monica', LastName: 'Geller' },
            { Id: '3', FirstName: 'Jonathan', LastName: 'Keith' }
          ];

        let attributeName = null;
        let obj = {};
        const actual = [];
        keyValuePairs.split('\n').forEach(line => {
            if(line == null || line.length == 0) return;
            const [id, kv] = line.split(':');
            const number = /^\d+$/.test(id);
            const [attr, value] = kv.split('=');
            if(!obj[id]) {
                obj[id] = {};
                actual.push(obj[id]);
            }
            if(attr.indexOf('name') == 0){
                attributeName = value;
            } else {
                obj[id][attributeName] = value;
            }
        });
        assert.deepEqual(actual, expected);
    });
});