import { ProductFeatureOptionVersion } from '../../product_feature_option_versions/product_feature_option_version.entity';
import { ProductVersion } from '../../product_versions/product_version.entity';

const getCurrencyProperty = (currency: string) => {
  switch (currency.toUpperCase()) {
    case 'AUD':
    default:
      return 'audInCents';
  }
};

export interface GetTotalOrderPriceParameters {
  currencyCode: string;
  productVersion: ProductVersion;
  preferences: ProductFeatureOptionVersion[];
  isExpressDelivery: boolean;
  quantity: number;
}

export const getTotalOrderPrice = ({
  currencyCode,
  productVersion,
  preferences,
  isExpressDelivery,
  quantity,
}: GetTotalOrderPriceParameters): number => {
  const currencyProperty = getCurrencyProperty(currencyCode);

  const expressDeliveryPrice = isExpressDelivery
    ? productVersion.expressDeliveryPrice[currencyProperty]
    : 0;
  const basePrice = productVersion.basePrice[currencyProperty];
  const costOfExtras = preferences.reduce(
    (sum, optionVersion) => sum + optionVersion.price[currencyProperty],
    0,
  );

  return (basePrice + expressDeliveryPrice + costOfExtras) * quantity;
};
