import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
} from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

const DEMO_EMAIL = process.env.DEMO_USER_EMAIL || 'demo@cashcollect.app';
const DEMO_PASSWORD = process.env.DEMO_USER_PASSWORD || 'demo2026';
const DEMO_ORG_ID = process.env.MCP_DEMO_ORGANIZATION_ID || 'org_demo_northstar_001';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 },
      );
    }

    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const token = createSessionToken(email, DEMO_ORG_ID);

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true, redirect: '/app' });
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 },
    );
  }
}
