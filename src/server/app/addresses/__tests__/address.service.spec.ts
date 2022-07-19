import { Test, TestingModule } from '@nestjs/testing';
import { PolymorphicChildInterface } from 'src/server/common/types/PolymorphicChildInterface';
import {
  addAddressInputFactory,
  addressFactory,
  updateAddressInputFactory,
} from 'test/factories/address.factory';
import { userFactory } from 'test/factories/user.factory';
import { AddressableTypes } from '../address.entity';
import { AddressRepository } from '../address.repository';
import { AddressService } from '../address.service';

describe('AddressService', () => {
  let service: AddressService;
  let addressRepository: AddressRepository;

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
        entityType: 'User',
      });
      jest.spyOn(addressRepository, 'create').mockReturnValueOnce(address);
      jest.spyOn(addressRepository, 'save').mockResolvedValueOnce(address);

      const result = await service.save(address, user);

      expect(result).toBe(address);
    });
  });

  describe('update', () => {
    it('should update address', async () => {
      const user = userFactory.buildOne();
      const entity: PolymorphicChildInterface<AddressableTypes> = {
        entityId: user.id,
        entityType: 'User',
      };
      const address = addressFactory.buildOne({
        ...entity,
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });
      const addressData = updateAddressInputFactory.buildOne({
        instructions: 'MEET_AT_DOOR',
        type: 'DELIVERY',
      });
      const updatedAddress = addressFactory.buildOne({
        ...addressData,
        ...entity,
        id: address.id,
      });
      jest
        .spyOn(addressRepository, 'save')
        .mockResolvedValueOnce(updatedAddress);
      jest
        .spyOn(addressRepository, 'findOneOrError')
        .mockResolvedValueOnce(address);

      const result = await service.update(address.id, addressData, entity);
      expect(result).toBe(updatedAddress);
    });
  });

  describe('remove', () => {
    it('should remove address', async () => {
      const user = userFactory.buildOne();
      const address = addressFactory.buildOne({
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
        entityId: user.id,
        entityType: 'User',
      });
      jest
        .spyOn(addressRepository, 'findOneOrError')
        .mockResolvedValueOnce(address);
      jest.spyOn(addressRepository, 'remove').mockResolvedValueOnce(address);

      const result = await service.remove(address.id, {
        entityId: user.id,
        entityType: 'User',
      });

      expect(result).toBe(address);
    });
  });
});
