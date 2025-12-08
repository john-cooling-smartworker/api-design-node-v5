import { SignJWT, jwtVerify, decodeJwt, type JWTPayload } from 'jose'
import env from '../../env.ts'
import { createSecretKey } from 'crypto'

export interface JwtPayload extends JWTPayload {
  id: string
  email: string
  username: string
}

export const generateToken = async (payload: JwtPayload) => {
  const secret = env.JWT_SECRET
  const secretKey = createSecretKey(secret, 'utf-8')

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256'  })
    .setIssuedAt()
    .setExpirationTime(env.JWT_EXPIRES_IN || '7d')
    .sign(secretKey)

}

// Existing generateToken function...

export const verifyToken = async (token: string): Promise<JwtPayload> => {
  const secretKey = createSecretKey(env.JWT_SECRET, 'utf-8')
  const { payload } = await jwtVerify(token, secretKey)

  return {
    id: payload.id as string,
    email: payload.email as string,
    username: payload.username as string,
  }
}
