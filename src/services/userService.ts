import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../repositories/userRepository";

interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export class UserService {
    async create(data: CreateUserDTO) {
        const { name, email, password, confirmPassword } = data;

        if (!name || !email || !password || !confirmPassword) {
            throw new Error("Preencha todos os campos.");
        }

        if (password !== confirmPassword) {
            throw new Error("As senhas não coincidem.");
        }

        const emailExists = await findUserByEmail(email);

        if (emailExists) {
            throw new Error("E-mail já cadastrado.");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await createUser(
            name,
            email,
            passwordHash
        );

        return user;
    }
}