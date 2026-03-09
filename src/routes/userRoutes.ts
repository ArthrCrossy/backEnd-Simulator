import { Router } from "express";
import { UserController } from "../controllers/userController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/user/create", (req, res) => userController.create(req, res));

export default userRoutes;