import bcrypt from "bcryptjs";
import { CreateUserDTO } from "../types/user";
import {
    createUser,
    findUserByEmail,
    findUserById,
} from "../repositories/userRepository";

export class UserService {
    async create(data: CreateUserDTO) {
        const name = data.name?.trim();
        const email = data.email?.trim().toLowerCase();
        const password = data.password?.trim();
        const confirmPassword = data.confirmPassword?.trim();

        if (!name || !email || !password) {
            throw new Error("Nome, e-mail e senha são obrigatórios.");
        }

        if (name.length < 3) {
            throw new Error("O nome deve ter pelo menos 3 caracteres.");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("E-mail inválido.");
        }

        if (password.length < 6) {
            throw new Error("A senha deve ter pelo menos 6 caracteres.");
        }

        if (confirmPassword !== undefined && password !== confirmPassword) {
            throw new Error("As senhas não coincidem.");
        }

        const userAlreadyExists = await findUserByEmail(email);
        if (userAlreadyExists) {
            throw new Error("Este e-mail já está cadastrado.");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const userId = await createUser(name, email, passwordHash);

        const user = await findUserById(userId);

        return user;
    }
}