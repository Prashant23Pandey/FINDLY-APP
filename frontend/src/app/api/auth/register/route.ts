import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getStore, userSafe } from '@/lib/store';
import { genToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, enrollmentNo, phone, branch, year, adminCode } = await req.json();
    if (!name || !email || !password) return NextResponse.json({ message: 'Name, email and password required.' }, { status: 400 });

    const { users, nextId } = getStore();
    if (users.find(u => u.email === email)) return NextResponse.json({ message: 'Email already registered.' }, { status: 409 });
    if (enrollmentNo && users.find(u => u.enrollmentNo === enrollmentNo)) return NextResponse.json({ message: 'Enrollment No. already registered.' }, { status: 409 });

    const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE || 'NIET_ADMIN_2024';
    let role = 'student';
    if (adminCode) {
      if (adminCode !== ADMIN_CODE) return NextResponse.json({ message: 'Invalid admin code.' }, { status: 403 });
      role = 'admin';
    }

    const hashed = await bcrypt.hash(password, 10);
    const id = `user_${nextId()}`;
    const user = {
      _id: id, name, email, password: hashed, enrollmentNo: enrollmentNo || null,
      phone: phone || '', branch: branch || '', year: year || '', role,
      xp: 10, level: 1, itemsReported: 0, itemsReturned: 0,
      achievements: ['joined'], isActive: true,
      notifications: [{ _id: `notif_${nextId()}`, type: 'welcome', title: '🎮 Welcome to FINDLY!', body: 'You earned +10 XP for joining!', read: false, createdAt: new Date() }],
      createdAt: new Date(),
    };
    users.push(user);
    return NextResponse.json({ message: 'Registration successful! +10 XP ⚡', token: genToken(id), user: userSafe(user) }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
