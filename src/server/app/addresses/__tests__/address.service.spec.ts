import { Test, TestingModule } from '@nestjs/testing';
import {
  addAddressInputFactory,
  addressFactory,
} from 'test/factories/address.factory';
import { userFactory } from 'test/factories/user.factory';
import { Repository } from 'typeorm';
import { User } from '../../users/user.entity';
import { Address } from '../address.entity';
import { AddressRepository } from '../address.repository';
import { AddressService } from '../address.service';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: Repository<Address>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressService, AddressRepository],
    }).compile();

    service = module.get<AddressService>(AddressService);
    addressRepository = module.get<AddressRepository>(AddressRepository);
  });

  describe('save', () => {
    it('should save address', async () => {
      const user = userFactory.buildOne();
      const addAddressInput = addAddressInputFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });
      const address = addressFactory.buildOne({
        ...addAddressInput,
        entityId: user.id,
        entityType: User.name,
      });
      jest.spyOn(addressRepository, 'create').mockReturnValueOnce(address);
      jest.spyOn(addressRepository, 'save').mockResolvedValueOnce(address);

      const result = await service.save(address, user);

      expect(result).toBe(address);
    });
  });

  describe('remove', () => {
    it('should remove address', async () => {
      const user = userFactory.buildOne();
      const address = addressFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
        entityId: user.id,
        entityType: User.name,
      });
      jest
        .spyOn(addressRepository, 'findOneOrFail')
        .mockResolvedValueOnce(address);
      jest.spyOn(addressRepository, 'remove').mockResolvedValueOnce(address);

      const result = await service.remove(address.id, {
        entityId: user.id,
        entityType: User.name,
      });

      expect(result).toBe(address);
    });
  });
});
