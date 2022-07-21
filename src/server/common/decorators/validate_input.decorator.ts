import { applyDecorators, UseFilters, UsePipes } from '@nestjs/common';
import { InputValidationPipe } from '../pipes/input_validation.pipe';
import { InputValidationExceptionFilter } from '../filters/input_validation_exception.filter';

export function ValidateInput() {
  return applyDecorators(
    UsePipes(InputValidationPipe),
    UseFilters(InputValidationExceptionFilter),
  );
}
