import { NextRequest, NextResponse } from 'next/server';
import { userSafe } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;
  return NextResponse.json({ ok: true, data: { user: userSafe(user!) } });
}

export async function PATCH(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;
  const { profilePic } = await req.json();
  if (!profilePic) return NextResponse.json({ message: 'URL required.' }, { status: 400 });
  user!.profilePic = profilePic;
  return NextResponse.json({ message: 'Profile picture updated! ⚡', user: userSafe(user!) });
}
