# Programmatic access to Apple's in-app-purchase pricing matrix

## Getting started

```bash
$ yarn add apple-pricing-matrix
```

```js
import {
  getTier,
  getLocaleTier,
  getLocaleCurrency,
  getUSDRate,
} from 'apple-pricing-matrix';

const tier1 = getTier('1'); // returns object mapping iso country code to tiering data for tier 1 purchases

const tier3Germany = getLocaleTier('3', 'DE'); // returns tier 3 data for Germany

const germanCurrency = getLocaleCurrency('DE'); // returns the currency used by Apple for a supported iso country code

const dollarRate = getUSDRate('5', 'JP'); // returns the USD conversion rate used by Apple for the given tier and country code
```

## Tests

To run the test suite, first install the dependencies, then run `yarn test`:

```bash
$ yarn
$ yarn test
```

## License

[MIT](LICENSE)
