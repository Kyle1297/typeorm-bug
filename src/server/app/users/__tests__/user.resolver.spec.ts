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
});
