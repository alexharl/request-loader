const RequestLoader = require('./dist/request-loader');
const ZBauEventStrategy = require('./dist/strategies/custom-strategies/event/zbau-nbg-event.strategy');
const Tagger = require('./dist/tagger');
const _ = require('lodash');

async function scrape() {
  const zbau_scraper_strategy = new ZBauEventStrategy.ZBauEventStrategy();
  const event_scraper = new RequestLoader.RequestLoader(zbau_scraper_strategy);
  const zbau_events = await event_scraper.exec();

  return zbau_events;
}

const dubTagger = new Tagger.Tagger('genre-dub', 'Dub', 'tags', ['title', 'subtitle', 'description'], [/dub/, /dub/], (item, tag) => {
  return false;
});

function tag(data) {
  dubTagger.exec(data);
  const filtered = _.filter(data, item => !!_.find(item.tags, { id: 'genre-dub' }));
  console.log(JSON.stringify(filtered));
  return filtered;
}

scrape().then(tag);
