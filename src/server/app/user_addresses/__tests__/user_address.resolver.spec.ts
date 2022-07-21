import { Test, TestingModule } from '@nestjs/testing';
import { UserAddressResolver } from '../user_address.resolver';
import { UserAddressService } from '../user_address.service';
import { UserAddressRepository } from '../user_address.repository';
import { userFactory } from 'test/factories/user.factory';
import {
  userAddressFactory,
  updateUserAddressInputFactory,
  addUserAddressInputFactory,
} from 'test/factories/address.factory';

describe('UserAddressResolver', () => {
  let resolver: UserAddressResolver;
  let service: UserAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserAddressResolver,
        UserAddressService,
        UserAddressRepository,
      ],
    }).compile();

    resolver = module.get<UserAddressResolver>(UserAddressResolver);
    service = module.get<UserAddressService>(UserAddressService);
  });

  describe('addUserAddress Mutation', () => {
    it('should allow adding userAddress', async () => {
      const user = userFactory.buildOne();
      const addUserAddress = addUserAddressInputFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        ...addUserAddress,
        user,
      });
      jest.spyOn(service, 'save').mockResolvedValueOnce(userAddress);

      const result = await resolver.addUserAddress(addUserAddress, user);

      expect(result).toBe(userAddress);
    });
  });

  describe('updateUserAddress Mutation', () => {
    it('should allow updating userAddress', async () => {
      const user = userFactory.buildOne();
      const userAddressInput = updateUserAddressInputFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        ...userAddressInput,
        user,
      });
      jest.spyOn(service, 'update').mockResolvedValueOnce(userAddress);

      const result = await resolver.updateUserAddress(
        userAddress.id,
        userAddressInput,
        user,
      );

      expect(result).toBe(userAddress);
    });
  });

  describe('removeUserAddress Mutation', () => {
    it('should allow removing userAddress', async () => {
      const user = userFactory.buildOne();
      const userAddress = userAddressFactory.buildOne({
        user,
      });
      jest.spyOn(service, 'remove').mockResolvedValueOnce(userAddress);

      const result = await resolver.removeUserAddress(userAddress.id, user);

      expect(result).toBe(userAddress);
    });
  });
});
