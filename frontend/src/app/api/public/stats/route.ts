import { NextResponse } from 'next/server';
import { getStore, calcLevel } from '@/lib/store';

export async function GET() {
  const { users, items, announcements } = getStore();
  const students = users.filter(u => u.role === 'student');
  return NextResponse.json({
    totalUsers: students.length,
    totalItems: items.length,
    openItems: items.filter(i => i.status === 'open').length,
    returnedItems: items.filter(i => i.status === 'returned').length,
    topTrainers: [...students].sort((a, b) => b.xp - a.xp).slice(0, 5).map(u => ({
      id: u._id, name: u.name, xp: u.xp, level: calcLevel(u.xp),
      branch: u.branch, itemsReturned: u.itemsReturned,
    })),
    announcements: announcements.filter(a => a.pinned).slice(0, 3),
  });
}
