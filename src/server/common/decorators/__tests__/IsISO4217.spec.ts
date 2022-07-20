import { Validator, ValidatorOptions } from 'class-validator';
import { IsISO4217 } from '../IsISO4217';

export function checkValidValues(
  object: { someProperty: any },
  values: any[],
  validatorOptions?: ValidatorOptions,
): Promise<any> {
  const validator = new Validator();
  const promises = values.map(async (value) => {
    object.someProperty = value;
    const errors = await validator.validate(object, validatorOptions);
    expect(errors.length).toEqual(0);

    if (errors.length !== 0) {
      console.log(`Unexpected errors: ${JSON.stringify(errors)}`);
      throw new Error('Unexpected validation errors');
    }
  });

  return Promise.all(promises);
}

export function checkInvalidValues(
  object: { someProperty: any },
  values: any[],
  validatorOptions?: ValidatorOptions,
): Promise<any> {
  const validator = new Validator();
  const promises = values.map((value) => {
    object.someProperty = value;
    return validator
      .validate(object, validatorOptions)
      .then((errors) => {
        expect(errors.length).toEqual(1);
        if (errors.length !== 1) {
          throw new Error('Missing validation errors');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return Promise.all(promises);
}

describe('IsISO4217', () => {
  class MyClass {
    @IsISO4217()
    someProperty: string;
  }

  it('should not fail for a valid ISO4217 code', () => {
    const validValues = ['EUR', 'USD', 'BDT', 'LRD', 'AUD'];
    return checkValidValues(new MyClass(), validValues);
  });

  it('should fail for invalid values', () => {
    const invalidValues = [undefined, null, '', 'USS'];
    return checkInvalidValues(new MyClass(), invalidValues);
  });
});
