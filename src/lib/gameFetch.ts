export default class games {
    /**
     * the games cdn
     */
    cdn: string = "https://metallic.eu.org"
    
    constructor(
        cdn: string
    ) {
        this.cdn = cdn;
    }

    /**
     * fetches or "retrieves" the game authors
     */
    #retrieveAuthors() {
        return (
            (async function(METHOD, path) {
                const response = await fetch(
                    path,
                    {
                        method: await METHOD
                    }
                );

                if (response.status !== 200) 
                    throw new Error("the response status code wasn't 200");

                const text = await response.json();

                if (!Array.isArray(text)) {
                    throw new Error("the json response must be an array");
                }

                const authors = text.map(item => item.author);

                if (authors.length > 60) authors.slice(0, 60);

                return authors;
            }(this.method(), this.#dataPath() as string))
        );
    }

    /**
     * fetches or "retrieves" the game descriptions
     */
    #retrieveDescriptions() {
        return (
            (async function(METHOD, path) {
                const response = await fetch(
                    path,
                    {
                        method: await METHOD
                    }
                );

                if (response.status !== 200) 
                    throw new Error("the response status code wasn't 200");

                const text = await response.json();

                if (!Array.isArray(text)) {
                    throw new Error("the json response must be an array");
                }

                const descriptions = text.map(item => item.description);

                if (descriptions.length > 60) descriptions.slice(0, 60);

                return descriptions;
            }(this.method(), this.#dataPath() as string))
        );
    }

    /**
     * fetches or "retrieves" the game urls
     */
    #retrieveUrls() {
        return (
            (async function(METHOD, path, cdn) {
                const response = await fetch(
                    path,
                    {
                        method: await METHOD
                    }
                );

                if (response.status !== 200) 
                    throw new Error("the response status code wasn't 200");

                const text = await response.json();

                if (!Array.isArray(text)) {
                    throw new Error("the json response must be an array");
                }

                const urls = text.map(item => item.url);

                if (urls.length > 60) urls.slice(0, 60);

                urls.forEach(url => cdn + url);

                return urls;
            }(this.method(), this.#dataPath() as string, this.cdn as any))
        );
    }

    /**
     * fetches or "retrieves" the game icons
     */
    #retrieveIcons() {
        return (
            (async function(METHOD, path, cdn) {
                const response = await fetch(
                    path,
                    {
                        method: await METHOD
                    }
                );

                if (response.status !== 200)
                    throw new Error("the response status code wasn't 200");

                const text = await response.json();

                if (!Array.isArray(text)) {
                    throw new Error("the json response must be an array");
                }

                const icons = text.map(item => item.icon);

                if (icons.length > 60) icons.slice(0, 60);

                icons.forEach(icon => cdn + icon);

                return icons;
            }(this.method(), this.#dataPath() as string, this.cdn as any))
        );
    }

    /**
     * fetches or "retrieves" the game names
     */
    #retrieveNames() {
        return (
            (async function(METHOD, path) {
                const response = await fetch(
                    path,
                    {
                        method: await METHOD
                    }
                );

                if (response.status !== 200)
                    throw new Error("the response status code wasn't 200");

                const text = await response.json();
                /**  the error-handling if-statement under this comment is pointless, because .json() will only ever return an array!
                 * 
                if the input passed isnt valid json, then it will create a syntaxError, which will halt build process, throw the error, and
                and prevent this from running
                i suggest we remove it from all functions in this file!

                if (!Array.isArray(text)) {
                    throw new Error("the json response must be an array");
                }*/

                const names = text.map(item => item.name);

                if (names.length > 60) names.slice(0, 60);

                return names;
            }(this.method(), this.#dataPath() as string))
        );
    }

    /**
     * shorthand non-private function for retrieving the games
     */
    async retrieve() {
        return {
            authors: await this.#retrieveAuthors(),
            descriptions: await this.#retrieveDescriptions(),
            urls: await this.#retrieveUrls(),
            icons: await this.#retrieveIcons(),
            names: await this.#retrieveNames()
        };
    }

    /**
     * returns the method the game fetch function should use
     */
    async method() {
        const storageValue = await import("../lib/localStorage")
            .then((value) => {
                return {
                    propValue: String(value.default.get("game-fetch-method")) ?? "GET"
                };
            });

        return storageValue.propValue;
    }

    /**
     * returns the path to the games.json file
     */
    #dataPath() {
        return "../pages/games/games.json" as any;
    }
};