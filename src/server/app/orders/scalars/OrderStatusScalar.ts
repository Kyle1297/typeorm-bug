import { GraphQLScalarType } from 'graphql';

export const orderStatuses = [
  'NOT_CONFIRMED',
  'CONFIRMED',
  'WASHER_ASSIGNED',
  'PICKED_UP',
  'READY_FOR_DELIVERY',
  'ON_THE_WAY',
  'DELIVERED',
];
export type OrderStatuses = typeof orderStatuses[number];

function validate(orderStatus: unknown): OrderStatuses | never {
  if (typeof orderStatus !== 'string') {
    throw new Error(`Expected string, received ${orderStatus}`);
  }

  if (!orderStatus.includes(orderStatus as OrderStatuses)) {
    throw new Error(
      `Expected one of ${orderStatuses.join(
        ', ',
      )}. Instead, received ${orderStatus}`,
    );
  }

  return orderStatus as OrderStatuses;
}

export const OrderStatusScalar = new GraphQLScalarType({
  name: 'OrderStatusScalar',
  description: 'Different states of a order',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: any) => validate(ast.value),
});
