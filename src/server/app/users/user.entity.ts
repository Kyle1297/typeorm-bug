import { Entity, Column, OneToMany, BeforeInsert, Index } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsISO31661Alpha2,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { SocialProvider } from '../auth/auth.entity';
import { Address } from '../addresses/address.entity';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { Order } from '../orders/order.entity';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @IsEmail()
  @Index({ unique: true })
  @Column({ unique: true, nullable: false })
  email: string;

  @MinLength(8)
  @IsOptional()
  @Column({ nullable: true })
  password?: string;

  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  firstName: string;

  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  lastName: string;

  @Field()
  @IsISO31661Alpha2()
  @Column({ nullable: false })
  phoneCountryCode: string;

  @Field()
  @IsPhoneNumber()
  @Column({ nullable: false })
  phoneNumber: string;

  @Field((_type) => [SocialProvider])
  @OneToMany(
    (_type) => SocialProvider,
    (socialProvider) => socialProvider.user,
    {
      nullable: false,
    },
  )
  socialProviders: SocialProvider[];

  @Field((_type) => [Address])
  @OneToMany((_type) => Address, (address) => address.entityId)
  addresses: Address[];

  @Field((_type) => [Order])
  @OneToMany((_type) => Order, (order) => order.user, {
    nullable: false,
  })
  orders: Order[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }
}
