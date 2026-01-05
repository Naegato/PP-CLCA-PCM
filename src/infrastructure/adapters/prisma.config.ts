import "dotenv/config";
import { config } from 'dotenv';
import { defineConfig } from "prisma/config";


export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: config({ path: '../../.env' }).parsed?.['DB_URL'] || '',
  },
});
