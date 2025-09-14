import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("[ErrorHandler]", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
}
