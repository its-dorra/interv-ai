import { drizzle } from "drizzle-orm/node-postgres";
import { serverEnv } from "@/data/env/server";
import * as schema from "@/drizzle/schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: serverEnv.DATABASE_URL,
});

const db = drizzle({ schema, client: pool });

export default db;
