import { Router } from "express";
import { register, login } from "../controllers/authController.ts";
import { validateBody } from '../middleware/validation.ts';
const router = Router();
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(6, 'Password is required'),
});

// Example auth route - login
router.post('/register', register)

router.post('/login', validateBody(loginSchema), login)

export default router