import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

class GalleryController {
  async getAll(req: Request, res: Response) {
    try {
      const { category, page = 1, limit = 10 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const where = category ? { category: String(category) } : {};

      const [images, totalItems] = await Promise.all([
        prisma.gallery.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: { uploadDate: "desc" },
        }),
        prisma.gallery.count({ where }),
      ]);

      const categories = await prisma.gallery.findMany({
        distinct: ["category"],
        select: { category: true },
      });

      res.json({
        success: true,
        message: "Gambar berhasil diambil",
        data: {
          images,
          categories: categories.map((c) => c.category),
          pagination: {
            currentPage: Number(page),
            totalPages: Math.ceil(totalItems / Number(limit)),
            totalItems,
          },
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { title, description, category } = req.body;
      const file = req.file;

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "Gambar harus diupload." });
      }

      let imageUrl = "";

      if (file.buffer) {
        const { url } = await put(file.originalname, file.buffer, {
          access: "public",
          addRandomSuffix: true,
        });

        imageUrl = url;
      }

      const newImage = await prisma.gallery.create({
        data: {
          title,
          description,
          category,
          image: imageUrl,
        },
      });

      return res.json({ success: true, data: newImage });
    } catch (error) {
      console.error("GALLERY CREATE ERROR:", error);
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { title, description, category } = req.body;
      const file = req.file;

      const existing = await prisma.gallery.findUnique({ where: { id } });

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Gambar tidak ditemukan" });
      }

      let imageFileName = existing.image;

      if (file) {
        // hapus file lama jika ada
        if (existing.image) {
          const oldFilePath = path.join(
            __dirname,
            "../../uploads/gallery",
            existing.image
          );
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        imageFileName = file.filename;
      }

      const updatedImage = await prisma.gallery.update({
        where: { id },
        data: {
          title,
          description,
          category,
          image: imageFileName,
        },
      });

      res.json({ success: true, data: updatedImage });
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const existing = await prisma.gallery.findUnique({ where: { id } });

      if (!existing) {
        return res
          .status(404)
          .json({ success: false, message: "Gambar tidak ditemukan" });
      }

      // hapus file dari folder uploads/gallery jika perlu
      if (existing.image) {
        const filePath = path.join(
          __dirname,
          "../../uploads/gallery",
          existing.image
        );
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      await prisma.gallery.delete({ where: { id } });

      res.json({ success: true, message: "Gambar berhasil dihapus" });
    } catch (error) {
      console.error("DELETE ERROR:", error);
      res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }
}

export default new GalleryController();
