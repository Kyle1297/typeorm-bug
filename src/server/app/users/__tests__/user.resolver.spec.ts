import { Test, TestingModule } from '@nestjs/testing';
import { userFactory } from 'test/factories/user.factory';
import { UserRepository } from '../user.repository';
import { UserResolver } from '../user.resolver';
import { UserService } from '../user.service';

describe('UserResolver', () => {
  let resolver: UserResolver;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserResolver, UserService, UserRepository],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);
  });

  describe('currentUser', () => {
    it('should retrieve current user', async () => {
      const expected = userFactory.buildOne();
      const result = await resolver.currentUser(expected);

      expect(result).toBe(expected);
    });
  });

  describe('removeCurrentUser', () => {
    it('should remove current user', async () => {
      const expected = userFactory.buildOne();
      jest.spyOn(service, 'remove').mockResolvedValueOnce(expected);

      const result = await resolver.removeCurrentUser(expected);

      expect(result).toBe(expected);
    });
  });

  describe('updateCurrentUserName', () => {
    it('should update current user name', async () => {
      const user = userFactory.buildOne();
      const updatedUser = userFactory.buildOne({
        ...user,
        firstName: 'John',
        lastName: 'Doe',
      });
      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedUser);

      const result = await resolver.updateCurrentUserName(user, {
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(result).toBe(updatedUser);
    });
  });

  describe('updateCurrentUserPhone', () => {
    it('should update current user phone', async () => {
      const user = userFactory.buildOne();
      const updatedUser = userFactory.buildOne({
        ...user,
        phoneCountryCode: '+1',
        phoneNumber: '555-555-5555',
      });
      jest.spyOn(service, 'update').mockResolvedValueOnce(updatedUser);

      const result = await resolver.updateCurrentUserPhone(user, {
        phoneCountryCode: '+1',
        phoneNumber: '555-555-5555',
      });

      expect(result).toBe(updatedUser);
    });
  });
});
