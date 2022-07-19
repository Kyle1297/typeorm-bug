import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, Index } from 'typeorm';
import { User } from '../users/user.entity';
import {
  SocialProviderScalar,
  SocialProviderTypes,
} from './scalars/SocialProviderScalar';
import { BaseEntity } from 'src/server/common/entities/base.entity';

@ObjectType()
@Entity()
export class SocialProvider extends BaseEntity {
  @Field((_type) => SocialProviderScalar)
  @Index()
  @Column({ nullable: false })
  provider: SocialProviderTypes;

  @Field()
  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  socialId: string;

  @Field((_type) => User)
  @ManyToOne((_type) => User, (user) => user.socialProviders, {
    nullable: false,
  })
  user: User;
}
