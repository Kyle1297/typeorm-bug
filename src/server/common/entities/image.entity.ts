import { Column, Index } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { BaseEntity } from './base.entity';

@ObjectType()
export abstract class ImageEntity extends BaseEntity {
  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  name: string;

  @Field()
  @MaxLength(255)
  @Index({ unique: true })
  @Column({ nullable: false, unique: true })
  key: string;
}
