import { db } from './connection.ts'
import { users, habits, entries, tags, habitTags } from './schema.ts'
// import { hashPassword } from '../utils/auth.ts'

async function seed() {
  console.log('Start Seeding database...')

  // Clear existing data
  try {
    console.log('Clearing existing data...')
    await db.delete(entries) // Delete entries first due to foreign key constraints
    await db.delete(habitTags)
    await db.delete(habits)
    await db.delete(tags)
    await db.delete(users)

    // Insert sample users
    console.log('Inserting sample users...')
    const [demoUser] = await db.insert(users).values({
      email: 'demo@habittracker.com',
      password: 'password',
      username: 'demouser',
      firstname: 'James',
      lastname: 'Walton',
    })
      .returning();

    console.log('Creating Tags...')
    const [healthTag] = await db.insert(tags).values({
      name: 'Health',
      color: '#34D399',
    })
      .returning();

    console.log('Creating demo habits...')
    const [exerciseHabit] = await db
      .insert(habits)
      .values({
      userId: demoUser.id,
      name: 'Exercise',
      description: 'Workout for at least 30 minutes',
      frequency: 'Weekly',
      targetCount: 1, // e.g., 1 time per day
    })
      .returning();

    console.log('Linking Tags to Habits...')
    await db.insert(habitTags).values({
      habitId: exerciseHabit.id,
      tagId: healthTag.id,
    })
    console.log('Seeding completed successfully.')
    console.log('Adding completion entries...')

    const today = new Date();
    today.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      await db.insert(entries).values({
        habitId: exerciseHabit.id,
        completion_date: date,
        notes: `Completed exercise on day ${i}`,
      });

    }
    console.log('✅ DB Seeded Successfully!')
    console.log('Your user credentials are:')
    console.log(`username: ${demoUser.username}`)
    console.log(`email: ${demoUser.email}`)
    console.log(`password: ${demoUser.password}`)

  } catch (e) {
    console.error('❌ Error seeding database:', e)
    process.exit(1)

  }


}
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error)
      process.exit(1)
  })
}
export default seed
