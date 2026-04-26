import bcrypt from 'bcryptjs';

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
export const ACHIEVEMENTS = [
  { id: 'first_report', name: 'First Steps', desc: 'Submit your first report', icon: '🔍', xp: 20 },
  { id: 'first_return', name: 'Good Samaritan', desc: 'Return your first item', icon: '🤝', xp: 50 },
  { id: 'five_reports', name: 'Active Trainer', desc: 'Submit 5 reports', icon: '⭐', xp: 75 },
  { id: 'ten_returns', name: 'Campus Hero', desc: 'Return 10 items', icon: '🏆', xp: 200 },
  { id: 'legendary_find', name: 'Legendary Finder', desc: 'Return a LEGENDARY rarity item', icon: '💎', xp: 300 },
  { id: 'speed_return', name: 'Speed Runner', desc: 'Return an item within 1 hour of it being reported', icon: '⚡', xp: 100 },
  { id: 'joined', name: 'Welcome FINDLY!', desc: 'Joined FINDLY', icon: '🎮', xp: 10 },
];

export const rarityMap: Record<string, string> = {
  'Electronics': 'RARE', 'ID/Wallets': 'LEGENDARY', 'Books': 'UNCOMMON',
  'Bags': 'UNCOMMON', 'Keys': 'RARE', 'Clothing': 'COMMON', 'Other': 'COMMON',
};
export const xpMap: Record<string, number> = { 'LEGENDARY': 200, 'RARE': 150, 'UNCOMMON': 100, 'COMMON': 50 };
export const calcLevel = (xp: number) => Math.floor(xp / 100) + 1;

// ─── TYPES ───────────────────────────────────────────────────────────────────
export interface UserRecord {
  _id: string; name: string; email: string; password: string; role: string;
  enrollmentNo: string | null; phone: string; branch: string; year: string;
  xp: number; level: number; itemsReported: number; itemsReturned: number;
  achievements: string[]; isActive: boolean; notifications: Notification[];
  profilePic?: string; createdAt: Date;
}
export interface ItemRecord {
  _id: string; title: string; description: string; category: string;
  type: string; status: string; location: string; rarity: string;
  xpReward: number; confidence: number; aiTags: string[];
  reportedBy: { _id: string; name: string }; image: string;
  claimedBy: string | null; contactInfo: string; createdAt: Date;
}
export interface Notification {
  _id: string; type: string; title: string; body: string;
  read: boolean; createdAt: Date; itemId?: string;
}

// ─── GLOBAL SINGLETON STORE ───────────────────────────────────────────────────
// Using globalThis so it persists across hot-reloads in dev AND across serverless invocations in the same instance
declare global {
  // eslint-disable-next-line no-var
  var __findly_users: UserRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __findly_items: ItemRecord[] | undefined;
  // eslint-disable-next-line no-var
  var __findly_announcements: { _id: string; title: string; body: string; from: string; createdAt: Date; pinned: boolean }[] | undefined;
  // eslint-disable-next-line no-var
  var __findly_counter: number | undefined;
}

function initUsers(): UserRecord[] {
  return [
    {
      _id: 'admin1', name: 'Dr. Rajnish Pandey', email: 'admin@niet.co.in',
      password: bcrypt.hashSync('admin123', 10), role: 'admin',
      enrollmentNo: null, phone: '7991885976', branch: 'Admin', year: '',
      xp: 9999, level: 99, itemsReported: 4, itemsReturned: 0,
      achievements: ['joined'], isActive: true, notifications: [], createdAt: new Date(),
    },
    {
      _id: 'user1', name: 'Prashant Pandey', email: '0251csai125@niet.co.in',
      password: bcrypt.hashSync('ANURAG', 10), role: 'student',
      enrollmentNo: '2201234', phone: '7991885976', branch: 'CSE AI', year: '3rd',
      xp: 450, level: 5, itemsReported: 2, itemsReturned: 1,
      achievements: ['joined', 'first_report'], isActive: true, notifications: [], createdAt: new Date(),
    },
    {
      _id: 'user2', name: 'Manvi Varshney', email: '0251csai253@niet.co.in',
      password: bcrypt.hashSync('MANVI08', 10), role: 'student',
      enrollmentNo: '2201567', phone: '8533016764', branch: 'CSE AI', year: '2nd',
      xp: 120, level: 2, itemsReported: 1, itemsReturned: 0,
      achievements: ['joined'], isActive: true, notifications: [], createdAt: new Date(),
    },
  ];
}

function initItems(): ItemRecord[] {
  return [
    { _id: 'item1', title: 'Blue College ID Card', description: 'NIET student ID card, light blue with red lanyard attached.', category: 'ID/Wallets', type: 'lost', status: 'open', location: 'Main Cafeteria', rarity: 'LEGENDARY', xpReward: 200, confidence: 98, aiTags: ['ID Card', 'Blue', 'NIET'], reportedBy: { _id: 'user1', name: 'Prashant Pandey' }, image: '/images/id_card.png', claimedBy: null, contactInfo: '7991885976', createdAt: new Date(Date.now() - 2 * 3600000) },
    { _id: 'item2', title: 'White AirPods Pro', description: 'Apple AirPods Pro (2nd gen) in white case. Left earbud missing rubber tip.', category: 'Electronics', type: 'found', status: 'open', location: 'Computer Lab 3 (Block B)', rarity: 'RARE', xpReward: 150, confidence: 85, aiTags: ['Apple', 'White', 'AirPods'], reportedBy: { _id: 'user2', name: 'Manvi Varshney' }, image: '/images/airpods.png', claimedBy: null, contactInfo: '8533016764', createdAt: new Date(Date.now() - 5 * 3600000) },
    { _id: 'item3', title: 'Physics Textbook (HCV Vol. 2)', description: 'HC Verma Concepts of Physics Vol 2. Yellow sticky notes inside.', category: 'Books', type: 'lost', status: 'open', location: 'Central Library (Section C)', rarity: 'UNCOMMON', xpReward: 100, confidence: 92, aiTags: ['HCV', 'Physics', 'Textbook'], reportedBy: { _id: 'admin1', name: 'Dr. Rajnish Pandey' }, image: '/images/textbook.png', claimedBy: null, contactInfo: '7991885976', createdAt: new Date(Date.now() - 24 * 3600000) },
    { _id: 'item4', title: 'Black Puma Backpack', description: 'Black Puma backpack with red zip. MacBook sticker on laptop compartment.', category: 'Bags', type: 'lost', status: 'open', location: 'Student Union Hall', rarity: 'UNCOMMON', xpReward: 100, confidence: 78, aiTags: ['Puma', 'Black', 'Backpack'], reportedBy: { _id: 'user1', name: 'Prashant Pandey' }, image: '/images/backpack.png', claimedBy: null, contactInfo: '7991885976', createdAt: new Date(Date.now() - 72 * 3600000) },
  ];
}

if (!global.__findly_users) global.__findly_users = initUsers();
if (!global.__findly_items) global.__findly_items = initItems();
if (!global.__findly_announcements) global.__findly_announcements = [];
if (!global.__findly_counter) global.__findly_counter = 100;

export const getStore = () => ({
  users: global.__findly_users!,
  items: global.__findly_items!,
  announcements: global.__findly_announcements!,
  nextId: () => `${++global.__findly_counter!}`,
});

export const userSafe = (u: UserRecord) => ({
  id: u._id, name: u.name, email: u.email, enrollmentNo: u.enrollmentNo,
  role: u.role, xp: u.xp, level: calcLevel(u.xp), branch: u.branch, year: u.year,
  achievements: u.achievements, notifications: u.notifications || [],
  profilePic: u.profilePic || '', itemsReported: u.itemsReported, itemsReturned: u.itemsReturned,
  phone: u.phone,
});

export const grantAchievement = (user: UserRecord, achievementId: string, nextId: () => string) => {
  if (!user.achievements.includes(achievementId)) {
    user.achievements.push(achievementId);
    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (ach) {
      user.xp += ach.xp;
      user.notifications = user.notifications || [];
      user.notifications.unshift({
        _id: `notif_${nextId()}`, type: 'achievement',
        title: `Achievement Unlocked! ${ach.icon}`,
        body: `"${ach.name}" — ${ach.desc}. +${ach.xp} XP awarded!`,
        read: false, createdAt: new Date(),
      });
    }
  }
};
