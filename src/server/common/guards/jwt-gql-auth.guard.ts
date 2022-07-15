import { Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class JwtGqlAuthGuard extends JwtAuthGuard {
  getRequest(context: GqlExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

@Injectable()
export class OptionalJwtGqlAuthGuard extends JwtGqlAuthGuard {
  handleRequest(err: any, user: any) {
    return user;
  }
}
