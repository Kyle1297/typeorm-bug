import { Column, Entity } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { AddressEntity } from 'src/server/common/entities/address.entity';

@ObjectType()
@Entity()
export class WasherAddress extends AddressEntity {
  @Field({ description: 'Place or business name', defaultValue: '' })
  @MaxLength(255)
  @Column({ nullable: false, default: '' })
  organisationName: string;
}
