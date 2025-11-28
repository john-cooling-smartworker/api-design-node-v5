import { Router } from "express";
import { validateBody } from '../middleware/validation.ts';
import { z } from 'zod';
const router = Router();
const createHabitSchema = z.object({
      name: z.string(),
  })


// Example auth route - login
router.get('/', (req, res) => {
  res.json({ message: 'Habit route is working!' })
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  res.json({ message: `Habit details for ID: ${id}` })
})

router.post('/', validateBody(createHabitSchema), (req, res) => {
  res.status(201).json({ message: 'Habit created successfully!' })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  res.json({ message: `Habit with ID: ${id} deleted successfully!` })
})

router.post('/:id/complete', (req, res) => {
  const { id } = req.params
  res.json({ message: `Habit with ID: ${id} marked as complete!` })
})

export default router
