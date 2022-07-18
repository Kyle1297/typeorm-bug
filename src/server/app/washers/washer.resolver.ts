import { Resolver } from '@nestjs/graphql';

import { WasherService } from './washer.service';

@Resolver()
export class WasherResolver {
  constructor(private readonly washerService: WasherService) {}
}
