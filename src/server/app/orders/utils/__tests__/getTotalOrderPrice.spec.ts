import {
  productFeatureOptionPriceFactory,
  productPriceFactory,
} from 'test/factories/price.factory';
import { productVersionFactory } from 'test/factories/product.factory';
import { productFeatureOptionVersionFactory } from 'test/factories/product_feature_option.factory';
import { getTotalOrderPrice } from '../getTotalOrderPrice';

describe('getTotalOrderPrice', () => {
  it('should return total price of order with express delivery', () => {
    const currencyCode = 'AUD';
    const isExpressDelivery = true;
    const quantity = 10;

    // product prices
    const basePrice = productPriceFactory.buildOne({
      audInCents: 4000,
    });
    const expressDeliveryPrice = productPriceFactory.buildOne({
      audInCents: 1000,
    });
    const productVersion = productVersionFactory.buildOne({
      basePrice,
      expressDeliveryPrice,
    });

    // preference prices
    const preferenceOnePrice = productFeatureOptionPriceFactory.buildOne({
      audInCents: 0,
    });
    const preferenceOne = productFeatureOptionVersionFactory.buildOne({
      price: preferenceOnePrice,
    });
    const preferenceTwoPrice = productFeatureOptionPriceFactory.buildOne({
      audInCents: 200,
    });
    const preferenceTwo = productFeatureOptionVersionFactory.buildOne({
      price: preferenceTwoPrice,
    });

    const result = getTotalOrderPrice({
      currencyCode,
      productVersion,
      isExpressDelivery,
      quantity,
      preferences: [preferenceOne, preferenceTwo],
    });

    expect(result).toEqual(52000);
  });

  it('should return total price of order without express delivery', () => {
    const currencyCode = 'AUD';
    const isExpressDelivery = false;
    const quantity = 10;

    // product prices
    const basePrice = productPriceFactory.buildOne({
      audInCents: 4000,
    });
    const productVersion = productVersionFactory.buildOne({
      basePrice,
    });

    // preference prices
    const preferenceOnePrice = productFeatureOptionPriceFactory.buildOne({
      audInCents: 0,
    });
    const preferenceOne = productFeatureOptionVersionFactory.buildOne({
      price: preferenceOnePrice,
    });
    const preferenceTwoPrice = productFeatureOptionPriceFactory.buildOne({
      audInCents: 200,
    });
    const preferenceTwo = productFeatureOptionVersionFactory.buildOne({
      price: preferenceTwoPrice,
    });

    const result = getTotalOrderPrice({
      currencyCode,
      productVersion,
      isExpressDelivery,
      quantity,
      preferences: [preferenceOne, preferenceTwo],
    });

    expect(result).toEqual(42000);
  });

  it('should return total price of order with express delivery and no preferences', () => {
    const currencyCode = 'AUD';
    const isExpressDelivery = true;
    const quantity = 10;

    // product prices
    const basePrice = productPriceFactory.buildOne({
      audInCents: 4000,
    });
    const expressDeliveryPrice = productPriceFactory.buildOne({
      audInCents: 1000,
    });
    const productVersion = productVersionFactory.buildOne({
      basePrice,
      expressDeliveryPrice,
    });

    const result = getTotalOrderPrice({
      currencyCode,
      productVersion,
      isExpressDelivery,
      quantity,
      preferences: [],
    });

    expect(result).toEqual(50000);
  });

  it('should return total price of order without express delivery and no preferences', () => {
    const currencyCode = 'AUD';
    const isExpressDelivery = false;
    const quantity = 10;

    // product prices
    const basePrice = productPriceFactory.buildOne({
      audInCents: 4000,
    });
    const productVersion = productVersionFactory.buildOne({
      basePrice,
    });

    const result = getTotalOrderPrice({
      currencyCode,
      productVersion,
      isExpressDelivery,
      quantity,
      preferences: [],
    });

    expect(result).toEqual(40000);
  });
});
