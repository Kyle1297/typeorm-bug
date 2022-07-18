import { Injectable } from '@nestjs/common';
import { WasherRepository } from './washer.repository';

@Injectable()
export class WasherService {
  constructor(private readonly washerRepository: WasherRepository) {}
}
