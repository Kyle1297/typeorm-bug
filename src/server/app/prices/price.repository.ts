import { EntityRepository, Repository } from 'typeorm';
import { Price } from './price.entity';

@EntityRepository(Price)
export class PriceRepository extends Repository<Price> {}
