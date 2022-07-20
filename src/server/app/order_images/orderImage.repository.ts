import { EntityRepository, Repository } from 'typeorm';
import { OrderImage } from './orderImage.entity';

@EntityRepository(OrderImage)
export class OrderImageRepository extends Repository<OrderImage> {}
