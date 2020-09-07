import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('Something went wrong', err);
  res.send({
    message: err.message,
  });
};
