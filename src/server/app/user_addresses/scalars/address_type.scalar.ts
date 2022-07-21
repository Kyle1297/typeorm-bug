import { GraphQLScalarType } from 'graphql';

export const addressTypes = ['PICKUP', 'DELIVERY', 'PICKUP_AND_DELIVERY'];
export type AddressTypes = typeof addressTypes[number];

function validate(addressType: unknown): AddressTypes | never {
  if (typeof addressType !== 'string') {
    throw new Error(`Expected string, received ${addressType}`);
  }

  if (!addressTypes.includes(addressType as AddressTypes)) {
    throw new Error(
      `Expected one of ${addressTypes.join(
        ', ',
      )}. Instead, received ${addressType}`,
    );
  }

  return addressType as AddressTypes;
}

export const AddressTypeScalar = new GraphQLScalarType({
  name: 'AddressTypeScalar',
  description:
    'Different address types for customers, workers and their businesses',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: any) => validate(ast.value),
});
