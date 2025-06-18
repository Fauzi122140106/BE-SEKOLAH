import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../../middleware/AuthMiddleware";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

class AuthController {
  async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username dan password wajib diisi",
        });
      }

      const user = await prisma.user.findUnique({ where: { username } });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Username atau password salah",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Username atau password salah",
        });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  }

  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      // Token akan "kedaluwarsa" di sisi client, cukup beri response sukses
      return res.json({
        success: true,
        message: "Logout berhasil",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Tidak terautentikasi",
        });
      }

      const userDetails = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          username: true,
          name: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
      });

      if (!userDetails) {
        return res.status(404).json({
          success: false,
          message: "Pengguna tidak ditemukan",
        });
      }

      return res.json({
        success: true,
        user: userDetails,
      });
    } catch (error) {
      console.error("Profile error:", error);
      return res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  }
}

export default new AuthController();
