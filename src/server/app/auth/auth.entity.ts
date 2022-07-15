import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import * as uuid from 'uuid-with-v6';
import {
  Column,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  BeforeInsert,
} from 'typeorm';

import { User } from '../users/user.entity';

export enum SocialProviderTypes {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

registerEnumType(SocialProviderTypes, {
  name: 'SocialAuthProviders',
});

@ObjectType()
@Entity()
export class SocialProvider {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

  @Field()
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
}
