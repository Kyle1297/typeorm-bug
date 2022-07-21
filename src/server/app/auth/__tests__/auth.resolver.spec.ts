import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../auth.resolver';
import { AuthService } from '../auth.service';
import { JwtModule } from '@nestjs/jwt';
import { CredentialsTakenError } from '../responses/credentials_taken.error';
import { AuthUserResponse } from '../responses/auth_user.response';
import { InvalidCredentialsError } from '../responses/invalid_credentials.error';
import { SocialProviderRepository } from '../auth.repository';
import { SocialNotRegisteredError } from '../responses/social_not_registered.error';
import { SocialAlreadyAssignedError } from '../responses/social_already_assigned.error';
import { UserService } from '../../users/user.service';
import { UserRepository } from '../../users/user.repository';
import { either } from 'src/server/common/utils/either';
import {
  loginUserInputFactory,
  registerUserInputFactory,
  userFactory,
} from 'test/factories/user.factory';
import {
  loginSocialInputFactory,
  registerSocialInputFactory,
  socialProfileFactory,
} from 'test/factories/auth.factory';

describe('AuthResolver', () => {
  let authResolver: AuthResolver;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'secret' })],
      providers: [
        AuthResolver,
        AuthService,
        UserService,
        UserRepository,
        SocialProviderRepository,
      ],
    }).compile();

    authResolver = module.get(AuthResolver);
    authService = module.get(AuthService);
  });

  describe('login', () => {
    it('should login user correctly', async () => {
      const loginUserInput = loginUserInputFactory.buildOne();
      const user = userFactory.buildOne(loginUserInput);
      jest
        .spyOn(authService, 'validateCredentials')
        .mockResolvedValueOnce(either.of(user));

      const [result] = (await authResolver.login(loginUserInput)) as [
        AuthUserResponse,
      ];

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result.user).toEqual(user);
      expect(result.token).toBeTruthy();
    });

    it('should return correct result if incorrect credentials are provided', async () => {
      const loginUserInput = loginUserInputFactory.buildOne();
      jest.spyOn(authService, 'validateCredentials').mockResolvedValueOnce(
        either.error(
          new InvalidCredentialsError({
            providedEmail: loginUserInput.email,
          }),
        ),
      );

      const [result] = (await authResolver.login(loginUserInput)) as [
        InvalidCredentialsError,
      ];

      expect(result).toBeInstanceOf(InvalidCredentialsError);
      expect(result.providedEmail).toBe(loginUserInput.email);
    });
  });

  describe('register', () => {
    it('should register user correctly', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      const user = userFactory.buildOne(registerUserInput);

      jest
        .spyOn(authService, 'registerUser')
        .mockResolvedValueOnce(either.of(user));

      const [result] = (await authResolver.register(registerUserInput)) as [
        AuthUserResponse,
      ];

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result.user).toEqual(user);
    });

    it('should return responses with error if credentials are taken', async () => {
      const registerUserInput = registerUserInputFactory.buildOne();
      jest.spyOn(authService, 'registerUser').mockResolvedValueOnce(
        either.error(
          new CredentialsTakenError({
            providedEmail: registerUserInput.email,
          }),
        ),
      );

      const [result] = (await authResolver.register(registerUserInput)) as [
        CredentialsTakenError,
      ];

      expect(result).toBeInstanceOf(CredentialsTakenError);
      expect(result.providedEmail).toBe(registerUserInput.email);
    });
  });

  describe('loginSocial', () => {
    const loginSocialInput = loginSocialInputFactory.buildOne();
    const profile = socialProfileFactory.buildOne();
    it('should login social user correctly', async () => {
      const user = userFactory.buildOne();
      jest
        .spyOn(authService, 'loginSocial')
        .mockResolvedValueOnce(either.of(user));

      const [result] = (await authResolver.loginSocial(
        profile,
        loginSocialInput,
      )) as [AuthUserResponse];

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result.user).toEqual(user);
      expect(result.token).toBeTruthy();
    });

    it('should handle SocialNotRegistered errors correctly', async () => {
      jest.spyOn(authService, 'loginSocial').mockResolvedValueOnce(
        either.error(
          new SocialNotRegisteredError({
            provider: loginSocialInput.provider,
          }),
        ),
      );

      const [result] = (await authResolver.loginSocial(
        profile,
        loginSocialInput,
      )) as [SocialNotRegisteredError];

      expect(result).toBeInstanceOf(SocialNotRegisteredError);
      expect(result.provider).toBe(loginSocialInput.provider);
    });
  });

  describe('registerSocial', () => {
    const registerSocialInput = registerSocialInputFactory.buildOne();
    const profile = socialProfileFactory.buildOne();

    it('should register social user correctly', async () => {
      const user = userFactory.buildOne();
      jest
        .spyOn(authService, 'registerSocial')
        .mockResolvedValueOnce(either.of(user));

      const [result] = (await authResolver.registerSocial(
        profile,
        registerSocialInput,
      )) as [AuthUserResponse];

      expect(result).toBeInstanceOf(AuthUserResponse);
      expect(result.user).toBe(user);
      expect(result.token).toBeTruthy();
    });

    it('should handle CredentialsTaken errors correctly', async () => {
      jest.spyOn(authService, 'registerSocial').mockResolvedValueOnce(
        either.error(
          new CredentialsTakenError({
            providedEmail: profile.emails[0].value,
          }),
        ),
      );

      const [result] = (await authResolver.registerSocial(
        profile,
        registerSocialInput,
      )) as [CredentialsTakenError];

      expect(result).toBeInstanceOf(CredentialsTakenError);
      expect(result.providedEmail).toBe(profile.emails[0].value);
    });

    it('should handle SocialAlreadyAssigned errors correctly', async () => {
      jest.spyOn(authService, 'registerSocial').mockResolvedValueOnce(
        either.error(
          new SocialAlreadyAssignedError({
            provider: registerSocialInput.provider,
          }),
        ),
      );

      const [result] = (await authResolver.registerSocial(
        profile,
        registerSocialInput,
      )) as [SocialAlreadyAssignedError];

      expect(result).toBeInstanceOf(SocialAlreadyAssignedError);
      expect(result.provider).toBe(registerSocialInput.provider);
    });
  });
});
