import { NextRequest, NextResponse } from 'next/server';
import { getStore, calcLevel } from '@/lib/store';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;
  const { users } = getStore();
  return NextResponse.json(users.filter(u => u.role === 'student').map(u => ({
    _id: u._id, name: u.name, email: u.email, enrollmentNo: u.enrollmentNo,
    phone: u.phone, branch: u.branch, year: u.year, xp: u.xp,
    level: calcLevel(u.xp), itemsReported: u.itemsReported, itemsReturned: u.itemsReturned,
    achievements: u.achievements, isActive: u.isActive, createdAt: u.createdAt,
  })));
}
