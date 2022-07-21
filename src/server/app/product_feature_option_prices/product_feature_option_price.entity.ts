import { Entity } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';
import { PriceEntity } from 'src/server/common/entities/price.entity';

@ObjectType()
@Entity()
export class ProductFeatureOptionPrice extends PriceEntity {}
