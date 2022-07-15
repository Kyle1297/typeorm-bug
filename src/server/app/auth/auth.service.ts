import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthUserResponse } from './responses/auth-user.response';
import { RegisterUserInput } from './inputs/register-user.input';
import { Profile } from 'passport';
import { SocialProviderTypes } from './auth.entity';
import { SocialProviderRepository } from './auth.repository';
import { CredentialsTakenError } from './responses/credentials-taken.error';
import { InvalidCredentialsError } from './responses/invalid-credentials.error';
import { SocialAlreadyAssignedError } from './responses/social-already-assigned.error';
import { SocialNotRegisteredError } from './responses/social-not-registered.error';
import { UserService } from '../users/user.service';
import { User } from '../users/user.entity';
import { either, Either } from 'src/server/common/utils/either';
import { RegisterSocialInput } from './inputs/register-social.input';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly socialProviderRepository: SocialProviderRepository,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Either<InvalidCredentialsError, User>> {
    const user = await this.userService.findOneByEmail(email);
    if (!(await user?.comparePassword(password))) {
      return either.error(
        new InvalidCredentialsError({
          providedEmail: email,
        }),
      );
    }
    return either.of(user);
  }

  async signToken(user: User): Promise<AuthUserResponse> {
    const payload = { username: user.email, sub: user.id };
    return new AuthUserResponse({
      user,
      token: this.jwtService.sign(payload),
    });
  }

  async registerUser(
    user: RegisterUserInput,
  ): Promise<Either<CredentialsTakenError, User>> {
    if (await this.userService.existsByCredentials(user)) {
      return either.error(
        new CredentialsTakenError({
          providedEmail: user.email,
        }),
      );
    }
    const returnedUser = await this.userService.save(user);
    return either.of(returnedUser);
  }

  async loginSocial(
    profile: Profile,
    provider: SocialProviderTypes,
  ): Promise<Either<SocialNotRegisteredError, User>> {
    const user = await this.userService.findOneBySocialId(profile.id);

    if (!user) {
      return either.error(
        new SocialNotRegisteredError({
          provider,
        }),
      );
    }

    return either.of(user);
  }

  async registerSocial(profile: Profile, input: RegisterSocialInput) {
    const email = profile.emails?.[0].value;
    const socialId = profile.id;
    const { provider, phoneCountryCode, phoneNumber } = input;

    if (await this.socialProviderRepository.existsBySocialId(socialId)) {
      return either.error(
        new SocialAlreadyAssignedError({
          provider,
        }),
      );
    }

    if (
      await this.userService.existsByCredentials({
        email,
      })
    ) {
      return either.error(
        new CredentialsTakenError({
          providedEmail: email,
        }),
      );
    }

    const user = await this.socialProviderRepository.saveProviderAndUser(
      {
        email,
        phoneCountryCode,
        phoneNumber,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
      },
      { provider, socialId },
    );

    return either.of(user);
  }
}
