import { NextRequest, NextResponse } from 'next/server';
import { getStore, userSafe } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { items, users } = getStore();
  const item = items.find(i => i._id === id);
  if (!item) return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  const reporter = users.find(u => u._id === item.reportedBy?._id);
  return NextResponse.json(reporter ? { ...item, contactInfo: reporter.phone } : item);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = requireAuth(req);
  if (error) return error;
  const { id } = await params;
  const { items } = getStore();
  const idx = items.findIndex(i => i._id === id);
  if (idx === -1) return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  if (items[idx].reportedBy._id !== user!._id && user!.role !== 'admin') {
    return NextResponse.json({ message: 'Not authorised.' }, { status: 403 });
  }
  items.splice(idx, 1);
  return NextResponse.json({ message: 'Item deleted.' });
}
