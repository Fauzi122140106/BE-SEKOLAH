import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [facilities, news, gallery] = await Promise.all([
      prisma.facility.count(),
      prisma.news.count(),
      prisma.gallery.count(),
    ]);

    const recentNews = await prisma.news.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      stats: {
        facilities,
        news,
        gallery,
      },
      recentActivities: recentNews.map((item) => ({
        type: "Berita",
        message: `Artikel '${item.title}' dipublikasikan`,
        time: item.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memuat data dashboard", error });
  }
};
