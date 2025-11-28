import { Router } from "express";
const router = Router();

// Example auth route - login
router.post('/register', (req, res) => {
  res.status(201).json({ message: 'User registered successfully! (V1)' })
})

router.post('/login', (req, res) => {
  res.status(201).json({ message: 'User logged in successfully! (V1)' })
})

export default router