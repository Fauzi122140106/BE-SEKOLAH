import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("admin123", salt);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@sekolah.com" },
    update: {},
    create: {
      email: "admin@sekolah.com",
      password: hashedPassword,
      name: "Admin Sekolah",
      role: "admin",
      avatar: "https://example.com/uploads/avatars/admin.jpg",
    },
  });

  console.log("✅ Admin user created:", adminUser);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding admin user:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
