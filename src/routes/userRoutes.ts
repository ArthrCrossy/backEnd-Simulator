import { Router } from "express";
import {login, UserController} from "../controllers/userController";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/user/create", (req, res) => userController.create(req, res));
userRoutes.post("/login", login);

export default userRoutes;