import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getStore } from '@/lib/store';
import { genToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const { users } = getStore();
    const user = users.find(u => u.email === email);
    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json({ message: 'Invalid email or password.' }, { status: 401 });
    }
    if (!user.isActive) return NextResponse.json({ message: 'Account suspended. Contact admin.' }, { status: 403 });

    const { userSafe } = await import('@/lib/store');
    return NextResponse.json({ message: 'Login successful!', token: genToken(user._id), user: userSafe(user) });
  } catch {
    return NextResponse.json({ message: 'Server error.' }, { status: 500 });
  }
}
