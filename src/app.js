import express from "express";
import menuRoutes from "./routes/menu.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(express.json());
app.use("/menu", menuRoutes);
app.use("/auth", authRoutes);

export default app;
