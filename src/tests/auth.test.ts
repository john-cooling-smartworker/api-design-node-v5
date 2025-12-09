import request  from "supertest";
import app from "../../src/server.ts";
import env from "../../env.ts";
import { afterEach } from 'vitest'
import { createTestUser, createTestHabit, cleanupDatabase } from "./helpers/dbHelpers.ts";

describe("Authentication Endpoints", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  describe("POST api/v1/auth/register", () => {
    it("should register a new user", async () => {
      const userData = {
        email: "testemail@test.com",
        username: "testuser",
        password: "TestPassword123!",
        firstname: "Brig",
        lastname: "Smith"
      }
      console.log(JSON.stringify(userData));
      const response = await request(app)
        .post("/api/v1/auth/register")
        .send(userData)
        .expect(201)

      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect
      expect(response.body.user).not.toHaveProperty('password')
    })
  })
  describe("POST api/v1/auth/login", () => {
    it("should login an existing user", async () => {
      const testUser = await createTestUser();

      const credentials = {
        email: testUser.user.email,
        password: testUser.rawPassword
      };

      const response = await request(app)
        .post("/api/v1/auth/login")
        .send(credentials)
        .expect(201);

      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("user");
      expect(response.body).toHaveProperty("token");
      expect(response.body.user).not.toHaveProperty('password');
    });
  });
})