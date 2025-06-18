import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" }, // username sekarang sudah diakui oleh Prisma
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
      name: "Admin Sekolah",
      role: "admin",
      avatar: "https://example.com/uploads/avatars/admin.jpg",
    },
  });

  console.log("✅ Admin user created:", {
    id: adminUser.id,
    username: adminUser.username,
    role: adminUser.role,
  });
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
