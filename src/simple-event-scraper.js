const rp = require("request-promise");
const cheerio = require("cheerio");

module.exports = class SimpleEventScraper {
    /**
     * 
     * @param {*} uri url where events are listed 
     * @param {*} eventCtor Constructor to use to instantiate new events
     */
    constructor(uri, eventCtor) {
        this.uri = uri;
        this.eventCtor = eventCtor;
        this.events = [];
    }

    /**
     * @returns { this.eventCtor[] } list of events
     */
    async loadEvents() {
        const $ = await this.load();
        if (!$) throw new Error('could not load events.');

        let events = [];
        /* iterate event containers */
        $(this.eventCtor.LIST_CONTAINER).each((i, elem) => {
            /* for each 'elem' Event's static method 'parse' is used to instantiate an event */
            const event = this.eventCtor.parse($, elem);
            if (event) events.push(event); // add event to events array
        });

        return (this.events = events);
    }
    
    async load() {
        return await rp({ uri: this.uri, transform: this.transform });
    }
    transform(body) {
        return cheerio.load(body);
    }
}