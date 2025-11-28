import { Router } from "express";
const router = Router();

// Example auth route - login
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Users route is working!' })
})

router.get('/:id', (req, res) => {
  const { id } = req.params
  res.status(200).json({ message: `User details for ID: ${id}` })
})

router.put('/:id', (req, res) => {
  const { id } = req.params
  res.status(200).json({ message: `User with ID: ${id} updated successfully!` })
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  res.status(200).json({ message: `User with ID: ${id} deleted successfully!` })
})  

export default router