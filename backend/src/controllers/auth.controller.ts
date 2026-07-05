import { Request, Response } from "express";
import authService from "../services/auth.service";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { asyncHandler } from "../utils/asyncHandler";

class AuthController {
  register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: result,
    });
  });

  login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  });
}

export default new AuthController();
