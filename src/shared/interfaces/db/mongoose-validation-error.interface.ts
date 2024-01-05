import { Error } from 'mongoose';
import ValidationError = Error.ValidationError;
import ValidatorError = Error.ValidatorError;
import CastError = Error.CastError;

interface Properties {
  min: number;
  max: number;
  minlength: number;
  maxlength: number;
}

export interface MongooseValidationError extends ValidationError {
  errors: {
    [path: string]: (ValidatorError | CastError) & { properties: Properties };
  };
}
