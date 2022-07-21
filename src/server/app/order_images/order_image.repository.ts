import { EntityRepository, Repository } from 'typeorm';
import { OrderImage } from './order_image.entity';

@EntityRepository(OrderImage)
export class OrderImageRepository extends Repository<OrderImage> {}
