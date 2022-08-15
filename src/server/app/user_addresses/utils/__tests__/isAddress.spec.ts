import { isDeliveryAddress, isPickupAddress } from '../isAddress';

describe('isPickupAddress', () => {
  it('returns true for PICKUP', () => {
    expect(isPickupAddress('PICKUP')).toBe(true);
  });

  it('returns true for PICKUP_AND_DELIVERY', () => {
    expect(isPickupAddress('PICKUP_AND_DELIVERY')).toBe(true);
  });

  it('returns false for DELIVERY', () => {
    expect(isPickupAddress('DELIVERY')).toBe(false);
  });

  it('returns false for other values', () => {
    expect(isPickupAddress('OTHER')).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isPickupAddress(undefined)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isPickupAddress(null)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isPickupAddress('')).toBe(false);
  });
});

describe('isDeliveryAddress', () => {
  it('returns true for DELIVERY', () => {
    expect(isDeliveryAddress('DELIVERY')).toBe(true);
  });

  it('returns true for PICKUP_AND_DELIVERY', () => {
    expect(isDeliveryAddress('PICKUP_AND_DELIVERY')).toBe(true);
  });

  it('returns false for PICKUP', () => {
    expect(isDeliveryAddress('PICKUP')).toBe(false);
  });

  it('returns false for other values', () => {
    expect(isDeliveryAddress('OTHER')).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isDeliveryAddress(undefined)).toBe(false);
  });

  it('returns false for null', () => {
    expect(isDeliveryAddress(null)).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isDeliveryAddress('')).toBe(false);
  });
});
