export default function Match(expressions, name, noMatch = (acc, e)=>acc){
    let key = Object.keys(expressions).find(key => key == name);
    if(expressions[key]) return expressions[key];
    else return noMatch;
};
