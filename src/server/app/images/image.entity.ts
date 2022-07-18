import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as uuid from 'uuid-with-v6';
import { MaxLength, validateOrReject } from 'class-validator';

@ObjectType()
@Entity()
export class Image {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  name: string;

  @Field()
  @MaxLength(255)
  @Index({ unique: true })
  @Column({ nullable: false, unique: true })
  key: string;

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
