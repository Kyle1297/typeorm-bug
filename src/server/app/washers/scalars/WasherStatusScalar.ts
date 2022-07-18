import { GraphQLScalarType } from 'graphql';

export const washerStatuses = [
  'WASHING',
  'WAITING_FOR_ORDER',
  'NOT_WORKING',
  'SIGNING_UP',
];
export type WasherStatuses = typeof washerStatuses[number];

function validate(washerStatus: unknown): WasherStatuses | never {
  if (typeof washerStatus !== 'string') {
    throw new Error(`Expected string, received ${washerStatus}`);
  }

  if (!washerStatus.includes(washerStatus as WasherStatuses)) {
    throw new Error(
      `Expected one of ${washerStatuses.join(
        ', ',
      )}. Instead, received ${washerStatus}`,
    );
  }

  return washerStatus as WasherStatuses;
}

export const WasherStatusScalar = new GraphQLScalarType({
  name: 'WasherStatusScalar',
  description: 'Different states of a washer',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: any) => validate(ast.value),
});
