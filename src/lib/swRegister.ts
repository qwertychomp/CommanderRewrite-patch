// @ts-nocheck
export default function registerSw() {
    navigator.serviceWorker.register('/sw.js', {
        scope: '/'
    });
};