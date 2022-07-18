import { PolymorphicChildInterface } from 'src/server/common/types/PolymorphicChildInterface';
import { Address } from '../address.entity';

const validateAddressEntityOwnership = (
  address: Address,
  entity: PolymorphicChildInterface,
): Error | void => {
  if (
    address.entityType !== entity.entityType ||
    address.entityId !== entity.entityId
  ) {
    throw new Error(
      `Unauthorized: Address does not belong to ${entity.entityType} with id ${entity.entityId}`,
    );
  }
};

export default validateAddressEntityOwnership;
