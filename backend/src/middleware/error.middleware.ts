import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ApiError } from "../errors/ApiError";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || "Internal server error";

  // 1. ApiError
  if (
    err instanceof ApiError ||
    (err.statusCode && err.isOperational !== undefined)
  ) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // 2. Zod validation errors
  else if (err instanceof ZodError || err.name === "ZodError") {
    statusCode = 400;
    message = err.errors
      ? err.errors.map((e: any) => e.message).join(", ")
      : "Validation error";
  }
  // 3. Prisma errors
  else if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err.name?.startsWith("PrismaClient")
  ) {
    if (err.code === "P2002") {
      statusCode = 409;
      message =
        "Duplicate field value: an entry with this value already exists.";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Requested record not found.";
    } else if (err.code === "P2003") {
      statusCode = 400;
      message = "Invalid reference or relation in database request.";
    } else {
      statusCode = 400;
      message = err.message || "Database request error.";
    }
  }
  // 4. JWT errors
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please log in again.";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }
  // 5. Fallback for standard Errors from existing services / unknown errors
  else if (err instanceof Error) {
    const lowerMsg = err.message.toLowerCase();
    if (
      lowerMsg.includes("not found") ||
      lowerMsg.includes("does not exist")
    ) {
      statusCode = 404;
      message = err.message;
    } else if (
      lowerMsg.includes("already exists") ||
      lowerMsg.includes("cannot be") ||
      lowerMsg.includes("already checked") ||
      lowerMsg.includes("cannot check out") ||
      lowerMsg.includes("invalid") ||
      lowerMsg.includes("required") ||
      lowerMsg.includes("must be") ||
      lowerMsg.includes("unauthorized") ||
      lowerMsg.includes("forbidden")
    ) {
      statusCode = lowerMsg.includes("unauthorized")
        ? 401
        : lowerMsg.includes("forbidden")
        ? 403
        : 400;
      message = err.message;
    }
  }

  const responsePayload: {
    success: boolean;
    message: string;
    stack?: string;
  } = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV !== "production") {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

export default errorHandler;
