import express from 'express';
import { createBareServer } from '@tomphttp/bare-server-node';
import { server as wisp } from '@mercuryworkshop/wisp-js/server';
import createRammerhead from 'rammerhead/src/server/index.js';
import serveStatic from 'serve-static';
import { fileURLToPath } from 'node:url';
import path, { dirname } from 'node:path';
import { createServer } from 'node:http';

export default function CommanderViteCustomPlugin() {
    return ({
        name: 'commander-vite-plugin',
        configureServer(server) {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);

            const rammerhead = createRammerhead();
            const bare = createBareServer('/bare/');

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

            const app = express();

            app.use(serveStatic(path.join(__dirname, 'dist')));

            const httpServer = createServer(app);

            const upgraders = httpServer.listeners('upgrade');

            for (const upgrader of upgraders) httpServer.off('upgrade', upgrader);

            httpServer.on('upgrade', (req, socket, head) => {
                if (req.url && req.url?.endsWith('/wisp/')) {
                    wisp.routeRequest(req, socket, head);
                } else if (bare.shouldRoute(req)) {
                    bare.routeUpgrade(req, socket, head);
                } else if (shouldRouteRammerhead(req)) {
                    routeRammerheadUpgrade(req, socket, head);
                } else {
                    for (const upgrader of upgraders) upgrader(req, socket, head);
                }
            });

            server.middlewares.use(httpServer);

            server.middlewares.use((req, res, next) => {
                if (bare.shouldRoute(req)) {
                    bare.routeRequest(req, res);
                } else if (shouldRouteRammerhead(req)) {
                    routeRammerheadRequest(req, res);
                } else { 
                    next(); 
                }
            });
        }
    });
};