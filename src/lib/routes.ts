// src/routes/index.ts

import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes";

export class AppRouter {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initRoutes();
  }

  private initRoutes(): void {
    this.router.use("/auth", authRoutes);
  }
}
