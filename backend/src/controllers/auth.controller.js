import bcrypt from "bcryptjs";
import  prisma  from "../config/db.js";
import { signToken } from "../utils/jwt.js";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies.js";
import { loginSchema, signupSchema } from "../validations/auth.validation.js";

export const signup = async (req, res, next) => {
  try {
    const parsed = signupSchema.parse(req.body);
    const { name, email, password } = parsed;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = signToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.parse(req.body);
    const { email, password } = parsed;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
      email: user.email,
    });

    setAuthCookie(res, token);

    return res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        plan: true,
        solvedCount: true,
        streak: true,
      },
    });

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    clearAuthCookie(res);

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};