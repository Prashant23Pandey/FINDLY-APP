import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getStore, UserRecord } from '@/lib/store';

const JWT_SECRET = process.env.JWT_SECRET || 'pokefind_secret';

export function getAuthUser(req: NextRequest): UserRecord | null {
  const auth = req.headers.get('authorization');
  if (!auth?.startsWith('Bearer ')) return null;
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET) as { id: string };
    const { users } = getStore();
    return users.find(u => u._id === decoded.id && u.isActive) || null;
  } catch { return null; }
}

export function requireAuth(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return { user: null, error: NextResponse.json({ message: 'No token.' }, { status: 401 }) };
  return { user, error: null };
}

export function requireAdmin(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error || !user) return { user: null, error: error || NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
  if (user.role !== 'admin') return { user: null, error: NextResponse.json({ message: 'Admin only.' }, { status: 403 }) };
  return { user, error: null };
}

export function genToken(id: string) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
}
