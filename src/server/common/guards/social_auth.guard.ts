import { GqlExecutionContext } from '@nestjs/graphql';
import { CustomAuthGuard } from './custom_auth.guard';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SocialAuthGuard extends CustomAuthGuard() {
  getRequest(context: GqlExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    const { input } = ctx.getArgs();

    req.body = {
      ...req.body,
      access_token: input.accessToken,
      provider: input.provider,
    };
    return req;
  }
}
