import { createServer } from 'node:http';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import createRammerhead from 'rammerhead/src/server/index.js';
import { createBareServer } from '@tomphttp/bare-server-node';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';
import serveStatic from 'serve-static';
import express from 'express';
import { build } from 'astro';

if (!existsSync('dist')) build({});

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const bare = createBareServer('/bare/');
const rammerhead = createRammerhead();

const rammerheadScopes = [
    '/rammerhead.js',
    '/hammerhead.js',
    '/transport-worker.js',
    '/task.js',
    '/iframe-task.js',
    '/worker-hammerhead.js',
    '/messaging',
    '/sessionexists',
    '/deletesession',
    '/newsession',
    '/editsession',
    '/needpassword',
    '/syncLocalStorage',
    '/api/shuffleDict'
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

const shouldRouteRammerhead = req => {
    const url = new URL(req.url, 'http://0.0.0.0');
    return (
        rammerheadScopes.includes(url.pathname) ||
        rammerheadSession.test(url.pathname)
    );
};

const routeRammerheadRequest = (req, res) => {
    rammerhead.emit('request', req, res);
};

const routeRammerheadUpgrade = (req, socket, head) => {
    rammerhead.emit('upgrade', req, socket, head);
};

app.use(serveStatic(path.join(__dirname, 'dist')));

const server = createServer();

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.routeRequest(req, res);
    } else if (shouldRouteRammerhead(req)) {
        routeRammerheadRequest(req, res);
    } else app(req, res);
});

server.on('upgrade', (req, socket, head) => {
    if (req.url && req.url?.endsWith('/wisp/')) {
        wisp.routeRequest(req, socket, head);
    } else if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else if (shouldRouteRammerhead(req)) {
        routeRammerheadUpgrade(req, socket, head);
    } else socket.end();
});

server.listen({ port: PORT });