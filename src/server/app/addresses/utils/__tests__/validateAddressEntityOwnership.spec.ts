import { PolymorphicChildInterface } from 'src/server/common/types/PolymorphicChildInterface';
import { addressFactory } from 'test/factories/address.factory';
import { userFactory } from 'test/factories/user.factory';
import { AddressableTypes } from '../../address.entity';
import validateAddressEntityOwnership from '../validateAddressEntityOwnership';

describe('validateAddressEntityOwnership', () => {
  describe('validateAddressEntityOwnership', () => {
    it('should throw error if address does not match entity id', () => {
      const user = userFactory.buildOne();
      const entity: PolymorphicChildInterface<AddressableTypes> = {
        entityId: user.id,
        entityType: 'User',
      };
      const address = addressFactory.buildOne({
        entityType: 'User',
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });

      const result = () => {
        validateAddressEntityOwnership(address, entity);
      };
      expect(result).toThrow(
        `Unauthorized: Address does not belong to ${entity.entityType} with id ${entity.entityId}`,
      );
    });

    it('should throw error if address does not match entity type', () => {
      const user = userFactory.buildOne();
      const entity: PolymorphicChildInterface<AddressableTypes> = {
        entityId: user.id,
        entityType: 'User',
      };
      const address = addressFactory.buildOne({
        entityId: user.id,
        entityType: 'RandomEntityType' as AddressableTypes,
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });

      const result = () => {
        validateAddressEntityOwnership(address, entity);
      };
      expect(result).toThrow(
        `Unauthorized: Address does not belong to ${entity.entityType} with id ${entity.entityId}`,
      );
    });

    it('should not throw error if address matches entity', () => {
      const user = userFactory.buildOne();
      const entity: PolymorphicChildInterface<AddressableTypes> = {
        entityId: user.id,
        entityType: 'User',
      };
      const address = addressFactory.buildOne({
        ...entity,
        instructions: 'LEAVE_AT_DOOR',
        type: 'PICKUP',
      });

      const result = () => {
        validateAddressEntityOwnership(address, entity);
      };
      expect(result).not.toThrow();
    });
  });
});
