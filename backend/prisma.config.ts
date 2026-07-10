import "dotenv/config";
import { defineConfig } from "prisma/config";

// Remove pgbouncer=true for migrations — it causes hanging
const migrationUrl = (process.env["DIRECT_URL"] ?? "").replace(
  "?pgbouncer=true",
  "",
);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
