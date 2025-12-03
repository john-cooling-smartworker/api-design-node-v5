import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { db } from '../db/connection.ts'
import { users, type NewUser } from '../db/schema.ts'
import { generateToken } from '../utils/jwt.ts'
import { comparePasswords, hashPassword } from '../utils/passwords.ts'
import { create } from 'domain'
import { eq } from 'drizzle-orm'


export const register = async (
  req: Request<any, any, NewUser>,
  res: Response
) => {
  try {
    // const { username, email, password, firstname, lastname } = req.body
    const hashedPassword = await hashPassword(req.body.password)

    const [user] = await db
      .insert(users)
      .values({
      ...req.body,
      password: hashedPassword,
    })
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstname: users.firstname,
        lastname: users.lastname,
        createdAt: users.createdAt,
      })

    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    return res.status(201).json({
      message: 'User created',
      user,
      token
    })

} catch (e) {
  res.status(500).json({ error: 'Internal server error, Failed to create user, try again later' })
  console.log('Error during registration:', e)
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    // Verify password
    const isValidPassword = await comparePasswords(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = await generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    })
    return  res.status(201).json({
      message: 'User logged in successfully!',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    console.log('Error during login:', error)
    res.status(500).json({ error: 'Internal server error, Failed to login, try again later' })

  }
}