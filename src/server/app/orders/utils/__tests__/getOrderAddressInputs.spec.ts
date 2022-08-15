import { userAddressFactory } from 'test/factories/address.factory';
import { getOrderAddressInputs } from '../getOrderAddressInputs';

describe('getOrderAddressInputs', () => {
  it('should return order address inputs', async () => {
    const pickupAddress = userAddressFactory.buildOne();
    const deliveryAddress = userAddressFactory.buildOne();

    const result = getOrderAddressInputs(pickupAddress, deliveryAddress);

    expect(result).toEqual({
      pickupOrderAddressInput: {
        line1: pickupAddress.line1,
        line2: pickupAddress.line2,
        locality: pickupAddress.locality,
        administrativeArea: pickupAddress.administrativeArea,
        postalCode: pickupAddress.postalCode,
        countryCode: pickupAddress.countryCode,
        organisationName: pickupAddress.organisationName,
        instructions: pickupAddress.instructions,
        additionalNotes: pickupAddress.additionalNotes,
      },
      deliveryOrderAddressInput: {
        line1: deliveryAddress.line1,
        line2: deliveryAddress.line2,
        locality: deliveryAddress.locality,
        administrativeArea: deliveryAddress.administrativeArea,
        postalCode: deliveryAddress.postalCode,
        countryCode: deliveryAddress.countryCode,
        organisationName: deliveryAddress.organisationName,
        instructions: deliveryAddress.instructions,
        additionalNotes: deliveryAddress.additionalNotes,
      },
    });
  });

  it('should throw error if pickup address is not provided', async () => {
    const deliveryAddress = userAddressFactory.buildOne();

    await expect(getOrderAddressInputs(null, deliveryAddress)).rejects.toThrow(
      'Pickup and delivery addresses are required',
    );
  });

  it('should throw error if delivery address is not provided', async () => {
    const pickupAddress = userAddressFactory.buildOne();

    await expect(getOrderAddressInputs(pickupAddress, null)).rejects.toThrow(
      'Pickup and delivery addresses are required',
    );
  });

  it('should throw error if both pickup and delivery addresses are not provided', async () => {
    await expect(getOrderAddressInputs(null, null)).rejects.toThrow(
      'Pickup and delivery addresses are required',
    );
  });
});
