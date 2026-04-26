import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;
  const { items } = getStore();
  return NextResponse.json(items);
}
