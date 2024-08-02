// @ts-nocheck
export default class SwProxies {
    encodeDynamic(url: string) {
        return '/service/dynamic/' + __uv$config.encodeUrl(url);
    }

    encodeUltraviolet(url: string) {
        return '/service/ultraviolet/' + __uv$config.encodeUrl(url);
    }

    encodeScramjet(url: string) {
        return '/service/scramjet/' + __scramjet$config.codec.encode(url);
    }
};