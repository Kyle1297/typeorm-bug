import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interfaces/error_response.interface';

@ObjectType({
  implements: [ErrorResponse],
})
export class InvalidCredentialsError extends ErrorResponse {
  @Field()
  providedEmail: string;

  constructor(partial?: Partial<InvalidCredentialsError>) {
    super('Invalid credentials provided.');
    Object.assign(this, partial);
  }
}
