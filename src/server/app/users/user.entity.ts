import {
  Entity,
  Column,
  OneToMany,
  BeforeInsert,
  Index,
  AfterLoad,
  BeforeUpdate,
} from 'typeorm';
import { ObjectType, Field, HideField } from '@nestjs/graphql';
import {
  IsEmail,
  IsISO31661Alpha2,
  IsLocale,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as localeCurrency from 'locale-currency';
import * as bcrypt from 'bcryptjs';
import { SocialProvider } from '../auth/auth.entity';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import { Order } from '../orders/order.entity';
import { UserAddress } from '../user_addresses/user_address.entity';
import { compareUserAddresses } from '../user_addresses/utils/compareUserAddresses';
import isISO4217 from 'validator/lib/isISO4217';

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
  @HideField()
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

  @HideField()
  @Column({ nullable: false })
  stripeCustomerId: string;

  @HideField()
  @IsLocale()
  @Column({ nullable: false })
  locale: string;

  @Field()
  @Column({ nullable: false })
  currencyCode: string;

  @Field((_type) => [SocialProvider])
  @OneToMany(
    (_type) => SocialProvider,
    (socialProvider) => socialProvider.user,
    {
      nullable: false,
    },
  )
  socialProviders: SocialProvider[];

  @Field((_type) => [UserAddress])
  @OneToMany((_type) => UserAddress, (userAddress) => userAddress.user, {
    nullable: false,
    cascade: true,
  })
  addresses: UserAddress[];

  @Field((_type) => [Order])
  @OneToMany((_type) => Order, (order) => order.user, {
    nullable: false,
  })
  orders: Order[];

  @BeforeInsert()
  @BeforeUpdate()
  setCurrencyCodeFromLocale() {
    this.currencyCode = localeCurrency.getCurrency(this.locale) || 'AUD';
  }

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  @Field()
  fullName: string;

  @AfterLoad()
  setFullname() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateCurrencyCode() {
    if (!isISO4217(this.currencyCode)) {
      throw new Error(`Invalid currency code: ${this.currencyCode}`);
    }
  }

  isDuplicateAddress(address: UserAddress) {
    return this.addresses.some((existingAddress) => {
      if (existingAddress.id === address.id) return false;
      return compareUserAddresses(existingAddress, address);
    });
  }
}
