/*
MIT License

Copyright (c) 2018 Alexander Harl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { CheerioStrategy } from '../../cheerio.strategy';
import { BaseEvent } from './event.model';

import * as moment from 'moment';

export class ZBauEventStrategy extends CheerioStrategy {
  public _CURRENT_YEAR = moment().year();

  constructor() {
    super('https://z-bau.com/programm');
  }

  parse($: any) {
    if (!$) throw new Error('could not load events.');

    let events = [];
    /* iterate event containers */
    $('.event').each((i, elem) => {
      const event = this.parseEvent($, elem);
      if (event) events.push(event); // add event to events array
    });

    return events;
  }

  private getTextFromNode($, dom, selector) {
    return $(dom)
      .find(selector)
      .text()
      .trim();
  }

  private parseEvent($, container) {
    const e = new BaseEvent('zbau');

    /* title, subtitle */
    e.title = this.getTextFromNode($, container, '.event__main-title');
    e.subtitle = this.getTextFromNode($, container, '.event__sub-title');

    /* description */
    e.description = this.getTextFromNode($, container, '.event__info-text');

    /* parse date  */
    const day = this.getTextFromNode($, container, '.event__day').slice(-6); // z.B = 'So 25.07'; slice -> '25.07'
    const admittance = this.getTextFromNode($, container, '.event__einlass'); // 18:30
    const start = this.getTextFromNode($, container, '.event__beginn'); // 19:00

    const dayPrefix = `${day}.${this._CURRENT_YEAR} `; // '25.07.2018'
    const dateFormat = 'DD.MM.YYYY HH:mm';
    e.date = <BaseEvent.DateInfo>{
      start: moment(dayPrefix + start, dateFormat).unix(),
      admittance: admittance ? moment(dayPrefix + admittance, dateFormat).unix() : null
    };

    /* url */
    e.url = $(container).attr('data-url');

    e.additionalInfo = {
      internal_locations: [],
      price: null,
      age: null
    };

    /* location
     *  Interne locations wie galerie / roter salon usw stehen hier mit komma getrennt drin
     *  */
    const locationsStr = this.getTextFromNode($, container, '.event__location');
    const locationsSplit = locationsStr.split(',');
    for (let location of locationsSplit) {
      const locStr = location.trim();
      e.additionalInfo.internal_locations.push(locStr);
    }

    /* preis */
    e.additionalInfo.price = this.getTextFromNode($, container, '.event__eintritt')
      .replace(/Tickets\n/g, ' ')
      .trim();

    /* alter */
    const age = parseInt(this.getTextFromNode($, container, '.event__alter'));
    if (age) {
      e.additionalInfo.age = age;
    }

    /* media */
    const imageUri = $(container)
      .find('.event__image')
      .attr('data-src');
    if (imageUri) {
      const eventMedia: BaseEvent.Media = {
        type: BaseEvent.MediaType.IMAGE,
        uri: imageUri
      };
      e.media = [eventMedia];
    }

    return e;
  }
}
