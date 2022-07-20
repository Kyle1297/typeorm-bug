import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsOptional, MaxLength } from 'class-validator';
import { OrderStatuses, OrderStatusScalar } from './scalars/OrderStatusScalar';
import { Address } from '../addresses/address.entity';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import orderId from 'order-id';
import {
  OrderTimeslots,
  OrderTimeslotScalar,
} from './scalars/OrderTimeslotScalar';
import { IsISO4217 } from 'src/server/common/decorators/IsISO4217';
import { Product } from '../products/product.entity';
import { User } from '../users/user.entity';
import { Washer } from '../washers/washer.entity';
import { OrderImage } from '../order_images/orderImage.entity';

const ORDER_ID_SEED_PHRASE = 'order-id-seed-phrase';

@ObjectType()
@Entity()
export class Order extends BaseEntity {
  @Field()
  @Column({ nullable: false })
  orderNumber: string;

  @Field()
  @IsISO4217()
  @Column({ nullable: false })
  currencyCode: string;

  @Field((_type) => OrderTimeslotScalar, {
    description: 'The timeslot for pickup',
    nullable: true,
  })
  @Column({ nullable: true })
  pickupBetween?: OrderTimeslots;

  @Field((_type) => OrderTimeslotScalar, {
    description: 'The timeslot for delivery',
    nullable: true,
  })
  @Column({ nullable: true })
  deliverBetween?: OrderTimeslots;

  @Field((_type) => OrderStatusScalar, {
    description: 'The current status of the order',
  })
  @Column({ nullable: false })
  status: OrderStatuses;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  confirmedAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  washerAssignedAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  pickedUpAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  readyForDeliveryAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  onTheWayAt?: Date;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  deliveredAt?: Date;

  @Field()
  @MaxLength(1200)
  @Column('text', { nullable: false, default: '' })
  notesOnPickup?: string;

  @Field()
  @MaxLength(1200)
  @Column('text', { nullable: false, default: '' })
  notesOnDelivery?: string;

  @Field((_type) => Address)
  @OneToOne((_type) => Address, (address) => address.entityId, {
    nullable: true,
  })
  @JoinColumn()
  pickupAddress?: Address;

  @Field((_type) => Address, { nullable: true })
  @OneToOne((_type) => Address, (address) => address.entityId, {
    nullable: true,
  })
  @JoinColumn()
  deliveryAddress?: Address;

  @Field((_type) => Product)
  @ManyToOne((_type) => Product, (product) => product.orders, {
    nullable: false,
  })
  product: Product;

  @Field((_type) => User)
  @ManyToOne((_type) => User, (user) => user.orders, {
    nullable: false,
  })
  user: User;

  @Field((_type) => Washer, { nullable: true })
  @ManyToOne((_type) => Washer, (washer) => washer.orders, {
    nullable: true,
  })
  washer?: Washer;

  @Field((_type) => [OrderImage], { nullable: true })
  @OneToMany((_type) => OrderImage, (orderImage) => orderImage.order, {
    nullable: true,
  })
  pickupImages?: OrderImage[];

  @Field((_type) => [OrderImage], { nullable: true })
  @OneToMany((_type) => OrderImage, (orderImage) => orderImage.order, {
    nullable: true,
  })
  readyForDeliveryImages?: OrderImage[];

  @Field((_type) => [OrderImage], { nullable: true })
  @OneToMany((_type) => OrderImage, (orderImage) => orderImage.order, {
    nullable: true,
  })
  deliveryImages?: OrderImage[];

  @BeforeInsert()
  setOrderNumber() {
    this.orderNumber = orderId(ORDER_ID_SEED_PHRASE).generate();
  }

  private previousWasher: Washer | undefined;

  @AfterLoad()
  setPreviousWasher() {
    this.previousWasher = this.washer;
  }

  @BeforeUpdate()
  setWasherAssignedStatus() {
    if (this.washer !== this.previousWasher) {
      if (this.washer) {
        this.washerAssignedAt = new Date();
        this.status = 'WASHER_ASSIGNED';
      } else {
        this.washerAssignedAt = null;
        this.status = 'CONFIRMED';
      }
    }
  }

  private previousStatus: OrderStatuses | undefined;

  @AfterLoad()
  setPreviousStatus() {
    this.previousStatus = this.status;
  }

  @BeforeInsert()
  @BeforeUpdate()
  setStatusChangeDate() {
    if (this.status !== this.previousStatus) {
      if (this.status === 'CONFIRMED') {
        this.confirmedAt = new Date();
      } else if (this.status === 'PICKED_UP') {
        this.pickedUpAt = new Date();
      } else if (this.status === 'READY_FOR_DELIVERY') {
        this.readyForDeliveryAt = new Date();
      } else if (this.status === 'ON_THE_WAY') {
        this.onTheWayAt = new Date();
      } else if (this.status === 'DELIVERED') {
        this.deliveredAt = new Date();
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateUnconfirmedStatus() {
    if (this.status === 'NOT_CONFIRMED') {
      if (this.confirmedAt) {
        throw new Error(
          'Order cannot have a confirmed date if it has not been confirmed',
        );
      }
      if (this.washerAssignedAt) {
        throw new Error(
          'Order cannot have a washer assigned date if it has not been confirmed',
        );
      }
      if (this.pickedUpAt) {
        throw new Error(
          'Order cannot have a picked up date if it has not been confirmed',
        );
      }
      if (this.readyForDeliveryAt) {
        throw new Error(
          'Order cannot have a ready for delivery date if it has not been confirmed',
        );
      }
      if (this.onTheWayAt) {
        throw new Error(
          'Order cannot have a on the way date if it has not been confirmed',
        );
      }
      if (this.deliveredAt) {
        throw new Error(
          'Order cannot have a delivered date if it has not been confirmed',
        );
      }
      if (this.washer) {
        throw new Error(
          'Order cannot have a washer if it has not been confirmed',
        );
      }
      if (this.notesOnPickup) {
        throw new Error(
          'Order cannot have notes on pickup if it has not been confirmed',
        );
      }
      if (this.notesOnDelivery) {
        throw new Error(
          'Order cannot have notes on delivery if it has not been confirmed',
        );
      }
      if (this.pickupImages) {
        throw new Error(
          'Order cannot have pickup images if it has not been confirmed',
        );
      }
      if (this.readyForDeliveryImages) {
        throw new Error(
          'Order cannot have ready for delivery images if it has not been confirmed',
        );
      }
      if (this.deliveryImages) {
        throw new Error(
          'Order cannot have delivery images if it has not been confirmed',
        );
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateConfirmedStatus() {
    if (this.status === 'CONFIRMED') {
      if (!this.confirmedAt) {
        throw new Error('Order must have a confirmed date if it is confirmed');
      }
      if (this.washerAssignedAt) {
        throw new Error(
          'Order cannot have a washer assigned date if it has only been confirmed',
        );
      }
      if (this.pickedUpAt) {
        throw new Error(
          'Order cannot have a picked up date if it has only been confirmed',
        );
      }
      if (this.readyForDeliveryAt) {
        throw new Error(
          'Order cannot have a ready for delivery date if it has only been confirmed',
        );
      }
      if (this.onTheWayAt) {
        throw new Error(
          'Order cannot have a on the way date if it has only been confirmed',
        );
      }
      if (this.deliveredAt) {
        throw new Error(
          'Order cannot have a delivered date if it has only been confirmed',
        );
      }
      if (this.washer) {
        throw new Error(
          'Order cannot have a washer if it has only been confirmed',
        );
      }
      if (!this.pickupAddress) {
        throw new Error('Order must have a pick up address if it is confirmed');
      }
      if (!this.deliveryAddress) {
        throw new Error(
          'Order must have a delivery address if it is confirmed',
        );
      }
      if (!this.pickupBetween) {
        throw new Error('Order must have a pick up time if it is confirmed');
      }
      if (!this.deliverBetween) {
        throw new Error('Order must have a delivery time if it is confirmed');
      }
      if (this.notesOnPickup) {
        throw new Error(
          'Order cannot have notes on pickup if it has only been confirmed',
        );
      }
      if (this.notesOnDelivery) {
        throw new Error(
          'Order cannot have notes on delivery if it has only been confirmed',
        );
      }
      if (this.pickupImages) {
        throw new Error(
          'Order cannot have pickup images if it has only been confirmed',
        );
      }
      if (this.readyForDeliveryImages) {
        throw new Error(
          'Order cannot have ready for delivery images if it has only been confirmed',
        );
      }
      if (this.deliveryImages) {
        throw new Error(
          'Order cannot have delivery images if it has only been confirmed',
        );
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateWasherAssignedStatus() {
    if (this.status === 'WASHER_ASSIGNED') {
      if (!this.confirmedAt) {
        throw new Error(
          "Order must have a confirmed date if it's washer has been assigned",
        );
      }
      if (!this.washerAssignedAt) {
        throw new Error(
          "Order must have a washer assigned date if it's washer has been assigned",
        );
      }
      if (this.pickedUpAt) {
        throw new Error(
          "Order cannot have a picked up date if it's washer has only been assigned",
        );
      }
      if (this.readyForDeliveryAt) {
        throw new Error(
          "Order cannot have a ready for delivery date if it's washer has only been assigned",
        );
      }
      if (this.onTheWayAt) {
        throw new Error(
          "Order cannot have a on the way date if it's washer has only been assigned",
        );
      }
      if (this.deliveredAt) {
        throw new Error(
          "Order cannot have a delivered date if it's washer has only been assigned",
        );
      }
      if (!this.washer) {
        throw new Error(
          "Order must have a washer if it's status is washer assigned",
        );
      }
      if (!this.pickupAddress) {
        throw new Error(
          "Order must have a pick up address if it's washer has been assigned",
        );
      }
      if (!this.deliveryAddress) {
        throw new Error(
          "Order must have a delivery address if it's washer has been assigned",
        );
      }
      if (!this.pickupBetween) {
        throw new Error(
          "Order must have a pick up time if it's washer has been assigned",
        );
      }
      if (!this.deliverBetween) {
        throw new Error(
          "Order must have a delivery time if it's washer has been assigned",
        );
      }
      if (this.notesOnPickup) {
        throw new Error(
          "Order cannot have notes on pickup if it's washer has only been assigned",
        );
      }
      if (this.notesOnDelivery) {
        throw new Error(
          "Order cannot have notes on delivery if it's washer has only been assigned",
        );
      }
      if (this.pickupImages) {
        throw new Error(
          "Order cannot have pickup images if it's washer has only been assigned",
        );
      }
      if (this.readyForDeliveryImages) {
        throw new Error(
          "Order cannot have ready for delivery images if it's washer has only been assigned",
        );
      }
      if (this.deliveryImages) {
        throw new Error(
          "Order cannot have delivery images if it's washer has only been assigned",
        );
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validatePickedUpStatus() {
    if (this.status === 'PICKED_UP') {
      if (!this.confirmedAt) {
        throw new Error(
          'Order must have a confirmed date if it has been picked up',
        );
      }
      if (!this.washerAssignedAt) {
        throw new Error(
          'Order must have a washer assigned date if it has been picked up',
        );
      }
      if (!this.pickedUpAt) {
        throw new Error(
          'Order must have a picked up date if it has been picked up',
        );
      }
      if (this.readyForDeliveryAt) {
        throw new Error(
          'Order cannot have a ready for delivery date if it has been picked up',
        );
      }
      if (this.onTheWayAt) {
        throw new Error(
          'Order cannot have a on the way date if it has only been picked up',
        );
      }
      if (this.deliveredAt) {
        throw new Error(
          'Order cannot have a delivered date if it has only been picked up',
        );
      }
      if (!this.washer) {
        throw new Error('Order must have a washer if it has been picked up');
      }
      if (!this.pickupAddress) {
        throw new Error(
          'Order must have a pick up address if it has been picked up',
        );
      }
      if (!this.deliveryAddress) {
        throw new Error(
          'Order must have a delivery address if it has been picked up',
        );
      }
      if (!this.pickupBetween) {
        throw new Error(
          'Order must have a pick up time if it has been picked up',
        );
      }
      if (!this.deliverBetween) {
        throw new Error(
          'Order must have a delivery time if it has been picked up',
        );
      }
      if (this.notesOnDelivery) {
        throw new Error(
          'Order cannot have notes on delivery if it has only been picked up',
        );
      }
      if (this.readyForDeliveryImages) {
        throw new Error(
          'Order cannot have ready for delivery images if it has only been picked up',
        );
      }
      if (this.deliveryImages) {
        throw new Error(
          'Order cannot have delivery images if it has only been picked up',
        );
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateReadyForDeliveryStatus() {
    if (this.status === 'READY_FOR_DELIVERY') {
      if (!this.confirmedAt) {
        throw new Error(
          'Order must have a confirmed date if it is ready for delivery',
        );
      }
      if (!this.washerAssignedAt) {
        throw new Error(
          'Order must have a washer assigned date if it is ready for delivery',
        );
      }
      if (!this.pickedUpAt) {
        throw new Error(
          'Order must have a picked up date if it is ready for delivery',
        );
      }
      if (!this.readyForDeliveryAt) {
        throw new Error(
          'Order must have a ready for delivery date if it is ready for delivery',
        );
      }
      if (this.onTheWayAt) {
        throw new Error(
          'Order cannot have a on the way date if it is ready for delivery',
        );
      }
      if (this.deliveredAt) {
        throw new Error(
          'Order cannot have a delivered date if it is ready for delivery',
        );
      }
      if (!this.washer) {
        throw new Error('Order must have a washer if it is ready for delivery');
      }
      if (!this.pickupAddress) {
        throw new Error(
          'Order must have a pick up address if it is ready for delivery',
        );
      }
      if (!this.deliveryAddress) {
        throw new Error(
          'Order must have a delivery address if it is ready for delivery',
        );
      }
      if (!this.pickupBetween) {
        throw new Error(
          'Order must have a pick up time if it is ready for delivery',
        );
      }
      if (!this.deliverBetween) {
        throw new Error(
          'Order must have a delivery time if it is ready for delivery',
        );
      }
      if (this.notesOnDelivery) {
        throw new Error(
          'Order cannot have notes on delivery if it is ready for delivery',
        );
      }
      if (!this.readyForDeliveryImages) {
        throw new Error(
          'Order must have ready for delivery images if it is ready for delivery',
        );
      }
      if (this.deliveryImages) {
        throw new Error(
          'Order cannot have delivery images if it is ready for delivery',
        );
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateOnTheWayStatus() {
    if (this.status === 'ON_THE_WAY') {
      if (!this.confirmedAt) {
        throw new Error('Order must have a confirmed date if it is on the way');
      }
      if (!this.washerAssignedAt) {
        throw new Error(
          'Order must have a washer assigned date if it is on the way',
        );
      }
      if (!this.pickedUpAt) {
        throw new Error('Order must have a picked up date if it is on the way');
      }
      if (!this.readyForDeliveryAt) {
        throw new Error(
          'Order must have a ready for delivery date if it is on the way',
        );
      }
      if (!this.onTheWayAt) {
        throw new Error(
          'Order must have a on the way date if it is on the way',
        );
      }
      if (this.deliveredAt) {
        throw new Error(
          'Order cannot have a delivered date if it is only on the way',
        );
      }
      if (!this.washer) {
        throw new Error('Order must have a washer if it is on the way');
      }
      if (!this.pickupAddress) {
        throw new Error(
          'Order must have a pick up address if it is on the way',
        );
      }
      if (!this.deliveryAddress) {
        throw new Error(
          'Order must have a delivery address if it is on the way',
        );
      }
      if (!this.pickupBetween) {
        throw new Error('Order must have a pick up time if it is on the way');
      }
      if (!this.deliverBetween) {
        throw new Error('Order must have a delivery time if it is on the way');
      }
      if (this.notesOnDelivery) {
        throw new Error(
          'Order cannot have notes on delivery if it is on the way',
        );
      }
      if (!this.readyForDeliveryImages) {
        throw new Error(
          'Order must have ready for delivery images if it is on the way',
        );
      }
      if (this.deliveryImages) {
        throw new Error(
          'Order cannot have delivery images if it is on the way',
        );
      }
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateDeliveredStatus() {
    if (this.status === 'DELIVERED') {
      if (!this.confirmedAt) {
        throw new Error(
          'Order must have a confirmed date if it has been delivered',
        );
      }
      if (!this.washerAssignedAt) {
        throw new Error(
          'Order must have a washer assigned date if it has been delivered',
        );
      }
      if (!this.pickedUpAt) {
        throw new Error(
          'Order must have a picked up date if it has been delivered',
        );
      }
      if (!this.readyForDeliveryAt) {
        throw new Error(
          'Order must have a ready for delivery date if it has been delivered',
        );
      }
      if (!this.onTheWayAt) {
        throw new Error(
          'Order must have a on the way date if it has been delivered',
        );
      }
      if (!this.deliveredAt) {
        throw new Error(
          'Order must have a delivered date if it has been delivered',
        );
      }
      if (!this.washer) {
        throw new Error('Order must have a washer if it has been delivered');
      }
      if (!this.pickupAddress) {
        throw new Error(
          'Order must have a pick up address if it has been delivered',
        );
      }
      if (!this.deliveryAddress) {
        throw new Error(
          'Order must have a delivery address if it has been delivered',
        );
      }
      if (!this.pickupBetween) {
        throw new Error(
          'Order must have a pick up time if it has been delivered',
        );
      }
      if (!this.deliverBetween) {
        throw new Error(
          'Order must have a delivery time if it has been delivered',
        );
      }
      if (!this.readyForDeliveryImages) {
        throw new Error(
          'Order must have ready for delivery images if it has been delivered',
        );
      }
    }
  }
}
