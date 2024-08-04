import storage from "./localStorage.ts";
// @ts-ignore
import { BareMuxConnection } from "@mercuryworkshop/bare-mux";

export default async function setupBareMux() {
    const wispUrl = 
        (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";

    const transport = storage.get("transport") || "epoxy";

    const connection = new BareMuxConnection("/baremux/worker.js");

    await connection.setTransport(
        (
            transport === "epoxy" ?
            "/epoxy/index.mjs" :
            transport === "libcurl" ?
            "/libcurl/index.mjs" :
            "/epoxy/index.mjs"
        ), [{ wisp: wispUrl }]
    );

    console.log(`Set transport to "/${transport}/index.mjs"`);
};