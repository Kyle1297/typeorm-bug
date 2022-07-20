import { GraphQLScalarType } from 'graphql';

export const orderTimeslots = [
  '8 AM - 11 AM',
  '11 AM - 2 PM',
  '2 PM - 5 PM',
  '5 PM - 8 PM',
];
export type OrderTimeslots = typeof orderTimeslots[number];

function validate(orderTimeslot: unknown): OrderTimeslots | never {
  if (typeof orderTimeslot !== 'string') {
    throw new Error(`Expected string, received ${orderTimeslot}`);
  }

  if (!orderTimeslot.includes(orderTimeslot as OrderTimeslots)) {
    throw new Error(
      `Expected one of ${orderTimeslots.join(
        ', ',
      )}. Instead, received ${orderTimeslot}`,
    );
  }

  return orderTimeslot as OrderTimeslots;
}

export const OrderTimeslotScalar = new GraphQLScalarType({
  name: 'OrderTimeslotScalar',
  description: 'The different timeslots for pickup and delivery',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: any) => validate(ast.value),
});
