import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsLocale, IsOptional } from 'class-validator';
import {
  WasherStatuses,
  WasherStatusScalar,
} from './scalars/WasherStatusScalar';
import { Address } from '../addresses/address.entity';
import { Business } from '../businesses/business.entity';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { Order } from '../orders/order.entity';

@ObjectType()
@Entity()
export class Washer extends BaseEntity {
  @Field((_type) => WasherStatusScalar, {
    description: 'The current status of the washer',
  })
  @Index()
  @Column({ nullable: false })
  status: WasherStatuses;

  @Field()
  @IsDate()
  @Column({ nullable: false })
  lastStatusChangeAt: Date;

  @Field()
  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  firstAbleToWorkAt: Date;

  @Field()
  @IsLocale()
  @Column({ nullable: false, default: 'en-US' })
  language: string;

  @Field((_type) => Address)
  @OneToOne((_type) => Address, (address) => address.entityId)
  @JoinColumn()
  address: Address;

  @Field((_type) => Business)
  @OneToOne((_type) => Business)
  @JoinColumn()
  business: Business;

  @Field((_type) => [Order])
  @OneToMany((_type) => Order, (order) => order.washer, {
    nullable: false,
  })
  orders: Order[];

  @BeforeInsert()
  setDefaultLastStatusChangeAt() {
    this.lastStatusChangeAt = new Date();
  }

  private previousStatus: WasherStatuses | undefined;

  @AfterLoad()
  setPreviousStatus() {
    this.previousStatus = this.status;
  }

  @BeforeUpdate()
  setLastStatusChangeAt() {
    if (this.status !== this.previousStatus) {
      this.lastStatusChangeAt = new Date();
    }
  }
}
