import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  const { items } = getStore();
  const item = items.find(i => i._id === id);
  if (!item) return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  const { status } = await req.json();
  item.status = status;
  return NextResponse.json({ message: 'Status updated.', item });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  const { items } = getStore();
  const idx = items.findIndex(i => i._id === id);
  if (idx !== -1) items.splice(idx, 1);
  return NextResponse.json({ message: 'Item deleted.' });
}
