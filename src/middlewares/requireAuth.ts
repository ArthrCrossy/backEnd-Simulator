import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

export function requireAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "Token não informado.",
            });
        }

        const [, token] = authHeader.split(" ");

        if (!token) {
            return res.status(401).json({
                message: "Token inválido.",
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            return res.status(500).json({
                message: "JWT_SECRET não configurado.",
            });
        }

        const decoded = jwt.verify(token, secret) as {
            sub: string | number;
            email: string;
        };

        req.user = {
            id: Number(decoded.sub),
            email: decoded.email,
        };

        next();
    } catch {
        return res.status(401).json({
            message: "Token inválido ou expirado.",
        });
    }
}