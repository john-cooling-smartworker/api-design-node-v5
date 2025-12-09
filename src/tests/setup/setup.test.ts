import { createTestUser, createTestHabit, cleanupDatabase, } from "../helpers/dbHelpers.ts";
// import { describe, it, expect } from "vitest";

describe("Test Setup", () => {
test("should create a test user", async () => {
  const { user, token } = await createTestUser();
  console.log(`back from test user create ${JSON.stringify(user)}`);

  expect(user).toBeDefined();
  expect(token).toBeDefined();
  await cleanupDatabase
  })
})
