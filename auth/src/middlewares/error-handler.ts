import { Request, Response, NextFunction } from 'express';
import { RequestValidationError } from '../errors/request-validaion-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Something went wrong', err);

  if (err instanceof RequestValidationError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }
  if (err instanceof DatabaseConnectionError) {
    res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  res.send([
    {
      message: err.message,
    },
  ]);
};
