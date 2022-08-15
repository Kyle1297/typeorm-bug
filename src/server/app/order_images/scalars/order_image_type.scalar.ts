import { GraphQLScalarType } from 'graphql';

export const orderImageTypes = ['PICKUP', 'READY_FOR_DELIVERY', 'DELIVERY'];
export type OrderImageTypes = typeof orderImageTypes[number];

function validate(orderImageType: unknown): OrderImageTypes | never {
  if (typeof orderImageType !== 'string') {
    throw new Error(`Expected string, received ${orderImageType}`);
  }

  if (!orderImageType.includes(orderImageType as OrderImageTypes)) {
    throw new Error(
      `Expected one of ${orderImageTypes.join(
        ', ',
      )}. Instead, received ${orderImageType}`,
    );
  }

  return orderImageType as OrderImageTypes;
}

export const OrderImageTypeScalar = new GraphQLScalarType({
  name: 'OrderImageTypeScalar',
  description: 'Different types of order images',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: any) => validate(ast.value),
});
