import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorResponse } from '../../graphql/interfaces/error-response.interface';
import {
  SocialProviderScalar,
  SocialProviderTypes,
} from '../scalars/SocialProviderScalar';

@ObjectType({
  implements: [ErrorResponse],
})
export class SocialNotRegisteredError extends ErrorResponse {
  @Field((_type) => SocialProviderScalar)
  provider: SocialProviderTypes;

  constructor(partial?: Partial<SocialNotRegisteredError>) {
    super('No account registered with this social provider.');
    Object.assign(this, partial);
  }
}
