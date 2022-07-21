import { Field, InputType } from '@nestjs/graphql';
import {
  SocialProviderScalar,
  SocialProviderTypes,
} from '../scalars/social_provider.scalar';

@InputType()
export class LoginSocialInput {
  @Field()
  accessToken: string;

  @Field((_type) => SocialProviderScalar)
  provider: SocialProviderTypes;
}
