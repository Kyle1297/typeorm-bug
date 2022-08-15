import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/server/common/guards/jwt_auth.guard';
import { Request as Req, Response as Res } from 'express';
import { OrderService } from '../orders/order.service';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly orderService: OrderService,
  ) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async createPayment(
    @Response() response: Res,
    @Request() request: Req,
    @Body() orderId: string,
  ) {
    const { user } = request;
    try {
      const order = await this.orderService.findOne(orderId, user.id);
      const paymentIntent = await this.paymentService.createPaymentIntent(
        order,
        user,
      );
      const emphermalKey = await this.paymentService.createEphemeralKey(
        user.stripeCustomerId,
      );
      this.orderService.update(order.id, {
        stripePaymentIntentId: paymentIntent.id,
      });

      response.status(HttpStatus.CREATED).json({
        paymentIntent: paymentIntent.client_secret,
        emphermalKey: emphermalKey.secret,
        customer: user.stripeCustomerId,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
      });
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Post('/payment-methods/create')
  @UseGuards(JwtAuthGuard)
  async createSetupIntent(@Response() response: Res, @Request() request: Req) {
    const { user } = request;
    try {
      const setupIntent = await this.paymentService.createSetupIntent(user);
      response.status(HttpStatus.OK).json({
        clientSecret: setupIntent.client_secret,
      });
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @Get('/payment-methods')
  @UseGuards(JwtAuthGuard)
  async retrieveAllPaymentMethods(
    @Response() response: Res,
    @Request() request: Req,
  ) {
    const { user } = request;
    try {
      const paymentMethods =
        await this.paymentService.retrieveAllPaymentMethods(user);
      response.status(HttpStatus.OK).json(paymentMethods);
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }
}
