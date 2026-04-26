import { NextRequest, NextResponse } from 'next/server';
import { getStore, calcLevel } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;
  const { users, items, announcements } = getStore();
  const students = users.filter(u => u.role === 'student');
  return NextResponse.json({
    totalUsers: students.length, totalItems: items.length,
    openItems: items.filter(i => i.status === 'open').length,
    returnedItems: items.filter(i => i.status === 'returned').length,
    lostItems: items.filter(i => i.type === 'lost').length,
    foundItems: items.filter(i => i.type === 'found').length,
    recentItems: [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8),
    topTrainers: [...students].sort((a, b) => b.xp - a.xp).slice(0, 5).map(u => ({
      _id: u._id, name: u.name, enrollmentNo: u.enrollmentNo, xp: u.xp,
      level: calcLevel(u.xp), branch: u.branch, itemsReturned: u.itemsReturned,
    })),
    announcements,
  });
}
