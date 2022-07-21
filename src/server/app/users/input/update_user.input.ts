import { Field, InputType } from '@nestjs/graphql';
import { IsISO31661Alpha2, IsPhoneNumber, MaxLength } from 'class-validator';
import { User } from '../user.entity';

@InputType()
export class UpdateUserNameInput implements Partial<User> {
  @Field()
  @MaxLength(255)
  firstName: string;

  @Field()
  @MaxLength(255)
  lastName: string;
}

@InputType()
export class UpdateUserPhoneInput implements Partial<User> {
  @Field()
  @IsISO31661Alpha2()
  phoneCountryCode: string;

  @Field()
  @IsPhoneNumber()
  phoneNumber: string;
}
