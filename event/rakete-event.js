const moment = require("moment");
const BaseEvent = require('./base-event');

module.exports = class RaketeEvent extends BaseEvent {
    static get LIST_CONTAINER() { return '.programm-post' }; // <- auf der rakete seite befinden sich die events im container mit der classe 'programm-post'

    constructor(id) {
      super(id, "rakete");
      this.minimumAge = 18;
      this.location.title = 'Rakete';
      this.location.internal_locations = [];
    }
  
    static parse($, container) {
      const id = $(container).attr('id');
      const e = new RaketeEvent(id);
  
      e.url = $(container).find('.programm-expand').attr('programm-url');
  
      let title = '';
      const titleSegments = $(container).find('.headliner-item > h1');
      $(titleSegments).each((i, elem) => {
        const str = $(elem).text().trim();
        if ($(elem).hasClass('subline')) {
          e.subtitle = str;
        } else {
          title += str;
        }
      });
  
      e.title = title;
  
      e.description = $(container).find('.programm-text').text().trim();
  
      const day = $(container).find('.programm-date').text().trim().slice(-10);
      const timeStr = $(container).find('.programm-time').text().trim();
      const timeSplit = timeStr.split(':');
      const time = timeSplit[0].slice(-2) + ':' + timeSplit[0].slice(0, 1);
      const dateFormat = 'DD.MM.YYYY HH:mm';
      e.date.start = moment(day + ' ' + time, dateFormat).toISOString();
  
      e.additionalInfo = $(container).find('.programm-afterparty').text().trim();
  
      return e;
    }
  
  }