import { NextRequest, NextResponse } from 'next/server';
import { getStore, userSafe, grantAchievement, rarityMap, xpMap } from '@/lib/store';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const { items, users } = getStore();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  const category = searchParams.get('category');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const location = searchParams.get('location');
  const date = searchParams.get('date');

  let result = items.map(item => {
    const reporter = users.find(u => u._id === item.reportedBy?._id);
    return reporter ? { ...item, contactInfo: reporter.phone } : item;
  });

  if (type) result = result.filter(i => i.type === type);
  if (category) result = result.filter(i => i.category === category);
  if (status) result = result.filter(i => i.status === status);
  if (location) result = result.filter(i => i.location === location);

  if (date) {
    const now = new Date();
    const todayStr = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();
    result = result.filter(i => {
      const created = new Date(i.createdAt);
      const createdStr = created.toDateString();
      if (date === 'today') return createdStr === todayStr;
      if (date === 'yesterday') return createdStr === yesterdayStr;
      const diffDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
      if (date === 'week') return diffDays < 7;
      if (date === 'month') return diffDays < 30;
      return true;
    });
  }

  if (search) result = result.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase()) ||
    (i.aiTags && i.aiTags.some(t => t.toLowerCase().includes(search.toLowerCase())))
  );

  return NextResponse.json(result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
}

export async function POST(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;

  const { title, description, category, type, location, contactInfo, aiTags, image } = await req.json();
  if (!title || !description || !category || !type || !location) {
    return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
  }

  const { items, users, nextId } = getStore();
  const rarity = rarityMap[category] || 'COMMON';
  const id = `item_${nextId()}`;
  const item = {
    _id: id, title, description, category, type, status: 'open', location,
    rarity, xpReward: xpMap[rarity], confidence: Math.floor(Math.random() * 20) + 78,
    aiTags: aiTags || [], reportedBy: { _id: user!._id, name: user!.name },
    image: image || '', contactInfo: contactInfo || user!.phone || '', claimedBy: null, createdAt: new Date(),
  };
  items.push(item);
  user!.xp += 10; user!.itemsReported++;

  // Match & Notify
  const potentialMatches = items.filter(i =>
    i._id !== item._id && i.type !== item.type && i.status === 'open' &&
    (i.category === item.category || i.title.toLowerCase().split(' ').some(word => item.title.toLowerCase().includes(word)))
  );
  potentialMatches.forEach(match => {
    const owner = users.find(u => u._id === match.reportedBy._id);
    if (owner && owner._id !== user!._id) {
      owner.notifications = owner.notifications || [];
      const msg = item.type === 'found'
        ? `Someone found an item that might be your lost "${match.title}"!`
        : `Someone lost an item that matches the "${match.title}" you found!`;
      owner.notifications.unshift({ _id: `notif_${nextId()}`, type: 'match', title: '✨ Potential Match Found!', body: msg, itemId: item._id, read: false, createdAt: new Date() });
    }
  });

  if (user!.itemsReported === 1) grantAchievement(user!, 'first_report', nextId);
  if (user!.itemsReported === 5) grantAchievement(user!, 'five_reports', nextId);

  return NextResponse.json({ message: `Item reported! +10 XP ⚡`, item, user: userSafe(user!) }, { status: 201 });
}
