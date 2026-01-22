import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "db.json");

export interface Application {
    id: string;
    fullName: string;
    tcNo: string;
    email: string;
    phone?: string;
    birthDate?: string;
    gender?: string;
    city?: string;
    club?: string;
    category: "long" | "short";
    emergencyName?: string;
    emergencyPhone?: string;
    receiptUrl?: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    location: string;
    status: "published" | "draft";
    participants: number;
}

export interface DB {
    applications: Application[];
    events: Event[];
}

export async function getDb(): Promise<DB> {
    try {
        const data = await fs.readFile(DB_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return { applications: [], events: [] };
    }
}

export async function saveDb(db: DB): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}
