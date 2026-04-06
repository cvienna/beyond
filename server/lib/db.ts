import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as chatSchema from "@server/schemas/chat";
import * as messageSchema from "@server/schemas/message";
import { env } from "@shared/env";

const pool = new Pool({
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  user: env.DATABASE_USER,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE_NAME,
});

export const db = drizzle(pool, {
  schema: {
    ...chatSchema,
    ...messageSchema,
  },
});
