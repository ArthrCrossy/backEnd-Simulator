import { Request, Response } from "express";
import { UserService } from "../services/userService";

const userService = new UserService();

export class UserController {
    async create(req: Request, res: Response) {
        try {
            const { name, email, password, confirmPassword } = req.body;

            const user = await userService.create({
                name,
                email,
                password,
                confirmPassword,
            });

            return res.status(201).json({
                message: "Conta criada com sucesso.",
                user,
            });
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Erro interno ao criar conta.";

            return res.status(400).json({ message });
        }
    }
}