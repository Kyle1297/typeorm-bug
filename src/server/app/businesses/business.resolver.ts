import { Resolver } from '@nestjs/graphql';

import { BusinessService } from './business.service';

@Resolver()
export class BusinessResolver {
  constructor(private readonly businessService: BusinessService) {}
}
