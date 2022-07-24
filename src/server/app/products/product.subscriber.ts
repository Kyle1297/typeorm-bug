import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { Product } from './product.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }

  async afterLoad(product: Product): Promise<void> {
    product.latestProductVersion = product.versions.reduce(
      (latestVersion, currentVersion) => {
        return currentVersion.versionNumber > latestVersion.versionNumber
          ? currentVersion
          : latestVersion;
      },
      product.versions[0],
    );
  }
}
