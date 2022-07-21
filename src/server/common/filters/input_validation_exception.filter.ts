import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { InvalidInputError } from 'src/server/app/graphql/responses/invalid_input.error';
import { InputValidationException } from '../exceptions/input_validation.exception';

@Catch(InputValidationException)
export class InputValidationExceptionFilter implements GqlExceptionFilter {
  catch(exception: InputValidationException) {
    const { errors } = exception;
    const resp = new InvalidInputError(errors);
    return [resp];
  }
}
