import { NextRequest, NextResponse } from 'next/server';
import { getStore, userSafe } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = requireAdmin(req);
  if (error) return error;
  const { id } = await params;
  const { users, nextId } = getStore();
  const { xp, reason } = await req.json();
  const user = users.find(u => u._id === id);
  if (!user) return NextResponse.json({ message: 'User not found.' }, { status: 404 });
  user.xp += Number(xp);
  user.notifications = user.notifications || [];
  user.notifications.unshift({ _id: `notif_${nextId()}`, type: 'xp_award', title: `⚡ +${xp} XP Awarded!`, body: reason || 'XP awarded by admin.', read: false, createdAt: new Date() });
  return NextResponse.json({ message: `Awarded +${xp} XP to ${user.name}.`, user: userSafe(user) });
}
