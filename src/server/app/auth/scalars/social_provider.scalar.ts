import { GraphQLScalarType } from 'graphql';

export const socialProviderTypes = ['facebook', 'google'] as const;
export type SocialProviderTypes = typeof socialProviderTypes[number];

function validate(socialProviderType: unknown): SocialProviderTypes | never {
  if (typeof socialProviderType !== 'string') {
    throw new Error(`Expected string, received ${socialProviderType}`);
  }

  if (
    !socialProviderTypes.includes(socialProviderType as SocialProviderTypes)
  ) {
    throw new Error(
      `Expected one of ${socialProviderTypes.join(
        ', ',
      )}. Instead, received ${socialProviderType}`,
    );
  }

  return socialProviderType as SocialProviderTypes;
}

export const SocialProviderScalar = new GraphQLScalarType({
  name: 'SocialProviderScalar',
  description: 'Social provider type such as facebook or google',
  serialize: (value) => validate(value),
  parseValue: (value) => validate(value),
  parseLiteral: (ast: any) => validate(ast.value),
});
