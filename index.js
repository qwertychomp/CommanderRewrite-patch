import { createServer } from "node:http";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import createRammerhead from "rammerhead/src/server/index.js";
import wisp from "wisp-server-node";
import serveStatic from "serve-static";
import express from "express";
import { build } from "astro";
import { libcurlPath } from "@mercuryworkshop/libcurl-transport";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { scramjetPath } from "@mercuryworkshop/scramjet";
import { uvPath as ultravioletPath } from "@titaniumnetwork-dev/ultraviolet";
import { bareModulePath } from "@mercuryworkshop/bare-as-module3";
import compression from "compression";

if (!existsSync("dist")) build({});

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const rammerhead = createRammerhead();

const rammerheadScopes = [
    "/rammerhead.js",
    "/hammerhead.js",
    "/transport-worker.js",
    "/task.js",
    "/iframe-task.js",
    "/worker-hammerhead.js",
    "/messaging",
    "/sessionexists",
    "/deletesession",
    "/newsession",
    "/editsession",
    "/needpassword",
    "/syncLocalStorage",
    "/api/shuffleDict"
];

const rammerheadSession = /^\/[a-z0-9]{32}/;

const shouldRouteRammerhead = req => {
    const url = new URL(req.url, "http://0.0.0.0");
    return (
        rammerheadScopes.includes(url.pathname) ||
        rammerheadSession.test(url.pathname)
    );
};

const routeRammerheadRequest = (req, res) => {
    rammerhead.emit("request", req, res);
};

const routeRammerheadUpgrade = (req, socket, head) => {
    rammerhead.emit("upgrade", req, socket, head);
};

const staticOptions = {
    setHeaders: (res, path) => {
        if (path.endsWith(".cjs")) {
            res.setHeader("Content-Type", "application/javascript; charset=utf-8");
        }
    }
};

app.use(serveStatic(path.join(__dirname, "dist")));
app.use(compression());

app.use("/libcurl", serveStatic(libcurlPath, staticOptions));
app.use("/epoxy", serveStatic(epoxyPath, staticOptions));
app.use("/baremux", serveStatic(baremuxPath, staticOptions));

app.use("/baremodule", serveStatic(bareModulePath, staticOptions));

app.use("/scramjet", serveStatic(scramjetPath, staticOptions));
app.use("/ultraviolet", serveStatic(ultravioletPath, staticOptions));

const server = createServer();

server.on("request", (req, res) => {
    if (shouldRouteRammerhead(req)) {
        routeRammerheadRequest(req, res);
    } else app(req, res);
});

server.on("upgrade", (req, socket, head) => {
    if (req.url?.startsWith("/wisp/")) {
        wisp.routeRequest(req, socket, head);
    } else if (shouldRouteRammerhead(req)) {
        routeRammerheadUpgrade(req, socket, head);
    } else socket.end();
});

server.listen({ port: PORT });