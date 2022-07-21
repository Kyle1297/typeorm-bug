import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { BusinessAddress } from '../business_addresses/business_address.entity';

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

  @Field((_type) => BusinessAddress)
  @OneToOne((_type) => BusinessAddress)
  @JoinColumn()
  address: BusinessAddress;
}
