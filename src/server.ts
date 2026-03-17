import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { testConnection } from "./database/connection";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use(authRoutes);

const PORT = Number(process.env.PORT || 3333);

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    await testConnection();
});