import { Mutation, Resolver } from '@nestjs/graphql';
import { LoginUserInput } from './inputs/login-user.input';
import { AuthService } from './auth.service';
import { RegisterUserInput } from './inputs/register-user.input';
import { UseGuards } from '@nestjs/common';
import { RegisterUserResultUnion } from './results/register-user.result';
import { LoginUserResultUnion } from './results/login-user.result';
import { Profile } from 'passport';
import { RegisterSocialInput } from './inputs/register-social.input';
import { LoginSocialInput } from './inputs/login-social.input';
import { Input } from '../graphql/args/input.args';
import { LoginSocialResultUnion } from './results/login-social.result';
import { RegisterSocialResultUnion } from './results/register-social.result';
import { SocialAuthGuard } from 'src/server/common/guards/social-auth.guard';
import { SocialProfile } from 'src/server/common/decorators/social-profile.decorator';
import { ValidateInput } from 'src/server/common/decorators/validate-input.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation((_returns) => [LoginUserResultUnion])
  async login(
    @Input() input: LoginUserInput,
  ): Promise<Array<typeof LoginUserResultUnion>> {
    const result = await this.authService.validateCredentials(
      input.email,
      input.password,
    );

    if (result.isError()) {
      return [result.value];
    }

    const authUser = await this.authService.signToken(result.value);
    return [authUser];
  }

  @ValidateInput()
  @Mutation((_returns) => [RegisterUserResultUnion])
  async register(
    @Input() input: RegisterUserInput,
  ): Promise<Array<typeof RegisterUserResultUnion>> {
    const result = await this.authService.registerUser(input);

    if (result.isError()) {
      return [result.value];
    }

    const authUser = await this.authService.signToken(result.value);
    return [authUser];
  }

  @UseGuards(SocialAuthGuard)
  @Mutation((_returns) => [LoginSocialResultUnion])
  async loginSocial(
    @SocialProfile() profile: Profile,
    @Input() input: LoginSocialInput,
  ): Promise<Array<typeof LoginSocialResultUnion>> {
    const social = await this.authService.loginSocial(profile, input.provider);

    if (social.isError()) {
      return [social.value];
    }

    const authUser = await this.authService.signToken(social.value);
    return [authUser];
  }

  @UseGuards(SocialAuthGuard)
  @Mutation((_returns) => [RegisterSocialResultUnion])
  async registerSocial(
    @SocialProfile() profile: Profile,
    @Input() input: RegisterSocialInput,
  ): Promise<Array<typeof RegisterSocialResultUnion>> {
    const social = await this.authService.registerSocial(profile, input);

    if (social.isError()) {
      return [social.value];
    }

    const authUser = await this.authService.signToken(social.value);
    return [authUser];
  }
}
