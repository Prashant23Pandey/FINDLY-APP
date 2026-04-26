import { NextRequest, NextResponse } from 'next/server';
import { getStore, userSafe } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  const { users, nextId } = getStore();
  const user = users.find(u => u._id === id);
  if (!user) return NextResponse.json({ message: 'User not found.' }, { status: 404 });
  user.isActive = !user.isActive;
  if (!user.isActive) {
    user.notifications = user.notifications || [];
    user.notifications.unshift({ _id: `notif_${nextId()}`, type: 'warning', title: '⚠️ Account Suspended', body: 'Your account has been suspended by admin.', read: false, createdAt: new Date() });
  }
  return NextResponse.json({ message: `User ${user.isActive ? 'activated' : 'suspended'}.`, user: { _id: user._id, isActive: user.isActive } });
}
