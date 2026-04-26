import { NextRequest, NextResponse } from 'next/server';
import { getStore, userSafe } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { user, error } = requireAuth(req);
  if (error) return error;
  const { id } = await params;
  const { items, users, nextId } = getStore();
  const item = items.find(i => i._id === id);
  if (!item) return NextResponse.json({ message: 'Item not found.' }, { status: 404 });
  if (item.status !== 'open') return NextResponse.json({ message: 'Item is not open.' }, { status: 400 });

  item.status = 'claimed';
  item.claimedBy = user!._id;
  user!.xp += 5;

  const reporter = users.find(u => u._id === item.reportedBy._id);
  if (reporter && reporter._id !== user!._id) {
    reporter.notifications = reporter.notifications || [];
    reporter.notifications.unshift({
      _id: `notif_${nextId()}`, type: 'item_claimed',
      title: '📞 Someone wants to Handover!',
      body: `${user!.name} is contacting you regarding "${item.title}".`,
      read: false, createdAt: new Date(),
    });
  }
  return NextResponse.json({ message: `Item returned! +${item.xpReward} XP ⚡`, item, user: userSafe(user!) });
}
