import http from 'http';
import path from 'path';
import fs from 'fs';
const ContentTypes = {
    html: 'text/html',
    mjs: 'application/javascript',
    js: 'application/javascript',
    css: 'text/css'
};

const HttpGet = async url => {
    const parsedUrl = new URL(url);
    return await (new Promise((resolve, reject) => {
        const req = http.request({
            hostname: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.pathname,
            method: 'GET'
        }, (res) => {
            res.setEncoding('utf8');
            const buffer = [];
            res.on('data', chunk => buffer.push(chunk));
            res.on('end', () => {
                res.body = buffer.join('');
                resolve(res);
            });
        });
        req.end();
    }));
}

const WebServer = http.createServer((req, res) => {
    if(req.url == '/') req.url = '/index.html';
    const parsedPath = path.parse(req.url);
    const contentType = ContentTypes[parsedPath.ext.replace('.', '')] || 'text/plain';
    res.writeHead(200, {'Content-Type': contentType});
    fs.createReadStream(path.join('.', parsedPath.dir, parsedPath.base)).pipe(res);
});
export {
    WebServer,
    ContentTypes,
    HttpGet
};