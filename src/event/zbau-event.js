const moment = require("moment");
const BaseEvent = require('./base-event');
const _CURRENT_YEAR = moment().year();

module.exports = class ZBauEvent extends BaseEvent {
    static get LIST_CONTAINER() { return '.event' }; // hier wie der standard, siehe rakete event da ists anders
    
    constructor(id) {
      super(id, "zbau");
      this.minimumAge = null;
      this.location.title = 'ZBau';
      this.location.internal_locations = [];
    }
    
    static parse($, container) {
      const e = new ZBauEvent();
  
      /* title, subtitle */
      e.title = $(container).find('.event__main-title').text().trim();
      e.subtitle = $(container).find('.event__sub-title').text().trim();
  
      /* description */
      e.description = $(container).find('.event__info-text').text().trim();
  
      /* parse date  */
      const day = $(container).find('.event__day').text().trim().slice(-6); // z.B = 'So 25.07'; slice -> '25.07'  
      const admittance = $(container).find('.event__einlass').text().trim(); // 18:30
      const start = $(container).find('.event__beginn').text().trim(); // 19:00
  
      const dayPrefix = `${day}.${_CURRENT_YEAR} `; // '25.07.2018'
      const dateFormat = 'DD.MM.YYYY HH:mm';
      e.date.start = moment(dayPrefix + start, dateFormat).toISOString();
      e.date.admittance = admittance ? moment(dayPrefix + admittance, dateFormat).toISOString() : null;
  
      /* url */
      e.url = $(container).attr('data-url');
  
      /* location
      *  Interne locations wie galerie / roter salon usw stehen hier mit komma getrennt drin
      *  */
      const locationsStr = $(container).find('.event__location').text().trim();
      const locationsSplit = locationsStr.split(',');
      for (let location of locationsSplit) {
        const locStr = location.trim();
        e.location.internal_locations.push(locStr);
      }
  
      /* preis */
      e.price = $(container).find('.event__eintritt').text().replace(/Tickets\n/g, " ").trim();
  
      /* media */
      const imageUri = $(container).find('.event__image').attr('data-src')
      e.setImage(imageUri);
  
      /* alter */
      const age = parseInt($(container).find('.event__alter').text().trim());
      if (age) e.setMinAge(age);
  
      return e;
    }
  }