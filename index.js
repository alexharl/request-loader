const SimpleEventScraper = require('./src/simple-event-scraper.js');
const ZBauEvent = require('./src/event/zbau-event');
const RaketeEvent = require('./src/event/rakete-event');

/* javascript magic, damit ich ne async function direkt aufrufen kann */
(async function () {
  /* für jede gewünschte seite wird ein SimpleEventScraper instanziert, mit der URL zu den Events und dem Constructor vom gewünschten Event */
  const zbaus_scraper = new SimpleEventScraper("https://z-bau.com/programm", ZBauEvent);
  await zbaus_scraper.loadEvents();
  console.log(zbaus_scraper.events)

  const rakete_scraper = new SimpleEventScraper("https://dierakete.com/", RaketeEvent);
  await rakete_scraper.loadEvents();
  console.log(rakete_scraper.events)  
})()