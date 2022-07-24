import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';
import { Product } from './product.entity';

@EventSubscriber()
export class ProductSubscriber implements EntitySubscriberInterface<Product> {
  listenTo() {
    return Product;
  }

  async afterLoad(product: Product): Promise<void> {
    product.latestVersion = product.versions.reduce(
      (latestVersion, currentVersion) => {
        return currentVersion.versionNumber > latestVersion.versionNumber
          ? currentVersion
          : latestVersion;
      },
      product.versions[0],
    );
  }
}
