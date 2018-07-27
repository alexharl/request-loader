const moment = require("moment");
module.exports = class BaseEvent {
    static get LIST_CONTAINER() { return '.event' }; //<- in diesem fall nur 'dummy'

    constructor(id, type) {
      this.id = id;
      this.type = type; // zbau | rakete | haus33 etc, kann natürlich auch ne GUID sein
  
      this.url = null; // url zum event
  
      this.title = null;
      this.subtitle = null;
      this.description = null;
  
      this.date = {
        start: null,
        admittance: null // Einlass
      }
  
      this.location = {
        title: null
      }
  
      this.media = {
        imageUri: "",
        embeded: []
      }
  
      this.minimumAge = null;
      this.additionalInfo = '';
    }
  
    setImage(uri) {
      if (uri) this.media.imageUri = uri;
    }
    setMinAge(age) {
      this.minimumAge = age;
    }
    static parse($, elem) {
      /*
      * $ ist hier die geparste HTML seite, elem eines der DOM Elemente mit dem Selector Event.LIST_CONTAINER
      * jetzt können wir mit $(elem) daten aus diesem container abfragen, zb mit .find(<selector>)
      * const title = $(elem).find('.event-title').text();
      * return { title: title };
      *  */
      return null;
    }
  }