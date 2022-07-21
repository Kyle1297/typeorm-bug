import { Test, TestingModule } from '@nestjs/testing';
import {
  addUserAddressInputFactory,
  userAddressFactory,
  updateUserAddressInputFactory,
} from 'test/factories/address.factory';
import { userFactory } from 'test/factories/user.factory';
import { UserAddressRepository } from '../user_address.repository';
import { UserAddressService } from '../user_address.service';

describe('UserAddressService', () => {
  let service: UserAddressService;
  let userAddressRepository: UserAddressRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserAddressService, UserAddressRepository],
    }).compile();

    service = module.get<UserAddressService>(UserAddressService);
    userAddressRepository = module.get<UserAddressRepository>(
      UserAddressRepository,
    );
  });

  describe('save', () => {
    it('should save userAddress', async () => {
      const user = userFactory.buildOne();
      const addUserAddressInput = addUserAddressInputFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        ...addUserAddressInput,
        user,
      });
      jest
        .spyOn(userAddressRepository, 'create')
        .mockReturnValueOnce(userAddress);
      jest
        .spyOn(userAddressRepository, 'save')
        .mockResolvedValueOnce(userAddress);

      const result = await service.save(userAddress, user);

      expect(result).toBe(userAddress);
    });
  });

  describe('update', () => {
    it('should update userAddress', async () => {
      const user = userFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        user,
      });
      const userAddressData = updateUserAddressInputFactory.buildOne();
      const updatedUserAddress = userAddressFactory.buildOne({
        ...userAddress,
        ...userAddressData,
      });
      jest
        .spyOn(userAddressRepository, 'save')
        .mockResolvedValueOnce(updatedUserAddress);
      jest
        .spyOn(userAddressRepository, 'findOneOrError')
        .mockResolvedValueOnce(userAddress);

      const result = await service.update(
        userAddress.id,
        userAddressData,
        user,
      );
      expect(result).toBe(updatedUserAddress);
    });
  });

  describe('remove', () => {
    it('should remove userAddress', async () => {
      const user = userFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        user,
      });
      jest
        .spyOn(userAddressRepository, 'findOneOrError')
        .mockResolvedValueOnce(userAddress);
      jest
        .spyOn(userAddressRepository, 'remove')
        .mockResolvedValueOnce(userAddress);

      const result = await service.remove(userAddress.id, user);

      expect(result).toBe(userAddress);
    });
  });
});
