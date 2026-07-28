import { env } from '#/lib/env'
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: ['.env.local', '.env'] })

export default defineConfig({
  out: './drizzle',
  schema: './src/server/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
