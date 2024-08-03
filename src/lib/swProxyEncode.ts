// @ts-nocheck
export default class SwProxies {
    encodeDynamic(url: string) {
        return this.#serviceUrl() + '/dynamic/' + __uv$config.encodeUrl(url);
    }

    encodeUltraviolet(url: string) {
        return this.#serviceUrl() + '/ultraviolet/' + __uv$config.encodeUrl(url);
    }

    encodeScramjet(url: string) {
        return this.#serviceUrl() + '/scramjet/' + __scramjet$config.codec.encode(url);
    }

    #serviceUrl() {
        return '/service';
    }
};