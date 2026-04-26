import { NextRequest, NextResponse } from 'next/server';
import { getStore } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { user, error } = requireAdmin(req);
  if (error) return error;
  const { title, body, pinned } = await req.json();
  if (!title || !body) return NextResponse.json({ message: 'Title and body required.' }, { status: 400 });
  const { users, announcements, nextId } = getStore();
  const ann = { _id: `ann_${nextId()}`, title, body, from: user!.name, createdAt: new Date(), pinned: !!pinned };
  announcements.unshift(ann);
  users.filter(u => u.role === 'student').forEach(u => {
    u.notifications = u.notifications || [];
    u.notifications.unshift({ _id: `notif_${nextId()}`, type: 'announcement', title: `📢 ${title}`, body, read: false, createdAt: new Date() });
  });
  return NextResponse.json({ message: 'Announcement sent!', announcement: ann }, { status: 201 });
}
