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

export class RaketeEventStrategy extends CheerioStrategy {

    constructor() {
        super("https://dierakete.com/");
    }

    parse($: any) {
        if (!$) throw new Error('could not load events.');

        let events = [];
        /* iterate event containers */
        $('.programm-post').each((i, elem) => {
            const event = this.parseEvent($, elem);
            if (event) events.push(event); // add event to events array
        });

        return events;
    }

    private parseEvent($, container) {
        const id = $(container).attr('id');
        const e = new BaseEvent('rakete', id);

        /* title subtitle description */
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

        /* url */
        e.url = $(container).find('.programm-expand').attr('programm-url');

        /* day */
        const day = $(container).find('.programm-date').text().trim().slice(-10);
        const timeStr = $(container).find('.programm-time').text().trim();
        const timeSplit = timeStr.split(':');
        const time = timeSplit[0].slice(-2) + ':' + timeSplit[0].slice(0, 1);
        const dateFormat = 'DD.MM.YYYY HH:mm';
        const startDate = moment(day + ' ' + time, dateFormat).unix();
        e.date = <BaseEvent.DateInfo>{
            start: startDate
        }

        e.additionalInfo = {
            afterparty: $(container).find('.programm-afterparty').text().trim()
        }

        return e;
    }
}