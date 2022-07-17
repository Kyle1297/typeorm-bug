import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import * as uuid from 'uuid-with-v6';
import {
  IsEmail,
  IsISO31661Alpha2,
  IsPhoneNumber,
  MaxLength,
  MinLength,
} from 'class-validator';
import * as bcrypt from 'bcryptjs';
import { SocialProvider } from '../auth/auth.entity';
import { Address, Addressable } from '../addresses/address.entity';

@ObjectType()
@Entity()
export class User implements Addressable {
  @Field((_type) => ID)
  @PrimaryColumn('uuid')
  id: string;

  @Field()
  @IsEmail()
  @Column({ unique: true, nullable: false })
  email: string;

  @MinLength(8)
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

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  setIdAsUuid() {
    this.id = uuid.v6();
  }

  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
