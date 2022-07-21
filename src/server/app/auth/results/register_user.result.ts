import { createUnionType } from '@nestjs/graphql';
import { InvalidInputError } from '../../graphql/responses/invalid_input.error';
import { AuthUserResponse } from '../responses/auth_user.response';
import { CredentialsTakenError } from '../responses/credentials_taken.error';

export const RegisterUserResultUnion = createUnionType({
  name: 'RegisterUserResult',
  types: () => [AuthUserResponse, InvalidInputError, CredentialsTakenError],
});
