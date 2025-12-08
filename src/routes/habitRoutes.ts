import { Router } from "express";
import { validateBody } from '../middleware/validation.ts';
import { z } from 'zod';
import { authenticateToken } from "../middleware/auth.ts";
import { createHabit, getUserHabits, updateHabit } from "../controllers/habitController.ts";

const createHabitSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  frequency: z.string(),
  targetCount: z.number(),
  tagIds: z.array(z.string()).optional(),
});


const completeParamsSchema = z.object({
    id: z.string().max(3)
});

const router = Router()

router.use(authenticateToken);

// Example auth route - login
router.get('/', getUserHabits)

router.patch(`/:id`, updateHabit)

router.get('/:id', (req, res) => {
  const { id } = req.params
  res.json({ message: `Habit details for ID: ${id}` })
})

router.post('/', validateBody(createHabitSchema), createHabit)

router.delete('/:id', (req, res) => {
  const { id } = req.params
  res.json({ message: `Habit with ID: ${id} deleted successfully!` })
})

router.post('/:id/complete', (req, res) => {
  const { id } = req.params
  res.json({ message: `Habit with ID: ${id} marked as complete!` })
})

export default router
