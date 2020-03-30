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

const dubTagger = new Tagger.Tagger('genre-dub', 'Dub', 'tags', { title: [/dub[^step]/gi], subtitle: [/dub[^step]/gi], description: [/dub[^step]/gi] }, (item, tag) => {
  return false;
});

const monstersTagger = new Tagger.Tagger(
  'monsters-of-jungle',
  'Monsters Of Junge',
  'tags',
  { title: [/monsters.of.jungle/gi], subtitle: [/monsters.of.jungle/gi], description: [/monsters.of.jungle/gi] },
  (item, tag) => {
    return false;
  }
);

function tag(data) {
  dubTagger.exec(data);
  monstersTagger.exec(data);
  const dub = _.filter(data, item => !!_.find(item.tags, { id: monstersTagger.id }));
  const monsters = _.filter(data, item => !!_.find(item.tags, { id: monstersTagger.id }));
  console.log(JSON.stringify(data, null, 4));
}

scrape().then(tag);
