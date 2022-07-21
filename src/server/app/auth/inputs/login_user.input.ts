import { InputType, PickType } from '@nestjs/graphql';
import { RegisterUserInput } from './register_user.input';

@InputType()
export class LoginUserInput extends PickType(RegisterUserInput, [
  'email',
  'password',
]) {}
