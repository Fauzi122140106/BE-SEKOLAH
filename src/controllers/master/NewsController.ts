//src/controllers/master/NewsController.ts

import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class NewsController {
  async getAll(req: Request, res: Response) {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(news);
  }

  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const news = await prisma.news.findUnique({ where: { id } });

    if (!news)
      return res.status(404).json({ message: "Berita tidak ditemukan" });

    res.json(news);
  }

  async create(req: Request, res: Response) {
    try {
      const { title, content, author } = req.body;
      const imageUrl = req.file ? req.file.filename : null;

      if (!title || !content || !author) {
        return res.status(400).json({
          success: false,
          message: "Semua field wajib diisi",
        });
      }

      const created = await prisma.news.create({
        data: {
          title,
          content,
          author,
          imageUrl, // sesuai skema Prisma
        },
      });

      res.status(201).json({
        success: true,
        message: "Berita berhasil ditambahkan",
        data: created,
      });
    } catch (err) {
      console.error("Create News Error:", err);
      res.status(500).json({
        success: false,
        message: "Terjadi kesalahan server",
      });
    }
  }

  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { title, content, imageUrl, author } = req.body;

    const updated = await prisma.news.update({
      where: { id },
      data: { title, content, imageUrl, author },
    });

    res.json(updated);
  }

  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);

    await prisma.news.delete({ where: { id } });

    res.json({ message: "Berita berhasil dihapus" });
  }
}

export default new NewsController();
