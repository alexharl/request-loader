//
import { CheerioStrategy } from "../../cheerio.strategy";
import { BaseEvent } from "./event.model";
import * as moment from "moment";

export class DesiEventStrategy extends CheerioStrategy {
  public _CURRENT_YEAR = moment().year();
  constructor() {
    super("http://cgi.desi-nbg.de/cgi-bin/desi.pl?cmd=show_va");
  }
  parse($: any) {
    if (!$) throw new Error("could not load events.");
    let events = [];
    /* iterate event containers */
    $("tbody").each((i, elem) => {
      const event = this.parseEvent($, elem);
      if (event) events.push(event); // add event to events array
    });

    return events;
  }
  private parseEvent($, container) {
    const event = new BaseEvent("desi");

    $(container)
      .find("td")
      .each((i, e) => {
        if (i === 0) {
          const vDate = $(e)
            .text()
            .trim();
          const date = vDate.substring(3, 8);
          const time = vDate.substring(8, 13);
          const dayPrefix = `${date}/${this._CURRENT_YEAR} `; // '25.07.2018'
          const dateFormat = "DD/MM/YYYY HH:mm";
          event.date = <BaseEvent.DateInfo>{
            start: moment(dayPrefix + time, dateFormat).unix()
          };
          // console.log($(e).text());
        } else if (i === 1) {
          event.title = $(e)
            .text()
            .trim();
          //    console.log($(e).text());
        } else if (i === 2) {
          // desc
          event.description = $(e)
            .text()
            .trim();
          // console.log($(e).text());
        } else {
          event.url = $(e)
            .find("a")
            .attr("href");
        }
      });

    return event;
  }
}
