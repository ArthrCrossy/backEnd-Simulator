import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { LoginUserDTO } from "../types/user";
import { findUserByEmail, findUserById } from "../repositories/userRepository";

export class AuthService {
    async login(data: LoginUserDTO) {
        const email = data.email?.trim().toLowerCase();
        const password = data.password?.trim();

        if (!email || !password) {
            throw new Error("E-mail e senha são obrigatórios.");
        }

        const user = await findUserByEmail(email);

        if (!user) {
            throw new Error("E-mail ou senha inválidos.");
        }

        const passwordMatches = await bcrypt.compare(password, user.password_hash);

        if (!passwordMatches) {
            throw new Error("E-mail ou senha inválidos.");
        }

        const secret: Secret = process.env.JWT_SECRET as string;

        if (!secret) {
            throw new Error("JWT_SECRET não configurado.");
        }

        const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

        const token = jwt.sign(
            {
                sub: String(user.id),
                email: user.email,
            },
            secret,
            {expiresIn}
        );

        const safeUser = await findUserById(user.id);

        return {
            message: "Login realizado com sucesso.",
            token,
            user: {
                name: user.name,
            },
        };
    }
}