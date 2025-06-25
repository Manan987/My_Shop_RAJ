import 'dotenv/config';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "../shared/schema";

// Create SQLite database
const sqlite = new Database('dev.db');

// Enable WAL mode for better performance
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });