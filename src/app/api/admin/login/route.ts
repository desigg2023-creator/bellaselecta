import { NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e password sono obbligatori' }, { status: 400 })
    }

    const res = await loginUser(email, password)
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: 401 })
    }

    return NextResponse.json({ success: true, user: res.user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 })
  }
}
