import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { SocialProviderRepository } from '../auth.repository';
import { CredentialsTakenError } from '../responses/credentials_taken.error';
import { SocialAlreadyAssignedError } from '../responses/social_already_assigned.error';
import { UserService } from '../../users/user.service';
import { UserRepository } from '../../users/user.repository';
import {
  registerUserInputFactory,
  userFactory,
} from 'test/factories/user.factory';
import {
  registerSocialInputFactory,
  socialProfileFactory,
} from 'test/factories/auth.factory';

describe.only('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let socialProviderRepository: SocialProviderRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [
        AuthService,
        UserService,
        UserRepository,
        SocialProviderRepository,
      ],
    }).compile();

    authService = module.get(AuthService);
    userService = module.get(UserService);
    socialProviderRepository = module.get(SocialProviderRepository);
  });

  describe('validateCredentials', () => {
    it('should return correct values if user with similar password exists', async () => {
      const user = userFactory.buildOne();
      const originalPassword = user.password;
      await user.hashPassword();
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(user);

      const response = await authService.validateCredentials(
        user.email,
        originalPassword,
      );

      expect(response.value).toBe(user);
    });

    it('should return error, if passwords are not equal', async () => {
      const user = userFactory.buildOne();
      jest.spyOn(userService, 'findOneByEmail').mockResolvedValueOnce(user);

      const response = await authService.validateCredentials(
        user.email,
        user.password,
      );

      const error = response.errorsIfPresent() as CredentialsTakenError;
      expect(error.providedEmail).toBe(user.email);
    });
  });

  describe('signToken', () => {
    it('should generate auth token', async () => {
      const user = userFactory.buildOne();

      const response = await authService.signToken(user);

      expect(response.token).toBeTruthy();
    });
  });

  describe('registerUser', () => {
    it('should save user', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      const user = userFactory.buildOne(registerUserInput);
      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(false);
      jest.spyOn(userService, 'save').mockResolvedValueOnce(user);

      const response = await authService.registerUser(registerUserInput);

      expect(response.value.email).toBe(registerUserInput.email);
    });

    it('should return error, if credentials are already taken', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();

      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(true);

      const response = await authService.registerUser(registerUserInput);

      expect(response.errorsIfPresent()?.providedEmail).toBe(
        registerUserInput.email,
      );
    });
  });

  describe('loginSocial', () => {
    const provider = 'facebook';

    it('should return found user', async () => {
      const profile = socialProfileFactory.buildOne();
      const user = userFactory.buildOne();
      jest.spyOn(userService, 'findOneBySocialId').mockResolvedValueOnce(user);

      const result = await authService.loginSocial(profile, provider);

      expect(result.resultIfPresent()).toBe(user);
    });
    it('should return error if user is not found', async () => {
      const profile = socialProfileFactory.buildOne();
      jest
        .spyOn(userService, 'findOneBySocialId')
        .mockResolvedValueOnce(undefined);

      const result = await authService.loginSocial(profile, provider);

      expect(result.errorsIfPresent()?.provider).toBe(provider);
    });
  });

  describe('registerSocial', () => {
    const profile = socialProfileFactory.buildOne();
    const registerSocialInput = registerSocialInputFactory.buildOne();
    const user = userFactory.buildOne({
      phoneCountryCode: registerSocialInput.phoneCountryCode,
      phoneNumber: registerSocialInput.phoneNumber,
    });

    it('should parse profile correctly and save user with provider ', async () => {
      jest
        .spyOn(socialProviderRepository, 'existsBySocialId')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(socialProviderRepository, 'saveProviderAndUser')
        .mockResolvedValueOnce(user);

      const result = await authService.registerSocial(
        profile,
        registerSocialInput,
      );

      expect(result.resultIfPresent()).toBe(user);
    });

    it('should return error if given social id is already assigned', async () => {
      jest
        .spyOn(socialProviderRepository, 'existsBySocialId')
        .mockResolvedValueOnce(true);

      const result = await authService.registerSocial(
        profile,
        registerSocialInput,
      );

      const error = result.errorsIfPresent() as SocialAlreadyAssignedError;
      expect(error).toBeInstanceOf(SocialAlreadyAssignedError);
      expect(error.provider).toBe(registerSocialInput.provider);
    });
    it('should return error if credentials are already taken', async () => {
      jest
        .spyOn(socialProviderRepository, 'existsBySocialId')
        .mockResolvedValueOnce(false);
      jest
        .spyOn(userService, 'existsByCredentials')
        .mockResolvedValueOnce(true);

      const result = await authService.registerSocial(
        profile,
        registerSocialInput,
      );

      const error = result.errorsIfPresent() as CredentialsTakenError;
      expect(error).toBeInstanceOf(CredentialsTakenError);
      expect(error.providedEmail).toBe(profile.emails?.[0].value);
    });
  });
});
