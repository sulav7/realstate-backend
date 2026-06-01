export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

const error = (message: string, statusCode: number) => {
  const status = [400, 404, 422, 403, 401, 409];

  const code = status.includes(statusCode) ? statusCode : 500;

  const errorMessage = message
    ? message
    : "There is something wrong please contact backend developer";

  return {
    code: code,
    message: errorMessage,
  };
};

const success = (message: string, code: number, result: any) => {
  return {
    message: message,
    result: result,
    code: code,
  };
};

export { success, error };
