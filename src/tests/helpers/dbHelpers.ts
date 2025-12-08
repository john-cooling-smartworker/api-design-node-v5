import { db } from '../../../src/db/connection.ts'
import { users, habits, entries, habitTags, type NewUser, type NewHabit } from '../../../src/db/schema.ts'
import { hashPassword } from '../../../src/utils/passwords.ts'
import { generateToken } from '../../../src/utils/jwt.ts'

export const createTestUser = async (userData: Partial<NewUser> = {}) => {
  console.log('Creating test user with data:', userData);
  const defaultData = {
    email: `test-${Date.now()}-${Math.random()}@example.com`,
    username: `testuser-${Date.now()}-${Math.random()}`,
    password: 'TestPassword123!',
    firstname: 'Test',
    lastname: 'User',
    ...userData,
  }

  const hashedPassword = await hashPassword(defaultData.password)
  const [user] = await db
    .insert(users)
    .values({
      ...defaultData,
      password: hashedPassword,
    })
    .returning()

  const token = await generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  })

  return { user, token, rawPassword: defaultData.password }
}

export const createTestHabit = async (
  userId: string,
  habitData: Partial<NewHabit> = {}
) => {
    const defaultData = {
      name: `Test Habit ${Date.now()}`,
      description: 'A test habit',
      frequency: 'daily',
      targetCount: 1,
      ...habitData,
    }

  const [habit] = await db
    .insert(habits)
    .values({
      userId,
      ...defaultData,
    })
    .returning()

  return habit
}

export const cleanupDatabase = async () =>  {
  // Clean up in the right order due to foreign key constraints
  await db.delete(entries)
  await db.delete(habits)
  await db.delete(users)
  await db.delete(habitTags)
}
