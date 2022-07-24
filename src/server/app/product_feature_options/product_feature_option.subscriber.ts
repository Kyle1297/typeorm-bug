import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { ProductFeatureOption } from './product_feature_option.entity';

@EventSubscriber()
export class ProductFeatureOptionSubscriber
  implements EntitySubscriberInterface<ProductFeatureOption>
{
  listenTo() {
    return ProductFeatureOption;
  }

  async afterLoad(productFeatureOption: ProductFeatureOption): Promise<void> {
    productFeatureOption.latestVersion = productFeatureOption.versions.reduce(
      (latestVersion, currentVersion) => {
        return currentVersion.versionNumber > latestVersion.versionNumber
          ? currentVersion
          : latestVersion;
      },
      productFeatureOption.versions[0],
    );
  }
}
