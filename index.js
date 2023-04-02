const FuzzySearch = require('./fuse-basic');
const list = require('./data/businesses_11k.json');

const options = {
  // isCaseSensitive: false,
  includeScore: true,
  // shouldSort: true,
  // includeMatches: false,
  // findAllMatches: false,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.2,
  distance: 100,
  // useExtendedSearch: false,
  // ignoreLocation: false,
  // ignoreFieldNorm: false,
  // fieldNormWeight: 1,
  keys: [
    'properties.CompanyName',
  ]
};

const fuse = new FuzzySearch(list, options);

// Change the pattern
const pattern = 'justi';

const start = Date.now();
const results = fuse.search(pattern);
const end = Date.now();

results.reverse().forEach(i => {
  console.log(i.item.properties.CompanyName, i.score);
});

console.log(`${end - start}ms`)
console.log(`returned ${results.length} of ${list.length} records`);