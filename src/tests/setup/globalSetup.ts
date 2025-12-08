import { db } from '../../db/connection.ts';
import { users, habits, entries, tags, habitTags } from '../../db/schema.ts';
import { sql } from 'drizzle-orm';
import { execSync } from 'child_process';

export default async function setup() {
  console.log('🐌 Setting up the test db')
  // Reset the database
  try {
    await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${tags} CASCADE`)
    await db.execute(sql`DROP TABLE IF EXISTS ${habitTags} CASCADE`)
    console.log('✅ Tables dropped successfully')

    // Recreate the database schema
    execSync(
      `npx drizzle-kit push --url="${process.env.DATABASE_URL}" --schema="./src/db/schema.ts" --dialect="postgresql"`,
      {
        stdio: 'inherit',
        cwd: process.cwd(),
      },
    )
    console.log('✅ Database schema recreated successfully')
  } catch (error) {
    console.error('❌ Failed to setup test database:', error)
    throw error
  }
  return async () => {
    console.log('🧹 Tearing down test database...')

    try {
      // Final cleanup - drop all test data
      await db.execute(sql`DROP TABLE IF EXISTS ${entries} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${habits} CASCADE`)
      await db.execute(sql`DROP TABLE IF EXISTS ${users} CASCADE`)

      console.log('✅ Test database teardown complete')
      process.exit(0)
    } catch (error) {
      console.error('❌ Failed to teardown test database:', error)
      throw error
    }
  }
}