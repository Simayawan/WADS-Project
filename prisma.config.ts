import { defineConfig } from 'prisma/config';

export default defineConfig({
  datasource: {
    // FIX LATER, THIS IS A SECURITY RISK, FOR NOW IT IS TEMPORARY
    url: "postgresql://neondb_owner:npg_Ex4adS0DFTgX@ep-crimson-dust-aofjvsj8-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
});