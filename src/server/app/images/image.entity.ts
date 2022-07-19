import { Column, Entity, Index } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { MaxLength } from 'class-validator';
import { BaseEntity } from 'src/server/common/entities/base.entity';

@ObjectType()
@Entity()
export class Image extends BaseEntity {
  @Field()
  @MaxLength(255)
  @Column({ nullable: false })
  name: string;

  @Field()
  @MaxLength(255)
  @Index({ unique: true })
  @Column({ nullable: false, unique: true })
  key: string;
}
