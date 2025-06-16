import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Interface untuk payload user dari JWT
export interface JwtUser extends JwtPayload {
  id: number;
  email: string;
  role: "admin" | "staff" | "support"; // bisa kamu tambah kalau ada role baru
}

// Perluas tipe Request untuk menambahkan properti `user`
export interface AuthenticatedRequest extends Request {
  user?: JwtUser;
}

/**
 * Middleware autentikasi: memverifikasi token JWT
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUser;
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ success: false, message: "Token tidak valid atau kedaluwarsa" });
  }
};

/**
 * Middleware hanya untuk role admin
 */
export const adminOnly = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Akses khusus admin" });
  }
  next();
};

/**
 * Middleware penanganan error global
 */
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server",
  });
};
