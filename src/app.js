import express from "express";
import cors from "cors";
import menuRoutes from "./routes/menu.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Ativando o CORS
app.use(cors());

app.use(express.json());
app.use("/menu", menuRoutes);
app.use("/auth", authRoutes);

export default app;
