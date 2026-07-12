import { Request, Response } from "express";
import authService from "../services/auth.service";
import { registerSchema, loginSchema, updateProfileSchema, changePasswordSchema } from "../validators/auth.validator";
import { asyncHandler } from "../utils/asyncHandler";

class AuthController {
  getMe = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }
    const result = await authService.getMe(req.user.userId);
    res.status(200).json({
      success: true,
      message: "Profile fetched successfully.",
      data: result,
    });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }
    const data = updateProfileSchema.parse(req.body);
    const result = await authService.updateProfile(req.user.userId, data);
    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: result,
    });
  });

  changePassword = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (!req.user?.userId) {
      res.status(401).json({ success: false, message: "Unauthorized." });
      return;
    }
    const data = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.user.userId, data);
    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  });

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
