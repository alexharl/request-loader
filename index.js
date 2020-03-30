const RequestLoader = require('./dist/request-loader');
const ZBauEventStrategy = require('./dist/strategies/custom-strategies/event/zbau-nbg-event.strategy');

(async function() {
  const zbau_scraper_strategy = new ZBauEventStrategy.ZBauEventStrategy();
  const event_scraper = new RequestLoader.RequestLoader(zbau_scraper_strategy);
  const zbau_events = await event_scraper.exec();

  console.log(JSON.stringify(zbau_events));
})();
