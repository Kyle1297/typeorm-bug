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
import { Address } from '../addresses/address.entity';
import { Washer } from '../washers/washer.entity';

@ObjectType()
@Entity()
export class Business {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

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
