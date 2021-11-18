import assert from 'assert';
import { WebServer, ContentTypes, HttpGet} from '../WebServer.mjs';
import http from 'http';
import path from 'path';

let server = null;
before(async ()=>{
    server = await (new Promise((resolve, reject)=>{
        WebServer.listen((req, res)=>{
            resolve(WebServer);
        });
    }));
});

describe('Contet-Type', ()=>{
    it('should have a content-type of text/html', async ()=>{
        const expected = 'text/html';
        const parsedPath = path.parse('/index.html');    
        const actual = ContentTypes[parsedPath.ext.replace('.', '')];
        assert.strictEqual(actual, expected);
    });
    it('should have content-type text/html for index.html', async ()=>{
        const response = await HttpGet(`http://localhost:${server.address().port}/index.html`);
        assert.strictEqual(response.statusCode, 200);
        assert.strictEqual(response.headers['content-type'], 'text/html');
    });
    it('should have content-type text/css', async ()=>{
        const response = await HttpGet(`http://localhost:${server.address().port}/main-layout.css`);
        const expected = 'text/css';
        const actual = response.headers['content-type'];
        assert.strictEqual(actual, expected);
    });
    it('should have content-type application/javascript', async ()=>{
        const response = await HttpGet(`http://localhost:${server.address().port}/main.mjs`);
        const expected = 'application/javascript';
        const actual = response.headers['content-type'];
        assert.strictEqual(actual, expected);
    });
    it('should have content-type text/html requesting /', async ()=>{
        const response = await HttpGet(`http://localhost:${server.address().port}/`);
        const expected = 'text/html';
        const actual = response.headers['content-type'];
        assert.strictEqual(actual, expected);
    });
    it('should have content-type text/html when url is missing the uri', async ()=>{
        const response = await HttpGet(`http://localhost:${server.address().port}`);
        const expected = 'text/html';
        const actual = response.headers['content-type'];
        assert.strictEqual(actual, expected);
    });

});

describe('Static site server', ()=>{
    it('should return the contents in index.html', async ()=>{
        const response = await HttpGet(`http://localhost:${server.address().port}/index.html`);
        const expected = '<!DOCTYPE html>';
        const actual = response.body;
        assert.ok(actual.includes(expected));
    });
    it('should return the contents in index.html for empty uri', async ()=>{
        const response = await HttpGet(`http://localhost:${server.address().port}`);
        const expected = '<!DOCTYPE html>';
        const actual = response.body;
        assert.ok(actual.includes(expected));
    });
    it('should return the contents in index.html for / uri', async ()=>{
        const response = await HttpGet(`http://localhost:${server.address().port}/`);
        const expected = '<!DOCTYPE html>';
        const actual = response.body;
        assert.ok(actual.includes(expected));
    });
});
