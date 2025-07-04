import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { PrismaClient } from "@prisma/client";
import apiRoutes from "./src/routes/api.route";
import { errorHandler } from "./src/middleware/ErrorMiddleware";
import facilityRoutes from "./src/routes/master/facilityRoutes";
import galleryRoutes from "./src/routes/master/galleryRoutes";
import authRoutes from "./src/routes/auth/AuthRoute";

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", apiRoutes);

//facility routes
app.use("/api", facilityRoutes);

//gallery routes
app.use("/api", galleryRoutes);

// Error handling middleware
app.use(errorHandler);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Database connection check
prisma
  .$connect()
  .then(() => console.log("Database connected"))
  .catch((err: Error) => console.error("Database connection error:", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
