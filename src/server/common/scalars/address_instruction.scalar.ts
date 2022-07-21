import { GraphQLScalarType } from 'graphql';

export const addressInstructions = [
  'LEAVE_AT_DOOR',
  'MEET_AT_DOOR',
  'MEET_OUTSIDE',
] as const;
export type AddressInstructionTypes = typeof addressInstructions[number];

function validate(
  addressInstructionType: unknown,
): AddressInstructionTypes | never {
  if (typeof addressInstructionType !== 'string') {
    throw new Error(`Expected string, received ${addressInstructionType}`);
  }

  if (
    !addressInstructions.includes(
      addressInstructionType as AddressInstructionTypes,
    )
  ) {
    throw new Error(
      `Expected one of ${addressInstructions.join(
        ', ',
      )}. Instead, received ${addressInstructionType}`,
    );
  }

  return addressInstructionType as AddressInstructionTypes;
}

export const AddressInstructionScalar = new GraphQLScalarType({
  name: 'AddressInstructionScalar',
  description: 'General instructions for delivery and/or pickup',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: any) => validate(ast.value),
});
