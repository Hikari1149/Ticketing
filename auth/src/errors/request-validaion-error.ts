import { ValidationError } from 'express-Validator';

export class RequestValidationError extends Error {
  constructor(private errors: ValidationError[]) {
    super();
    // extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
