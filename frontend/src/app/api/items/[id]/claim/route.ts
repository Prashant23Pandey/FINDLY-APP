import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = requireAuth(req);
  if (error) return error;
  const { id } = await params;
  const { items, users, nextId } = getStore();
  const item = items.find(i => i._id === id);
  if (!item) return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  if (item.status !== 'open') return NextResponse.json({ message: 'Item is not available.' }, { status: 400 });
  if (item.reportedBy._id === user!._id) return NextResponse.json({ message: 'You cannot claim your own item.' }, { status: 400 });

  item.status = 'claimed';
  item.claimedBy = user!._id;
  const finder = users.find(u => u._id === item.reportedBy._id);
  if (finder) {
    finder.notifications = finder.notifications || [];
    finder.notifications.unshift({
      _id: `notif_${nextId()}`, type: 'warning', title: '👤 Someone is Claiming!',
      body: `${user!.name} (Enroll: ${user!.enrollmentNo}) says "${item.title}" belongs to them.`,
      read: false, createdAt: new Date(),
    });
  }
  return NextResponse.json({ message: 'Claim request sent!' });
}
