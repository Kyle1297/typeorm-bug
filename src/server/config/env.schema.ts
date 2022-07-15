import * as Joi from '@hapi/joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(3000),
  DB_URL: Joi.string().when('NODE_ENV', {
    switch: [
      {
        is: 'development',
        then: Joi.optional().default('postgres://postgres:@db:5432'),
      },
      {
        is: 'test',
        then: Joi.optional().default('postgres://postgres:@db:5432/test'),
        otherwise: Joi.required(),
      },
    ],
  }),
  JWT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('jwt'),
  }),
  JWT_EXPIRES_IN: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('7 days'),
  }),
  FACEBOOK_ID: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('fake'),
  }),
  FACEBOOK_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('fake'),
  }),
  GOOGLE_ID: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('fake'),
  }),
  GOOGLE_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.required(),
    otherwise: Joi.optional().default('fake'),
  }),
});
