import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;
  if (user!.notifications) user!.notifications.forEach(n => n.read = true);
  return NextResponse.json({ message: 'All notifications marked read.' });
}
