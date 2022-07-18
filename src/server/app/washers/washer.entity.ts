import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as uuid from 'uuid-with-v6';
import {
  IsDate,
  IsLocale,
  IsOptional,
  validateOrReject,
} from 'class-validator';
import {
  WasherStatuses,
  WasherStatusScalar,
} from './scalars/WasherStatusScalar';
import { Address } from '../addresses/address.entity';
import { Business } from '../businesses/business.entity';

@ObjectType()
@Entity()
export class Washer {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

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
  address: Address;

  @Field((_type) => Business)
  @OneToOne((_type) => Business, (business) => business.washer)
  business: Business;

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

  @BeforeInsert()
  setDefaultLastStatusChangeAt() {
    this.lastStatusChangeAt = new Date();
  }

  previousStatus: WasherStatuses | undefined;

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
