import { Response } from "express";
import { findUserById } from "../repositories/userRepository";
import { AuthRequest } from "../middlewares/requireAuth";

export class MeController {
    async show(req: AuthRequest, res: Response) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    message: "Usuário não autenticado.",
                });
            }

            const user = await findUserById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    message: "Usuário não encontrado.",
                });
            }

            return res.status(200).json({
                user,
            });
        } catch {
            return res.status(500).json({
                message: "Erro interno ao buscar usuário.",
            });
        }
    }
}