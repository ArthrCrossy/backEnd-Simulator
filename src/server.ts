import express from "express";
import dotenv from "dotenv";
import path from "path";
import { testConnection } from "./database/connection";
import userRoutes from "./routes/userRoutes";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const app = express();
app.use(express.json());

app.use(userRoutes);

const PORT = Number(process.env.PORT || 3333);

app.listen(PORT, async () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    await testConnection();
});