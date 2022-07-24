import { Test, TestingModule } from '@nestjs/testing';
import {
  orderAddressFactory,
  updateOrderAddressInputFactory,
} from 'test/factories/address.factory';
import { OrderAddressRepository } from '../order_address.repository';
import { OrderAddressService } from '../order_address.service';

describe('OrderAddressService', () => {
  let service: OrderAddressService;
  let orderAddressRepository: OrderAddressRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderAddressService, OrderAddressRepository],
    }).compile();

    service = module.get<OrderAddressService>(OrderAddressService);
    orderAddressRepository = module.get<OrderAddressRepository>(
      OrderAddressRepository,
    );
  });

  describe('update', () => {
    it('should update orderAddress', async () => {
      const orderAddress = orderAddressFactory.buildOne();
      const orderAddressData = updateOrderAddressInputFactory.buildOne();

      const updatedOrderAddress = orderAddressFactory.buildOne({
        ...orderAddress,
        ...orderAddressData,
      });
      jest
        .spyOn(orderAddressRepository, 'save')
        .mockResolvedValueOnce(updatedOrderAddress);
      jest
        .spyOn(orderAddressRepository, 'findOneOrError')
        .mockResolvedValueOnce(orderAddress);

      const result = await service.update(orderAddress.id, orderAddressData);
      expect(result).toBe(updatedOrderAddress);
    });
  });
});
