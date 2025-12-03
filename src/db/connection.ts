import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema.ts'
import { env, isProd } from '../../env.ts'
import { remember } from '@epic-web/remember'

// Create a singleton database connection pool
const createPool = () => {
  return new Pool({
    connectionString: env.DATABASE_URL,
  })
}

let client

if (isProd()) {
  client = createPool()
} else {
  client = remember('pgPool', () => createPool())
}

export const db = drizzle({ client, schema })
export default db