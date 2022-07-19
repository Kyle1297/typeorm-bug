import { Column, Entity, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { Address } from '../addresses/address.entity';
import { Washer } from '../washers/washer.entity';
import { BaseEntity } from 'src/server/common/entities/base.entity';

@ObjectType()
@Entity()
export class Business extends BaseEntity {
  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  name: string;

  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  businessNumber: string;

  @Field()
  @Column({ nullable: false })
  isGstRegistered: boolean;

  @Field((_type) => Address)
  @OneToOne((_type) => Address, (address) => address.entityId)
  address: Address;

  @Field((_type) => Washer)
  @OneToOne((_type) => Washer, (washer) => washer.business)
  washer: Washer;
}
