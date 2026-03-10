import { Request, Response } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const result = await authService.login({ email, password });

            return res.status(200).json(result);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Erro interno ao fazer login.";

            return res.status(400).json({ message });
        }
    }
}