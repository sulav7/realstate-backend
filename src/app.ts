import express from "express";
import { AppRouter } from "./lib/routes";
import { error } from "./lib/error";
import cors from "cors";

const app = express();
const appRouter = new AppRouter();

app.use(express.json());

app.use(cors());

app.use("/api/v1", appRouter.router);

app.use(function (
  err: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  const errors = error(err?.message, err?.statusCode);

  res.status(errors?.code).json({
    message: errors?.message,
    code: errors?.code,
  });
});

export default app;
