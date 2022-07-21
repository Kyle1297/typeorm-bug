import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../responses/auth_user.response';
import { SocialNotRegisteredError } from '../responses/social_not_registered.error';

export const LoginSocialResultUnion = createUnionType({
  name: 'LoginSocialResult',
  types: () => [AuthUserResponse, SocialNotRegisteredError],
});
