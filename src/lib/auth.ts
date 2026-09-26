import { cookies } from 'next/headers'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const SESSION_COOKIE_NAME = 'bellaselecta_admin_token'

export async function loginUser(email: string, passwordPlain: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return { success: false, error: 'Credenziali non valide' }
  }

  const isValid = await bcrypt.compare(passwordPlain, user.passwordHash)
  if (!isValid) {
    return { success: false, error: 'Credenziali non valide' }
  }

  // Set session cookie (store encrypted / tokenized user ID)
  // In development/local, we use base64 encoded token with timestamp
  const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, time: Date.now() })).toString('base64')
  
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return { success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
}

export async function logoutUser() {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

export async function getSessionUser() {
  const cookieStore = cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    if (!data.id) return null

    const user = await prisma.user.findUnique({
      where: { id: data.id },
      select: { id: true, email: true, name: true, role: true },
    })

    return user
  } catch (err) {
    return null
  }
}
