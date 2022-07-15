import { Field, InputType } from '@nestjs/graphql';
import { IsISO31661Alpha2, IsPhoneNumber } from 'class-validator';
import { LoginSocialInput } from './login-social.input';

@InputType()
export class RegisterSocialInput extends LoginSocialInput {
  @Field()
  @IsISO31661Alpha2()
  phoneCountryCode: string;

  @Field()
  @IsPhoneNumber()
  phoneNumber: string;
}
