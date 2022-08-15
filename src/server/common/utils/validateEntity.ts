import { validate } from 'class-validator';

export const validateEntity = async (entity: any): Promise<Error | void> => {
  const errors = await validate(entity);
  if (errors.length > 0) {
    throw new Error(
      errors
        .map((error) =>
          Object.keys(error.constraints).map((key) => error.constraints[key]),
        )
        .join(', '),
    );
  }
};
