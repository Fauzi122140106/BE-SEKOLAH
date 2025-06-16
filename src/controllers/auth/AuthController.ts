import { Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "../../middleware/AuthMiddleware";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

class AuthController {
  /**
   * POST /auth/login
   * Autentikasi user (admin/guru/siswa)
   */
  async login(req: AuthenticatedRequest, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ success: false, message: "Email dan password wajib diisi" });
      }

      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Email atau password salah" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ success: false, message: "Email atau password salah" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      const { password: _, ...userWithoutPassword } = user;

      return res.json({
        success: true,
        message: "Login berhasil",
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }

  /**
   * GET /auth/profile
   * Mengambil data profil user yang sedang login
   */
  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Tidak terautentikasi" });
      }

      const userDetails = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
      });

      if (!userDetails) {
        return res
          .status(404)
          .json({ success: false, message: "Pengguna tidak ditemukan" });
      }

      return res.json({
        success: true,
        user: userDetails,
      });
    } catch (error) {
      console.error("Profile error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }

  /**
   * POST /auth/logout
   * Logout user (token dapat dihapus di client)
   */
  async logout(req: AuthenticatedRequest, res: Response) {
    try {
      // Jika menggunakan token-based authentication, cukup beri respon berhasil.
      return res.json({
        success: true,
        message: "Logout berhasil",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }
}

export default new AuthController();
