import { InputError } from 'src/server/app/graphql/responses/invalid_input.error';

export class InputValidationException extends Error {
  errors: InputError[];

  constructor(errors: InputError[]) {
    super();
    this.errors = errors;
  }
}
