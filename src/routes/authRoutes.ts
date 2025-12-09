import { Router } from "express";
import { register, login } from "../controllers/authController.ts";
import { validateBody } from '../middleware/validation.ts';

import { z } from 'zod';
import { insertUserSchema } from "../db/schema.ts";

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password is required'),
});

const router = Router();


// Example auth route - login
router.post('/register', validateBody(insertUserSchema), register)

router.post('/login', validateBody(loginSchema), login)

export default router