import storage from './localStorage.ts';
// @ts-ignore
import { SetTransport } from '@mercuryworkshop/bare-mux';

export default function setupBareMux() {
    const wispUrl = 
        (location.protocol === 'https:' ? 'wss' : 'ws') + '://' + location.host + '/wisp/';

    const transport = storage.get('transport') || 'epoxy';

    SetTransport(
        (
            transport === 'epoxy' ?
            '/epoxy/index.mjs' :
            transport === 'libcurl' ?
            '/libcurl/index.mjs' :
            '/epoxy/index.mjs'
        ), [{ wisp: wispUrl }]
    );
};