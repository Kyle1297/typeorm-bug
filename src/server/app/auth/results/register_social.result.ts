import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../responses/auth_user.response';
import { SocialAlreadyAssignedError } from '../responses/social_already_assigned.error';
import { CredentialsTakenError } from '../responses/credentials_taken.error';

export const RegisterSocialResultUnion = createUnionType({
  name: 'RegisterSocialResult',
  types: () => [
    AuthUserResponse,
    SocialAlreadyAssignedError,
    CredentialsTakenError,
  ],
});
