import { Test, TestingModule } from '@nestjs/testing';
import { AddressResolver } from '../address.resolver';
import { AddressService } from '../address.service';
import { AddressRepository } from '../address.repository';
import { userFactory } from 'test/factories/user.factory';
import {
  addressFactory,
  updateAddressInputFactory,
} from 'test/factories/address.factory';
import { User } from '../../users/user.entity';

describe('AddressResolver', () => {
  let resolver: AddressResolver;
  let service: AddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressResolver, AddressService, AddressRepository],
    }).compile();

    resolver = module.get<AddressResolver>(AddressResolver);
    service = module.get<AddressService>(AddressService);
  });

  describe('addAddress Mutation', () => {
    it('should allow adding address', async () => {
      const user = userFactory.buildOne();
      const address = addressFactory.buildOne({
        entityId: user.id,
        entityType: User.name,
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });
      jest.spyOn(service, 'save').mockResolvedValueOnce(address);

      const result = await resolver.addAddress(address, user);

      expect(result).toBe(address);
    });
  });

  describe('updateAddress Mutation', () => {
    it('should allow updating address', async () => {
      const user = userFactory.buildOne();
      const address = addressFactory.buildOne({
        entityId: user.id,
        entityType: User.name,
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });
      const addressInput = updateAddressInputFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });
      jest.spyOn(service, 'update').mockResolvedValueOnce(address);

      const result = await resolver.updateAddress(
        address.id,
        addressInput,
        user,
      );

      expect(result).toBe(address);
    });
  });

  describe('removeAddress Mutation', () => {
    it('should allow removing address', async () => {
      const user = userFactory.buildOne();
      const address = addressFactory.buildOne({
        entityId: user.id,
        entityType: User.name,
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });
      jest.spyOn(service, 'remove').mockResolvedValueOnce(address);

      const result = await resolver.removeAddress(address.id, user);

      expect(result).toBe(address);
    });
  });
});
