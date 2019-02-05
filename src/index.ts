import BigNumber from 'bignumber.js';
import TIERS from '../resources/tiers_20190122.json';

export type Tier = {
  [countryCode: string]: LocaleTier;
};

export type LocaleTier = {
  symbol: string;
  price: number;
  proceeds: number;
  country: string;
  countryCode: string;
};

export const tiers: { [tierName: string]: Tier } = TIERS;

export class InvalidTierError extends Error {}
export class InvalidLocaleError extends Error {}

const US_COUNTRY_CODE = 'US';

/**
 * Returns all pricing regions for a given tier
 *
 * @param {string} tier
 * @returns {Tier}
 * @throws {InvalidTierError}
 */
export const getTier = (tier: string): Tier => {
  const tiering = tiers[tier];
  if (tiering) {
    return tiering;
  }
  throw new InvalidTierError(`Could not find tier: ${tier}`);
};

/**
 * Returns regional pricing information for a given tier
 *
 * @param {string} tier
 * @param {string} countryCode
 * @returns {LocaleTier}
 * @throws {InvalidTierError}
 * @throws {InvalidLocaleError}
 */
export const getLocaleTier = (tier: string, countryCode: string): LocaleTier => {
  const tiering = getTier(tier);
  const localeTier = tiering[countryCode];

  if (localeTier) {
    return localeTier;
  }

  throw new InvalidLocaleError(`Could not find locale: ${countryCode} for tier: ${tier}`);
};

/**
 * Gets the USD exchange rate used by Apple for the given tier and region.
 * Rate is defined as regional price divided by US price.
 *
 * @param {string} tier
 * @param {string} countryCode
 * @param {number} [decimalPlaces=4]
 * @returns {number}
 * @throws {InvalidTierError}
 * @throws {InvalidLocaleError}
 */
export const getUSDRate = (
  tier: string,
  countryCode: string,
  decimalPlaces: number = 4,
): number => {
  const localeTier = getLocaleTier(tier, countryCode);
  if (localeTier.symbol === 'USD') {
    return 1;
  }

  const usdTier = getLocaleTier(tier, US_COUNTRY_CODE);
  const rate = new BigNumber(localeTier.price).dividedBy(usdTier.price).toFixed(decimalPlaces);
  return Number(rate);
};

/**
 * Return the currency used for a given country code.
 *
 * @param {string} countryCode
 * @returns {string}
 * @throws {InvalidLocaleError}
 */
export const getLocaleCurrency = (countryCode: string): string => {
  try {
    const { symbol } = getLocaleTier('1', countryCode);
    return symbol;
  } catch (e) {
    throw new InvalidLocaleError(`Unable to find currency for country code: ${countryCode}`);
  }
};
