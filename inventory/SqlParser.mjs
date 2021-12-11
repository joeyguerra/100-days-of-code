import AdjustmentMessage from './AdjustmentMessage.mjs';
class Parser {
    static parse(data){
        const messages = [];
        data.split('\n').map(line=>{
            const matches = /'ID:(?<id>[^']*)','(?<json>[^']*)','(?<type>[^']*)','(?<stepid>[^']*)','(?<error>[^']*)','(?<date>[^']*)'/g.exec(line);
            if(matches?.groups){
                const m = new AdjustmentMessage(JSON.parse(matches.groups.json), matches.groups.date);
                messages.push(m);
            }
        });
        return messages;
    }
}
export default Parser;