// @ts-nocheck
export default async function registerSw() {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (registration) {
        await navigator.serviceWorker.ready;

        console.log(`Service worker registered for scope "${registration.scope}"`);
    } else {
        await navigator.serviceWorker.register("/sw.js", {
            scope: "/"
        });

        console.log(`Service worker registered for scope "${registration.scope}"`);
    }
};