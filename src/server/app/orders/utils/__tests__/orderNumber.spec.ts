import { orderNumber } from '../orderNumber';

describe('orderNumber().generate', () => {
  test('should produce unique numbers', () => {
    const id1 = orderNumber().generate();
    setTimeout(() => {
      const id2 = orderNumber().generate();
      expect(id1).not.toBe(id2);
    }, 1);
  });
});

describe('orderNumber().getTime', () => {
  test('should correctly return the initial timestamp used during generation', () => {
    const now = Date.now();
    const id = orderNumber().generate();
    const returnedTime = orderNumber().getTime(id);
    expect(returnedTime).toBe(now);
  });

  test('should return original passed in date', () => {
    const now = Date.now();
    const id = orderNumber().generate(now);
    const returnedTime = orderNumber().getTime(id);
    expect(returnedTime).toBe(now);
  });
});
