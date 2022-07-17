import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-token';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Profile } from 'passport';
import { VerifiedCallback } from 'passport-jwt';
import googleConfig from 'src/server/config/google.config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleConfig.KEY)
    private googleConf: ConfigType<typeof googleConfig>,
  ) {
    super({
      clientID: googleConf.clientID,
      clientSecret: googleConf.clientSecret,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifiedCallback,
  ) {
    if (!profile) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, profile);
  }
}
