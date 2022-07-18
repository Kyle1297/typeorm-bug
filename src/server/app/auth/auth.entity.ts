import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as uuid from 'uuid-with-v6';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../users/user.entity';
import {
  SocialProviderScalar,
  SocialProviderTypes,
} from './scalars/SocialProviderScalar';
import { validateOrReject } from 'class-validator';

@ObjectType()
@Entity()
export class SocialProvider {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

  @Field((_type) => SocialProviderScalar)
  @Column({ nullable: false })
  provider: SocialProviderTypes;

  @Field()
  @Column({ unique: true, nullable: false })
  socialId: string;

  @Field((_type) => User)
  @ManyToOne((_type) => User, (user) => user.socialProviders, {
    nullable: false,
  })
  user: User;

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
