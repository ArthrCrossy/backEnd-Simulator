import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { MeController } from "../controllers/meController";
import { requireAuth } from "../middlewares/requireAuth";

const authRoutes = Router();
const authController = new AuthController();
const meController = new MeController();

authRoutes.post("/user/login", (req, res) => authController.login(req, res));
authRoutes.get("/me", requireAuth, (req, res) => meController.show(req, res));

export default authRoutes;