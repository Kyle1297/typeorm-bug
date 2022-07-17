import { Test, TestingModule } from '@nestjs/testing';
import { AddressResolver } from '../address.resolver';
import { AddressService } from '../address.service';
import { AddressRepository } from '../address.repository';
import { userFactory } from 'test/factories/user.factory';
import { addressFactory } from 'test/factories/address.factory';

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
        entityType: user.constructor.name,
      });
      jest.spyOn(service, 'save').mockResolvedValueOnce(address);

      const result = await resolver.addAddress(address, user);

      expect(result).toBe(address);
    });
  });
});
