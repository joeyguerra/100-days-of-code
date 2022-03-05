import express from 'express';

const app = express();
app.use((req, res, next) => {
    console.log(`${new Date()} - ${req.method} ${req.url}`);
    next();
});
app.get('/healthz', (req, res) => {
    res.send(`I'm healthy`);
});
app.get('', (req, res) => {
    res.send(`I'm healthy`);
});
    
app.listen(process.env.NOMAD_PORT_http || process.env.PORT || 3000, ()=>{
    console.log(`Helo world from http://localhost:${process.env.PORT || 3000}`);
});
