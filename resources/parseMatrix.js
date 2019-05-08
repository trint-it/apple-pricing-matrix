const fs = require('fs');
const papaparse = require('papaparse');
const countries = require('i18n-iso-countries');

// This script is intended to read in the Apple Pricing CSV and output a structured
// JSON file that will be consumed by this package.

// Read CSV with types
// @TODO: parameterise input file
const { data: matrix } = papaparse.parse(
  fs.readFileSync(`${__dirname}/pricing_matrix_20190508.csv`).toString(),
  { skipEmptyLines: true, dynamicTyping: true },
);

// Countries used by Apple that are not named using ISO country names
const nonStandardCountries = {
  'United States': 'US',
  Russia: 'RU',
  Vietnam: 'VN',
  'Korea, Republic Of': 'KR',
};

// Row 1 of the csv contains countries
// Remove countries from pricing array and parse to objects
const locales = matrix.shift().map(locale => {
  if (!locale) return {};
  const [, country, symbol] = /(.+)\s{1}\((.+)\)$/.exec(locale);
  const countryCode =
    countries.getAlpha2Code(country, 'en') || nonStandardCountries[country];
  return { country, symbol, countryCode };
});

// Pull csv headers out of pricing array
// Headers are "price" or "proceeds";
const csvHeaders = matrix.shift();

const tiers = {};

// Parse the csv data into tiers
matrix.forEach(tiering => {
  const tierName = tiering[0];
  const tier = {};

  // Column 0 is tier name, pricing data starts at column 1
  for (let i = 1; i < tiering.length; i++) {
    // Odd numbered columns = price, even numbered columns = proceeds
    const isPrice = i % 2;
    const { country, symbol, countryCode } = locales[isPrice ? i : i - 1];
    
    // Add base region data to tier
    if (!tier[countryCode]) {
      tier[countryCode] = { symbol, country, countryCode };
    }
    if (isPrice) {
      tier[countryCode].price = tiering[i];
    } else {
      tier[countryCode].proceeds = tiering[i];
    }
  }

  // Normalise tier names
  tiers[
    tierName
      .toLowerCase()
      .replace(/tier\s{1}/, '')
      .replace(/\s/g, '-')
  ] = tier;
});

// Write tier data to JSON file
// @TODO: parameterise output file
fs.writeFileSync(
  `${__dirname}/tiers_20190508.json`,
  JSON.stringify(tiers, null, 2),
);
