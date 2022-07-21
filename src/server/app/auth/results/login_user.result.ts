import { createUnionType } from '@nestjs/graphql';
import { AuthUserResponse } from '../responses/auth_user.response';
import { InvalidCredentialsError } from '../responses/invalid_credentials.error';

export const LoginUserResultUnion = createUnionType({
  name: 'LoginUserResult',
  types: () => [AuthUserResponse, InvalidCredentialsError],
});
