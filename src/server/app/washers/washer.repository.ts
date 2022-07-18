import { EntityRepository, Repository } from 'typeorm';
import { Washer } from './washer.entity';

@EntityRepository(Washer)
export class WasherRepository extends Repository<Washer> {}
