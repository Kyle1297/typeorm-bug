import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as uuid from 'uuid-with-v6';
import { MaxLength, validateOrReject } from 'class-validator';
import { Price } from '../prices/price.entity';
import { Image } from '../images/image.entity';

@ObjectType()
@Entity()
export class Product {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  name: string;

  @Field()
  @MaxLength(1200)
  @Column('text', { nullable: false })
  description: string;

  @Field((_type) => Image)
  @OneToOne((_type) => Image)
  image: Image;

  @Field((_type) => Price)
  @OneToOne((_type) => Price, (price) => price.entityId)
  price: Price;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setIdAsUuid() {
    this.id = uuid.v6();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
