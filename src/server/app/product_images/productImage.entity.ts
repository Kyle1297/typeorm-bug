import { Entity } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';
import { ImageEntity } from 'src/server/common/entities/image.entity';

@ObjectType()
@Entity()
export class ProductImage extends ImageEntity {}
