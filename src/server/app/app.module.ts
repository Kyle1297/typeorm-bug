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
import { BusinessModule } from './businesses/business.module';
import { WasherModule } from './washers/washer.module';
import { ProductModule } from './products/product.module';
import { ProductFeatureModule } from './product_features/product_feature.module';
import { ProductImageModule } from './product_images/product_image.module';
import { ProductFeatureOptionModule } from './product_feature_options/product_feature_option.module';
import { OrderImageModule } from './order_images/order_image.module';
import { OrderModule } from './orders/order.module';
import { ProductPriceModule } from './product_prices/product_price.module';
import { ProductFeatureOptionPriceModule } from './product_feature_option_prices/product_feature_option_price.module';
import { WasherAddressModule } from './washer_addresses/washer_address.module';
import { BusinessAddressModule } from './business_addresses/business_address.module';
import { OrderAddressModule } from './order_addresses/order_address.module';
import { UserAddressModule } from './user_addresses/user_address.module';
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
    BusinessModule,
    WasherModule,
    ProductModule,
    ProductFeatureModule,
    ProductFeatureOptionModule,
    ProductImageModule,
    OrderImageModule,
    OrderModule,
    ProductPriceModule,
    ProductFeatureOptionPriceModule,
    UserAddressModule,
    OrderAddressModule,
    BusinessAddressModule,
    WasherAddressModule,
  ],
  providers: [SeedService],
})
export class AppModule {}
