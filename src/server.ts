import express from 'express'
import authRoutes from './routes/authRoutes.ts'
import userRoutes from './routes/userRoutes.ts'
import habitRoutes from './routes/habitRoutes.ts'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { isTest } from '../env.ts'
import { errorHandler } from './middleware/errorHandler.ts'


// Middleware to parse JSON bodies
const app = express()
app.use(express.json()) // Built-in middleware
app.use(express.urlencoded({ extended: true })) // For parsing application/x-www-form-urlencoded

// Security and logging middleware
app.use(cors()) // Enable CORS
app.use(helmet()) // Secure HTTP headers
app.use(morgan('dev', {
  skip: () => isTest(),   // Skip logging during tests
})) // HTTP request logging middleware

// Mount the route handlers
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/habits', habitRoutes)
 

// Health check endpoint - always good to have!
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Habit Tracker API',
  })

})
app.use(errorHandler)

// Export the app for use in other modules (like tests)
export { app }

// Default export for convenience
export default app
