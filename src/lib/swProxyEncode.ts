// @ts-nocheck
export default class SwProxies {
    encodeUltraviolet(url: string) {
        return "/service/" + __uv$config.encodeUrl(url);
    }

    encodeScramjet(url: string) {
        return "/scramjet/" + __scramjet$config.codec.encode(url);
    }
};