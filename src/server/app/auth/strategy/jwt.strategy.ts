import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import { UserService } from '../../users/user.service';
import jwtConfig from 'src/server/config/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private userService: UserService,
    @Inject(jwtConfig.KEY)
    private jwtConf: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConf.secret,
    });
  }

  async validate(payload: any, done: VerifiedCallback) {
    const user = await this.userService.findOneByEmail(payload.email);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}
