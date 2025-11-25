import express from 'express'

// Create Express application
const app = express()

// Health check endpoint - always good to have!
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Habit Tracker API',
  })
  
})

// Export the app for use in other modules (like tests)
export { app }

// Default export for convenience
export default app
