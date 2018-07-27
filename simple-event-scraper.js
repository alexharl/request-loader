const rp = require("request-promise");
const cheerio = require("cheerio");

module.exports = class SimpleEventScraper {
    constructor(uri, eventCtor) {
        this.uri = uri;
        this.eventCtor = eventCtor;
        this.events = [];
    }
    transform(body) {
        return cheerio.load(body);
    }
    async load() {
        return await rp({ uri: this.uri, transform: this.transform });
    }
    async loadEvents() {
        const $ = await this.load();
        if (!$) throw new Error('could not load events.');

        let events = [];
        /* iteriere über alle event container, wie diese identifiziert werden, weis die Event Klasse */
        $(this.eventCtor.LIST_CONTAINER).each((i, elem) => {
            /* für jeden container 'elem' wird die statische methode parse vom Event aufgerufen */
            const event = this.eventCtor.parse($, elem);
            if (event) events.push(event); // hat das erstellen geklappt -> ab in events
        });
        
        return (this.events = events);
    }
}