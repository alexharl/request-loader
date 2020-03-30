const RequestLoader = require('./dist/request-loader');
const ZBauEventStrategy = require('./dist/strategies/custom-strategies/event/zbau-nbg-event.strategy');
const Tagger = require('./dist/event-tagger');
const _ = require('lodash');

async function scrape() {
  const zbau_scraper_strategy = new ZBauEventStrategy.ZBauEventStrategy();
  const event_scraper = new RequestLoader.RequestLoader(zbau_scraper_strategy);
  const zbau_events = await event_scraper.exec();

  return zbau_events;
}

async function tag(data) {
  const dubTagger = new Tagger('genre-dub', 'Dub', 'tags', ['title', 'subtitle', 'description'], [/dub/, /dub/], (item, tag) => {
    return false;
  });
  dubTagger.exec(data);
  return _.filter(data, item => !!_.find(item.tags, { id: 'genre-dub' }));
}

scrape().then(tag);
