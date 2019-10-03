import {
  tiers,
  getTier,
  getLocaleTier,
  getUSDRate,
  InvalidLocaleError,
  InvalidTierError,
  getLocaleCurrency,
} from '.';

const TIER_FIVE = '5';

describe('Apple pricing matrix', () => {
  describe('getTier', () => {
    it('throws error if tier is not found', () => {
      expect(() => getTier('fake')).toThrowError(new InvalidTierError('Could not find tier: fake'));
    });

    it('returns tier', () => {
      const tierKeys = Object.keys(tiers);
      tierKeys.forEach(tier => {
        expect(getTier(tier)).toMatchSnapshot();
      });
    });
  });

  describe('getLocaleTier', () => {
    it('throws error if tier is not found', () => {
      expect(() => getLocaleTier('fake', 'DE')).toThrowError(
        new InvalidTierError('Could not find tier: fake'),
      );
    });

    it('throws error if locale is not found', () => {
      expect(() => getLocaleTier('1', 'ZM')).toThrowError(
        new InvalidLocaleError('Could not find locale: ZM for tier: 1'),
      );
    });

    it('returns locale tier', () => {
      const tier = getTier(TIER_FIVE);
      const localeKeys = Object.keys(tier);
      localeKeys.forEach(locale => expect(getLocaleTier(TIER_FIVE, locale)).toMatchSnapshot());
    });
  });

  describe('getUSDRate', () => {
    it('returns the exchange rate to convert a given currency to USD', () => {
      expect(getUSDRate(TIER_FIVE, 'DE')).toBe(1.1002);
      expect(getUSDRate(TIER_FIVE, 'JP')).toBe(122.2445);

      // IS = ICELAND, Iceland uses USD in Apple's world
      expect(getUSDRate(TIER_FIVE, 'IS')).toBe(1);
    });
  });

  describe('getLocaleCurrency', () => {
    it('returns the local currency for a given country code', () => {
      expect(getLocaleCurrency('GB')).toBe('GBP');
    });

    it('throws error if country code not found', () => {
      expect(() => getLocaleCurrency('XY')).toThrowError(
        'Unable to find currency for country code: XY',
      );
    });
  });
});
