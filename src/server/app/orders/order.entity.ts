import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { IsDate, IsOptional, MaxLength, Min } from 'class-validator';
import {
  OrderStatuses,
  OrderStatusScalar,
} from './scalars/order_status.scalar';
import { BaseEntity } from 'src/server/common/entities/base.entity';
import orderId from 'order-id';
import {
  OrderTimeslots,
  OrderTimeslotScalar,
} from './scalars/order_timeslot.scalar';
import { IsISO4217 } from 'src/server/common/decorators/IsISO4217';
import { ProductVersion } from '../product_versions/product_version.entity';
import { User } from '../users/user.entity';
import { Washer } from '../washers/washer.entity';
import { OrderImage } from '../order_images/order_image.entity';
import { OrderAddress } from '../order_addresses/order_address.entity';
import { ProductFeatureOptionVersion } from '../product_feature_option_versions/product_feature_option_version.entity';

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

  @Field()
  @Min(1)
  @Column('integer', { nullable: false })
  quantity: number;

  @Field()
  @Column({ nullable: false })
  isExpressDelivery: boolean;

  @Field()
  @Min(0)
  @Column('integer', { nullable: false })
  totalPriceInCents: number;

  @Field()
  @IsDate()
  @Column()
  pickupDate: Date;

  @Field((_type) => OrderTimeslotScalar, {
    description: 'The timeslot for pickup',
  })
  @Column()
  pickupBetween: OrderTimeslots;

  @Field()
  @IsDate()
  @Column()
  deliveryDate: Date;

  @Field((_type) => OrderTimeslotScalar, {
    description: 'The timeslot for delivery',
  })
  @Column()
  deliverBetween: OrderTimeslots;

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
  washerNotesOnPickup: string;

  @Field()
  @MaxLength(1200)
  @Column('text', { nullable: false, default: '' })
  washerNotesOnDelivery: string;

  @Field((_type) => OrderAddress)
  @OneToOne((_type) => OrderAddress, {
    cascade: true,
  })
  @JoinColumn()
  pickupAddress: OrderAddress;

  @Field((_type) => OrderAddress)
  @OneToOne((_type) => OrderAddress, {
    cascade: true,
  })
  @JoinColumn()
  deliveryAddress: OrderAddress;

  @Field((_type) => ProductVersion)
  @ManyToOne(
    (_type) => ProductVersion,
    (productVersion) => productVersion.orders,
    {
      nullable: false,
      cascade: true,
    },
  )
  productVersion: ProductVersion;

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

  @Field((_type) => [ProductFeatureOptionVersion])
  @ManyToMany(
    () => ProductFeatureOptionVersion,
    (productFeatureOptionVersion) => productFeatureOptionVersion.orders,
    {
      nullable: false,
      cascade: true,
    },
  )
  @JoinTable()
  preferences: ProductFeatureOptionVersion[];

  @Field()
  @Column('integer', { nullable: false, default: 0 })
  @Min(0)
  additionalChargesInCents: number;

  @Field()
  @MaxLength(1200)
  @Column('text', { nullable: false, default: '' })
  additionalChargeReason: string;

  @Field()
  @Column({ nullable: false, default: false })
  isCancelled: boolean;

  @Field()
  @MaxLength(1200)
  @Column('text', { nullable: false, default: '' })
  cancellationReason: string;

  @Field({ nullable: true })
  @IsDate()
  @IsOptional()
  @Column({ nullable: true })
  cancelledAt?: Date;

  @BeforeInsert()
  setOrderNumber() {
    this.orderNumber = orderId(ORDER_ID_SEED_PHRASE).generate();
  }

  private previousIsCancelled: boolean;

  @AfterLoad()
  setPreviousIsCancelled() {
    this.previousIsCancelled = this.isCancelled;
  }

  @BeforeInsert()
  @BeforeUpdate()
  setIsCancelled() {
    if (this.isCancelled !== this.previousIsCancelled) {
      if (this.isCancelled) {
        this.cancelledAt = new Date();
      } else {
        this.cancelledAt = null;
      }
    }
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
  validateCancellation() {
    if (this.isCancelled && (!this.cancellationReason || !this.cancelledAt)) {
      throw new Error(
        'Cancellation reason and cancelled at date must be set when order is cancelled',
      );
    }

    if (!this.isCancelled && (this.cancellationReason || this.cancelledAt)) {
      throw new Error(
        'Cancellation reason and cancelled at date should not be set if order has not been cancelled',
      );
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateAdditionalCharges() {
    if (this.additionalChargesInCents > 0 && !this.additionalChargeReason) {
      throw new Error(
        'An additional charge reason is required when there are additional charges',
      );
    }

    if (this.additionalChargesInCents === 0 && this.additionalChargeReason) {
      throw new Error(
        'An additional charge reason is not required when there are no additional charges',
      );
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
      if (this.washerNotesOnPickup) {
        throw new Error(
          'Order cannot have notes on pickup if it has not been confirmed',
        );
      }
      if (this.washerNotesOnDelivery) {
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
      if (this.additionalChargesInCents > 0) {
        throw new Error(
          'Order cannot have additional charges if it has not been confirmed',
        );
      }
      if (this.additionalChargeReason) {
        throw new Error(
          'Order cannot have an additional charge reason if it has not been confirmed',
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
      if (this.washerNotesOnPickup) {
        throw new Error(
          'Order cannot have notes on pickup if it has only been confirmed',
        );
      }
      if (this.washerNotesOnDelivery) {
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
      if (!this.currencyCode) {
        throw new Error('Order must have a currency code if it is confirmed');
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
      if (this.washerNotesOnPickup) {
        throw new Error(
          "Order cannot have notes on pickup if it's washer has only been assigned",
        );
      }
      if (this.washerNotesOnDelivery) {
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
      if (!this.currencyCode) {
        throw new Error(
          "Order must have a currency code if it's washer has been assigned",
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
      if (this.washerNotesOnDelivery) {
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
      if (!this.currencyCode) {
        throw new Error(
          'Order must have a currency code if it has been picked up',
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
      if (this.washerNotesOnDelivery) {
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
      if (!this.currencyCode) {
        throw new Error(
          'Order must have a currency code if it is ready for delivery',
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
      if (this.washerNotesOnDelivery) {
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
      if (!this.currencyCode) {
        throw new Error('Order must have a currency code if it is on the way');
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
      if (!this.currencyCode) {
        throw new Error(
          'Order must have a currency code if it has been delivered',
        );
      }
    }
  }
}
