import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

export const authorize = (...allowedRoles: Role[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user || !user.role) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. User authentication required.",
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "Forbidden. You do not have permission to perform this action.",
      });
      return;
    }

    next();
  };
};

export default authorize;
