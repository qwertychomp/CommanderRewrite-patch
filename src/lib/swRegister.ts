// @ts-nocheck
import setupBareMux from './bareMuxSetup';

export default function registerSw() {
    setupBareMux();

    navigator.serviceWorker.register('/sw.js', {
        scope: '/'
    });
};