const RequestLoader = require('./dist/request-loader');
const RaketeEventStrategy = require('./dist/strategies/custom-strategies/event/rakete-nbg-event.strategy');
const ZBauEventStrategy = require('./dist/strategies/custom-strategies/event/zbau-nbg-event.strategy');

(async function () {
  /* Basic use with static function */
  const result = await RequestLoader.RequestLoader.exec('https://randomuser.me/api/');

  /* Instantiate RequestLoader with default strategy */
  const json_loader = new RequestLoader.RequestLoader('https://randomuser.me/api/');
  const json_loader_result = await json_loader.exec(); // execute with strategy

  /* Using a custom strategy */
  const zbau_scraper_strategy = new ZBauEventStrategy.ZBauEventStrategy();
  const event_scraper = new RequestLoader.RequestLoader(zbau_scraper_strategy);
  const zbau_events = await event_scraper.exec();

  /* Switching strategy */
  rakete_scraper_strategy = new RaketeEventStrategy.RaketeEventStrategy();
  event_scraper.strategy = rakete_scraper_strategy;
  const rakete_events = await event_scraper.exec();

  /* print result */
  console.log(JSON.stringify({
    staticLoaderResult: result,
    instanceResult: json_loader_result,
    events: [
      zbau_events.concat(rakete_events)
    ]
  }));
})()