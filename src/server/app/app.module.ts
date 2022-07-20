import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsoleModule } from 'nestjs-console';
import { ConfigModule } from '@nestjs/config';
import { SeedService } from 'src/server/console/seed.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { GraphqlConfigService } from '../config/graphql.config';
import { TypeOrmConfigService } from '../config/typeorm.config';
import { AddressModule } from './addresses/address.module';
import { BusinessModule } from './businesses/business.module';
import { WasherModule } from './washers/washer.module';
import { PriceModule } from './prices/price.module';
import { ProductModule } from './products/product.module';
import { ProductFeatureModule } from './product_features/productFeature.module';
import { ProductImageModule } from './product_images/productImage.module';
import { ProductFeatureOptionModule } from './product_feature_options/productFeatureOption.module';
import { OrderImageModule } from './order_images/orderImage.module';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useClass: GraphqlConfigService,
    }),
    ConfigModule.forRoot({
      ignoreEnvFile: !!process.env.CI,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ConsoleModule,
    UserModule,
    AuthModule,
    AddressModule,
    BusinessModule,
    WasherModule,
    PriceModule,
    ProductModule,
    ProductFeatureModule,
    ProductFeatureOptionModule,
    ProductImageModule,
    OrderImageModule,
    OrderModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
