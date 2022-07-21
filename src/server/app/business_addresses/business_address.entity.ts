import { Entity } from 'typeorm';
import { ObjectType } from '@nestjs/graphql';
import { AddressEntity } from 'src/server/common/entities/address.entity';

@ObjectType()
@Entity()
export class BusinessAddress extends AddressEntity {}
