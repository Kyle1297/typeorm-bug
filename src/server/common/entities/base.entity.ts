import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as uuid from 'uuid-with-v6';
import { validateOrReject } from 'class-validator';

@ObjectType()
export abstract class BaseEntity {
  @Field((_type) => ID)
  @PrimaryColumn('uuid', { update: false, nullable: false })
  id: string;

  @Field()
  @CreateDateColumn({ update: false, nullable: false })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ nullable: false })
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
