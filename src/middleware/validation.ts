import type { Request, Response, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'

// Middleware to validate that required fields are present in the request body

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData // Replace req.body with the validated data for downstream handlers
      next() // Proceed to the next middleware or route handler
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid request body',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e) // Pass unexpected errors to the error handler
    }
  }
}
// Middleware to validate that required fields are present in the request params
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next() // Proceed to the next middleware or route handler
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid request params',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e) // Pass unexpected errors to the error handler
    }
  }
}

// Middleware to validate that required fields are present in the request query parameters
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next() // Proceed to the next middleware or route handler
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid request query parameters',
          details: e.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        })
      }
      next(e) // Pass unexpected errors to the error handler
    }
  }
}