import { userAddressFactory } from 'test/factories/address.factory';
import * as faker from 'faker';
import { compareUserAddresses } from '../compareUserAddresses';

describe('compareUserAddresses', () => {
  it('should return true if addresses are the same', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = userAddressFactory.buildOne({
      line1: address1.line1,
      line2: address1.line2,
      locality: address1.locality,
      administrativeArea: address1.administrativeArea,
      countryCode: address1.countryCode,
      postalCode: address1.postalCode,
    });

    expect(compareUserAddresses(address1, address2)).toBe(true);
  });

  it('should return false if addresses are different', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = userAddressFactory.buildOne({
      line1: faker.address.streetAddress(),
      line2: faker.address.secondaryAddress(),
      locality: faker.address.city(),
      administrativeArea: faker.address.state(),
      postalCode: faker.address.zipCode(),
      countryCode: faker.address.countryCode(),
    });

    expect(compareUserAddresses(address1, address2)).toBe(false);
  });

  it('should return error if one address is null', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = null;

    expect(() => compareUserAddresses(address1, address2)).toThrowError(
      'One or both addresses are null or undefined',
    );
  });

  it('should return error if one address is undefined', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = undefined;

    expect(() => compareUserAddresses(address1, address2)).toThrowError(
      'One or both addresses are null or undefined',
    );
  });

  it('should return error if both addresses are null', () => {
    const address1 = null;
    const address2 = null;

    expect(() => compareUserAddresses(address1, address2)).toThrowError(
      'One or both addresses are null or undefined',
    );
  });

  it('should return error if both addresses are undefined', () => {
    const address1 = undefined;
    const address2 = undefined;

    expect(() => compareUserAddresses(address1, address2)).toThrowError(
      'One or both addresses are null or undefined',
    );
  });

  it('should return true if line1 matches', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = userAddressFactory.buildOne({ line1: address1.line1 });

    expect(compareUserAddresses(address1, address2)).toBe(true);
  });

  it('should return true if line2 matches', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = userAddressFactory.buildOne({ line2: address1.line2 });

    expect(compareUserAddresses(address1, address2)).toBe(true);
  });

  it('should return true if locality matches', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = userAddressFactory.buildOne({
      locality: address1.locality,
    });

    expect(compareUserAddresses(address1, address2)).toBe(true);
  });

  it('should return true if administrativeArea matches', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = userAddressFactory.buildOne({
      administrativeArea: address1.administrativeArea,
    });

    expect(compareUserAddresses(address1, address2)).toBe(true);
  });

  it('should return true if countryCode matches', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = userAddressFactory.buildOne({
      countryCode: address1.countryCode,
    });

    expect(compareUserAddresses(address1, address2)).toBe(true);
  });

  it('should return true if postalCode matches', () => {
    const address1 = userAddressFactory.buildOne();
    const address2 = userAddressFactory.buildOne({
      postalCode: address1.postalCode,
    });

    expect(compareUserAddresses(address1, address2)).toBe(true);
  });
});
