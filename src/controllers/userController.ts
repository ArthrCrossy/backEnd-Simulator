import { Request, Response } from "express";
import { UserService } from "../services/userService";
import {loginService} from "../repositories/userRepository";

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

export async function login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        const result = await loginService({ email, password });

        return res.status(200).json(result);
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Erro interno ao fazer login.";

        const isInvalidCredentials =
            message === "Email ou senha inválidos.";

        return res.status(isInvalidCredentials ? 401 : 400).json({
            message,
        });
    }
}