import { ErrorResponse } from '../../graphql/interfaces/error-response.interface';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({
  implements: [ErrorResponse],
})
export class CredentialsTakenError extends ErrorResponse {
  @Field()
  providedEmail: string;

  constructor(partial?: Partial<CredentialsTakenError>) {
    super('Credentials are already taken.');
    Object.assign(this, partial);
  }
}
