import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../database/connection";
import { User } from "../types/user";
import jwt, {Secret, SignOptions} from "jsonwebtoken";
import bcrypt from "bcryptjs";

type UserRow = User & RowDataPacket;

interface LoginInput {
    email: string;
    password: string;
}

interface LoginResult {
    message: string;
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export async function findUserByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.query<UserRow[]>(
        "SELECT id, name, email, password_hash, created_at, updated_at FROM users WHERE email = ? LIMIT 1",
        [email]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

export async function createUser(
    name: string,
    email: string,
    passwordHash: string
): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        [name, email, passwordHash]
    );

    return result.insertId;
}

export async function findUserById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
        "SELECT id, name, email, created_at, updated_at FROM users WHERE id = ? LIMIT 1",
        [id]
    );

    if (rows.length === 0) {
        return null;
    }

    return rows[0];
}

export async function loginService({ email, password }: LoginInput): Promise<LoginResult> {
    if (!email || !password) {
        throw new Error("Email e senha são obrigatórios.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await findUserByEmail(normalizedEmail);

    if (!user) {
        throw new Error("Email ou senha inválidos.");
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
        throw new Error("Email ou senha inválidos.");
    }

    const secret: Secret = process.env.JWT_SECRET as string;

    if (!secret) {
        throw new Error("JWT_SECRET não configurado.");
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"];

    const token = jwt.sign(
        {
            sub: user.id,
            email: user.email,
            name: user.name,
        },
        secret,
        { expiresIn }
    );

    return {
        message: "Login realizado com sucesso.",
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
    };
}