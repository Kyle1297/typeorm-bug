import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateOrderDetailsInput {
  @Field((_type) => [String])
  preferenceIds: string[];

  @Field()
  quantity: number;
}
