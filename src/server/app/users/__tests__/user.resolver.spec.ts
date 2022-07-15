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

  describe('users', () => {
    it('should return an array of users', async () => {
      const expected = userFactory.buildMany(3);
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(expected);

      const result = await resolver.users();

      expect(result).toBe(expected);
    });
  });

  describe('user', () => {
    it('should return given user with given email', async () => {
      const expected = userFactory.buildOne();
      jest.spyOn(service, 'findOneByEmail').mockResolvedValueOnce(expected);

      const result = await resolver.user(expected.email);

      expect(result).toBe(expected);
    });
  });

  describe('removeUser', () => {
    it('should removeUser', async () => {
      const expected = userFactory.buildOne();
      jest.spyOn(service, 'remove').mockResolvedValueOnce(expected);

      const result = await resolver.removeUser(expected.id);

      expect(result).toBe(expected);
    });
  });
});
