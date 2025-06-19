import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";

const prisma = new PrismaClient();

class FacilityController {
  // GET /facilities
  async getAll(req: Request, res: Response) {
    try {
      const facilities = await prisma.facility.findMany({
        where: { status: "active" },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: true,
        message: "Data fasilitas berhasil diambil",
        data: facilities,
      });
    } catch (error) {
      console.error("Error in getAll:", error);
      res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }

  // GET /facilities/:slug
  async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const facility = await prisma.facility.findUnique({
        where: { slug },
      });

      if (!facility) {
        return res.status(404).json({
          success: false,
          message: "Fasilitas tidak ditemukan",
        });
      }

      res.json({
        success: true,
        message: "Fasilitas ditemukan",
        data: facility,
      });
    } catch (error) {
      console.error("Error in getBySlug:", error);
      res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }

  // POST /facilities
  async create(req: Request, res: Response) {
    try {
      const { title, description, slug, features } = req.body;
      const file = req.files;
      let imageUrl = "";

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: "Gambar harus diupload." });
      }

      const files = req.files as Express.Multer.File[];
      const imageUrls: string[] = [];

      if (files && files.length > 0) {
        for (const file of files) {
          if (file.buffer) {
            const { url } = await put(file.originalname, file.buffer, {
              access: "public",
              addRandomSuffix: true,
              // jika perlu
            });

            imageUrls.push(url);
          }
        }
      }

      if (!title || !description || !slug) {
        return res.status(400).json({
          success: false,
          message: "Judul, deskripsi, dan slug wajib diisi",
        });
      }

      const created = await prisma.facility.create({
        data: {
          title,
          description,
          slug,
          features: features ? JSON.parse(features) : [],
          status: "active",
          images: imageUrls,
        },
      });

      res.status(201).json({
        success: true,
        message: "Fasilitas berhasil ditambahkan",
        data: created,
      });
    } catch (error) {
      console.error("Error in create:", error);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  }

  // PUT /facilities/:id
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const { title, description, images, slug, features, status } = req.body;

      const updated = await prisma.facility.update({
        where: { id },
        data: {
          title,
          description,
          images,
          slug,
          features: features ?? [],
          status,
        },
      });

      res.json({
        success: true,
        message: "Fasilitas berhasil diperbarui",
        data: updated,
      });
    } catch (error) {
      console.error("Error in update:", error);
      res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }

  // DELETE /facilities/:id
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);

      await prisma.facility.delete({ where: { id } });

      res.json({
        success: true,
        message: "Fasilitas berhasil dihapus",
      });
    } catch (error) {
      console.error("Error in delete:", error);
      res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  }
}

export default new FacilityController();
