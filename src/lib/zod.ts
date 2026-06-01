import { ZodError, ZodSchema } from "zod";
import express from "express";

interface IErrorType {
  message: string;
  path: string[];
  code: string;
  expected: string;
  received: string;
}

const validate =
  (schema: ZodSchema) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const data = schema.parse(req.body);

      req.body = data;
      next();
    } catch (err: IErrorType | any) {
      const validationErrors = err.issues?.map(
        (e: IErrorType) => e.message + " on field " + e.path.join(".")
      );
      const message = {
        error: validationErrors,
      };

      res.status(400).json(message);
    }
  };

export default validate;
