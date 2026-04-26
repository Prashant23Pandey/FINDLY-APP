import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;
  const { items } = getStore();
  const myItems = items
    .filter(i => i.reportedBy._id === user!._id)
    .map(item => ({ ...item, contactInfo: user!.phone }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(myItems);
}
