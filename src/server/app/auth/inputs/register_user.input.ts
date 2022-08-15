import { Field, InputType, PickType } from '@nestjs/graphql';
import {
  IsISO31661Alpha2,
  IsLocale,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import { User } from '../../users/user.entity';

@InputType()
export class RegisterUserInput extends PickType(User, ['email'], InputType) {
  @Field()
  @MinLength(8)
  password: string;

  @Field()
  @MaxLength(255)
  firstName: string;

  @Field()
  @MaxLength(255)
  lastName: string;

  @Field()
  @IsISO31661Alpha2()
  phoneCountryCode: string;

  @Field()
  @IsPhoneNumber()
  phoneNumber: string;

  @Field()
  @IsLocale()
  locale: string;
}
