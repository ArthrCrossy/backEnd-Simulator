import { ResultSetHeader, RowDataPacket } from "mysql2";
import pool from "../database/connection";
import { User } from "../types/user";

type UserRow = User & RowDataPacket;

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