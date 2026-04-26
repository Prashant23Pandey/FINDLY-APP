const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true, parameterLimit: 100000 }));

// Error handler for JSON limits
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.too.large') {
    return res.status(413).json({ message: 'The image file is too large (max 100MB).' });
  }
  next(err);
});

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pokefind_secret';
const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE || 'NIET_ADMIN_2024';
const genToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

// ─── ACHIEVEMENTS DEFINITIONS ─────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: 'first_report', name: 'First Steps', desc: 'Submit your first report', icon: '', xp: 20 },
  { id: 'first_return', name: 'Good Samaritan', desc: 'Return your first item', icon: '', xp: 50 },
  { id: 'five_reports', name: 'Active Trainer', desc: 'Submit 5 reports', icon: '', xp: 75 },
  { id: 'ten_returns', name: 'Campus Hero', desc: 'Return 10 items', icon: '', xp: 200 },
  { id: 'legendary_find', name: 'Legendary Finder', desc: 'Return a LEGENDARY rarity item', icon: '', xp: 300 },
  { id: 'speed_return', name: 'Speed Runner', desc: 'Return an item within 1 hour of it being reported', icon: '', xp: 100 },
  { id: 'joined', name: 'Welcome FINDLY!', desc: 'Joined FINDLY', icon: '', xp: 10 },
];

// ─── IN-MEMORY STORE ──────────────────────────────────────────────────
let users = [
  {
    _id: 'admin1', name: 'Dr. Rajnish Pandey', email: 'admin@niet.co.in',
    password: bcrypt.hashSync('admin123', 10), role: 'admin',
    enrollmentNo: null, phone: '7991885976', branch: 'Admin', year: '',
    xp: 9999, level: 99, itemsReported: 4, itemsReturned: 0,
    achievements: ['joined'], isActive: true,
    notifications: [], createdAt: new Date(),
  },
  {
    _id: 'user2', name: 'Manvi Varshney', email: '0251csai253@niet.co.in',
    password: bcrypt.hashSync('MANVI08', 10), role: 'student',
    enrollmentNo: '2201567', phone: '8533016764', branch: 'CSE AI', year: '2nd',
    xp: 10, level: 1, itemsReported: 0, itemsReturned: 0,
    achievements: ['joined'], isActive: true,
    notifications: [], createdAt: new Date(),
  }
];

let items = [
  { _id: 'item1', title: 'Blue College ID Card', description: 'NIET student ID card, light blue with red lanyard attached. Has a photo and enroll number visible.', category: 'ID/Wallets', type: 'lost', status: 'open', location: 'Main Cafeteria', rarity: 'LEGENDARY', xpReward: 200, confidence: 98, aiTags: ['ID Card', 'Blue', 'NIET', 'Lanyard'], reportedBy: { _id: 'user1', name: 'Prashant Pandey' }, image: '/images/id_card.png', claimedBy: null, contactInfo: '7991885976', createdAt: new Date(Date.now() - 2 * 3600000) },
  { _id: 'item2', title: 'White AirPods Pro', description: 'Apple AirPods Pro (2nd gen) in white case. Left earbud missing rubber tip. Serial visible inside lid.', category: 'Electronics', type: 'found', status: 'open', location: 'Computer Lab 3 (Block B)', rarity: 'RARE', xpReward: 150, confidence: 85, aiTags: ['Apple', 'White', 'AirPods', 'Wireless'], reportedBy: { _id: 'user2', name: 'Manvi Varshney' }, image: '/images/airpods.png', claimedBy: null, contactInfo: '8533016764', createdAt: new Date(Date.now() - 5 * 3600000) },
  { _id: 'item3', title: 'Physics Textbook (HCV Vol. 2)', description: 'HC Verma Concepts of Physics Vol 2. Name written inside: Priya Singh, Roll No: 2201234. Yellow sticky notes inside.', category: 'Books', type: 'lost', status: 'open', location: 'Central Library (Section C)', rarity: 'UNCOMMON', xpReward: 100, confidence: 92, aiTags: ['HCV', 'Physics', 'Textbook', 'Book'], reportedBy: { _id: 'admin1', name: 'Dr. Rajnish Pandey' }, image: '/images/textbook.png', claimedBy: null, contactInfo: '7991885976', createdAt: new Date(Date.now() - 24 * 3600000) },
  { _id: 'item4', title: 'Black Puma Backpack', description: 'Black Puma backpack with red zip. Laptop compartment has a MacBook sticker. Side pocket has a water bottle holder.', category: 'Bags', type: 'lost', status: 'open', location: 'Student Union Hall', rarity: 'UNCOMMON', xpReward: 100, confidence: 78, aiTags: ['Puma', 'Black', 'Backpack', 'Laptop Bag'], reportedBy: { _id: 'user1', name: 'Prashant Pandey' }, image: '/images/backpack.png', claimedBy: null, contactInfo: '7991885976', createdAt: new Date(Date.now() - 72 * 3600000) },
  { _id: 'item5', title: 'AirPods', description: 'White AirPods in a white charging case. No visible scratches.', category: 'Electronics', type: 'found', status: 'open', location: 'Central Library (Section C)', rarity: 'RARE', xpReward: 150, confidence: 95, aiTags: ['AirPods', 'White', 'Case'], reportedBy: { _id: 'user1', name: 'Prashant Pandey' }, image: '/images/airpods_ai.png', claimedBy: null, contactInfo: '7991885976', createdAt: new Date(Date.now() - 30 * 60000) },
  { _id: 'item6', title: 'Black Umbrella', description: 'Found near the library, has a wooden handle.', category: 'Other', type: 'lost', status: 'open', location: 'Main Cafeteria', rarity: 'RARE', xpReward: 150, confidence: 88, aiTags: ['Umbrella', 'Black', 'Wood'], reportedBy: { _id: 'user1', name: 'Prashant Pandey' }, image: '/images/umbrella_ai.png', claimedBy: null, contactInfo: '7991885976', createdAt: new Date(Date.now() - 35 * 60000) },
].map(item => {
  const reporter = users.find(u => u._id === item.reportedBy._id);
  if (reporter) item.contactInfo = reporter.phone;
  return item;
});

let announcements = [];

let idCounter = 100;

// ─── HELPERS ──────────────────────────────────────────────────────────
const rarityMap = { 'Electronics': 'RARE', 'ID/Wallets': 'LEGENDARY', 'Books': 'UNCOMMON', 'Bags': 'UNCOMMON', 'Keys': 'RARE', 'Clothing': 'COMMON', 'Other': 'COMMON' };
const xpMap = { 'LEGENDARY': 200, 'RARE': 150, 'UNCOMMON': 100, 'COMMON': 50 };
const calcLevel = (xp) => Math.floor(xp / 100) + 1;

const userSafe = (u) => ({
  id: u._id, name: u.name, email: u.email, enrollmentNo: u.enrollmentNo,
  role: u.role, xp: u.xp, level: calcLevel(u.xp), branch: u.branch, year: u.year,
  achievements: u.achievements, notifications: u.notifications || [],
  profilePic: u.profilePic || '',
});

const grantAchievement = (user, achievementId, newNotif) => {
  if (!user.achievements.includes(achievementId)) {
    user.achievements.push(achievementId);
    const ach = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (ach) {
      user.xp += ach.xp;
      user.notifications = user.notifications || [];
      user.notifications.unshift({
        _id: `notif_${++idCounter}`,
        type: 'achievement',
        title: `Achievement Unlocked! ${ach.icon}`,
        body: `"${ach.name}" — ${ach.desc}. +${ach.xp} XP awarded!`,
        read: false,
        createdAt: new Date(),
      });
    }
  }
};

// ─── AUTH MIDDLEWARE ───────────────────────────────────────────────────
const protect = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token.' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = users.find(u => u._id === decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ message: 'User not found.' });
    req.user = user;
    next();
  } catch { res.status(401).json({ message: 'Invalid token.' }); }
};
const adminOnly = (req, res, next) => req.user?.role === 'admin' ? next() : res.status(403).json({ message: 'Admin only.' });

// ─── PUBLIC ROUTES ────────────────────────────────────────────────────

// Public leaderboard + stats
app.get('/api/public/stats', (req, res) => {
  const students = users.filter(u => u.role === 'student');
  res.json({
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
});

// Public items
app.get('/api/items', (req, res) => {
  const { type, category, status, search, location, date } = req.query;
  console.log(`[GET /api/items] Filters:`, { type, category, status, search, location });
  
  // Always link to the latest phone numbers from the users array
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
  res.json(result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.get('/api/items/my', protect, (req, res) => {
  const myItems = items.filter(i => i.reportedBy._id === req.user._id)
    .map(item => ({ ...item, contactInfo: req.user.phone }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(myItems);
});

app.get('/api/items/:id', (req, res) => {
  const item = items.find(i => i._id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found.' });
  
  const reporter = users.find(u => u._id === item.reportedBy?._id);
  const enrichedItem = reporter ? { ...item, contactInfo: reporter.phone } : item;
  res.json(enrichedItem);
});

app.post('/api/items', protect, (req, res) => {
  const { title, description, category, type, location, contactInfo, aiTags, image } = req.body;
  if (!title || !description || !category || !type || !location) return res.status(400).json({ message: 'Missing required fields.' });
  const rarity = rarityMap[category] || 'COMMON';
  const id = `item_${++idCounter}`;
  const item = {
    _id: id, title, description, category, type, status: 'open', location,
    rarity, xpReward: xpMap[rarity], confidence: Math.floor(Math.random() * 20) + 78,
    aiTags: aiTags || [], reportedBy: { _id: req.user._id, name: req.user.name },
    image: image || '', contactInfo: contactInfo || req.user.phone || '', claimedBy: null, createdAt: new Date()
  };
  items.push(item);
  req.user.xp += 10; req.user.itemsReported++;

  // 🔎 Automated Match-and-Notify Logic
  const potentialMatches = items.filter(i =>
    i._id !== item._id &&
    i.type !== item.type &&
    i.status === 'open' &&
    (i.category === item.category ||
      i.title.toLowerCase().split(' ').some(word => item.title.toLowerCase().includes(word)))
  );

  potentialMatches.forEach(match => {
    const owner = users.find(u => u._id === match.reportedBy._id);
    if (owner && owner._id !== req.user._id) {
      owner.notifications = owner.notifications || [];
      const msg = item.type === 'found'
        ? `Someone found an item that might be your lost "${match.title}"!`
        : `Someone lost an item that matches the "${match.title}" you found!`;

      owner.notifications.unshift({
        _id: `notif_${++idCounter}`,
        type: 'match',
        title: '✨ Potential Match Found!',
        body: `${msg} Check the database for details.`,
        itemId: item._id,
        read: false,
        createdAt: new Date(),
      });
    }
  });

  // Achievements
  if (req.user.itemsReported === 1) grantAchievement(req.user, 'first_report');
  if (req.user.itemsReported === 5) grantAchievement(req.user, 'five_reports');

  res.status(201).json({ message: `Item reported! +10 XP ⚡`, item, user: userSafe(req.user) });
});

app.patch('/api/items/:id/return', protect, (req, res) => {
  const item = items.find(i => i._id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found.' });
  if (item.status !== 'open') return res.status(400).json({ message: 'Item is not open.' });

  item.status = 'claimed';
  item.claimedBy = req.user._id;
  // xp stays 0 until verified as returned by reporter? 
  // User said "logic not working on uploading the report there is no increase in profile"
  // Let's give them a small bonus for contacting
  req.user.xp += 5;

  // Notify original reporter about contact
  const reporter = users.find(u => u._id === item.reportedBy._id);
  if (reporter && reporter._id !== req.user._id) {
    reporter.notifications = reporter.notifications || [];
    reporter.notifications.unshift({
      _id: `notif_${++idCounter}`, type: 'item_claimed',
      title: '📞 Someone wants to Handover!',
      body: `${req.user.name} is contacting you regarding "${item.title}". Check your "My Reports" for their contact info!`,
      read: false, createdAt: new Date(),
    });
  }

  res.json({ message: `Item returned! +${item.xpReward} XP ⚡`, item, user: userSafe(req.user) });
});

app.delete('/api/items/:id', protect, (req, res) => {
  const idx = items.findIndex(i => i._id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Item not found.' });
  const item = items[idx];
  if (item.reportedBy._id !== req.user._id && req.user.role !== 'admin') return res.status(403).json({ message: 'Not authorised.' });
  items.splice(idx, 1);
  res.json({ message: 'Item deleted.' });
});

app.post('/api/items/:id/claim', protect, (req, res) => {
  const item = items.find(i => i._id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found.' });
  if (item.status !== 'open') return res.status(400).json({ message: 'Item is not available for claim.' });
  if (item.reportedBy._id === req.user._id) return res.status(400).json({ message: 'You cannot claim your own item.' });

  item.status = 'claimed';
  item.claimedBy = req.user._id;
  const finder = users.find(u => u._id === item.reportedBy._id);
  if (finder) {
    finder.notifications = finder.notifications || [];
    finder.notifications.unshift({
      _id: `notif_${++idCounter}`,
      type: 'warning',
      title: '👤 Someone is Claiming!',
      body: `${req.user.name} (Enroll: ${req.user.enrollmentNo}) says the item: "${item.title}" belongs to them. They will contact you shortly!`,
      read: false,
      createdAt: new Date(),
    });
  }
  res.json({ message: `Claim request sent! You can now contact the finder.` });
});

// ─── AUTH ROUTES ──────────────────────────────────────────────────────
app.get('/api/auth/me', protect, (req, res) => {
  res.json({ ok: true, data: { user: userSafe(req.user) } });
});

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, enrollmentNo, phone, branch, year, adminCode } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required.' });
  if (users.find(u => u.email === email)) return res.status(409).json({ message: 'Email already registered.' });
  if (enrollmentNo && users.find(u => u.enrollmentNo === enrollmentNo)) return res.status(409).json({ message: 'Enrollment No. already registered.' });

  let role = 'student';
  if (adminCode) {
    if (adminCode !== ADMIN_CODE) return res.status(403).json({ message: 'Invalid admin code.' });
    role = 'admin';
  }
  const hashed = await bcrypt.hash(password, 10);
  const id = `user_${++idCounter}`;
  const user = {
    _id: id, name, email, password: hashed, enrollmentNo: enrollmentNo || null,
    phone: phone || '', branch: branch || '', year: year || '', role,
    xp: 10, level: 1, itemsReported: 0, itemsReturned: 0,
    achievements: ['joined'], isActive: true,
    notifications: [{
      _id: `notif_${++idCounter}`, type: 'welcome',
      title: '🎮 Welcome to FINDLY!',
      body: `You earned +10 XP for joining! Report lost items or return found ones to level up your rank.`,
      read: false, createdAt: new Date(),
    }],
    createdAt: new Date(),
  };
  users.push(user);
  res.status(201).json({ message: 'Registration successful! +10 XP ⚡', token: genToken(id), user: userSafe(user) });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Invalid email or password.' });
  if (!user.isActive) return res.status(403).json({ message: 'Account suspended. Contact admin.' });
  res.json({ message: 'Login successful!', token: genToken(user._id), user: userSafe(user) });
});

app.get('/api/auth/me', protect, (req, res) => res.json(userSafe(req.user)));

// Update profile picture
app.patch('/api/auth/profile-pic', protect, (req, res) => {
  const { profilePic } = req.body;
  console.log(`📸 Profile pic update request from ${req.user.name} (${profilePic?.length || 0} bytes)`);
  if (!profilePic) return res.status(400).json({ message: 'URL required.' });
  req.user.profilePic = profilePic;
  res.json({ message: 'Profile picture updated! ⚡', user: userSafe(req.user) });
});

// Mark notifications read
app.patch('/api/auth/notifications/read', protect, (req, res) => {
  if (req.user.notifications) req.user.notifications.forEach(n => n.read = true);
  res.json({ message: 'All notifications marked read.' });
});

// ─── ADMIN ROUTES ─────────────────────────────────────────────────────
app.get('/api/admin/stats', protect, adminOnly, (req, res) => {
  const students = users.filter(u => u.role === 'student');
  res.json({
    totalUsers: students.length, totalItems: items.length,
    openItems: items.filter(i => i.status === 'open').length,
    returnedItems: items.filter(i => i.status === 'returned').length,
    lostItems: items.filter(i => i.type === 'lost').length,
    foundItems: items.filter(i => i.type === 'found').length,
    recentItems: [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8),
    topTrainers: [...students].sort((a, b) => b.xp - a.xp).slice(0, 5).map(u => ({
      _id: u._id, name: u.name, enrollmentNo: u.enrollmentNo, xp: u.xp,
      level: calcLevel(u.xp), branch: u.branch, itemsReturned: u.itemsReturned,
    })),
    announcements,
  });
});

app.get('/api/admin/users', protect, adminOnly, (req, res) => {
  res.json(users.filter(u => u.role === 'student').map(u => ({
    _id: u._id, name: u.name, email: u.email, enrollmentNo: u.enrollmentNo,
    phone: u.phone, branch: u.branch, year: u.year, xp: u.xp,
    level: calcLevel(u.xp), itemsReported: u.itemsReported, itemsReturned: u.itemsReturned,
    achievements: u.achievements, isActive: u.isActive, createdAt: u.createdAt,
  })));
});

app.patch('/api/admin/users/:id/toggle', protect, adminOnly, (req, res) => {
  const user = users.find(u => u._id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  user.isActive = !user.isActive;
  if (!user.isActive) {
    user.notifications = user.notifications || [];
    user.notifications.unshift({ _id: `notif_${++idCounter}`, type: 'warning', title: '⚠️ Account Suspended', body: 'Your account has been temporarily suspended by admin. Contact the college office.', read: false, createdAt: new Date() });
  }
  res.json({ message: `User ${user.isActive ? 'activated' : 'suspended'}.`, user: { _id: user._id, isActive: user.isActive } });
});

app.get('/api/admin/items', protect, adminOnly, (req, res) => res.json(items));

app.patch('/api/admin/items/:id/status', protect, adminOnly, (req, res) => {
  const item = items.find(i => i._id === req.params.id);
  if (!item) return res.status(404).json({ message: 'Item not found.' });
  item.status = req.body.status;
  res.json({ message: 'Status updated.', item });
});

app.delete('/api/admin/items/:id', protect, adminOnly, (req, res) => {
  const idx = items.findIndex(i => i._id === req.params.id);
  if (idx !== -1) items.splice(idx, 1);
  res.json({ message: 'Item deleted.' });
});

// Send announcement (admin → all users)
app.post('/api/admin/announce', protect, adminOnly, (req, res) => {
  const { title, body, pinned } = req.body;
  if (!title || !body) return res.status(400).json({ message: 'Title and body required.' });
  const ann = { _id: `ann_${++idCounter}`, title, body, from: req.user.name, createdAt: new Date(), pinned: !!pinned };
  announcements.unshift(ann);
  // Notify all students
  users.filter(u => u.role === 'student').forEach(u => {
    u.notifications = u.notifications || [];
    u.notifications.unshift({ _id: `notif_${++idCounter}`, type: 'announcement', title: `📢 ${title}`, body, read: false, createdAt: new Date() });
  });
  res.status(201).json({ message: 'Announcement sent to all students!', announcement: ann });
});

// Award XP to a student (admin)
app.patch('/api/admin/users/:id/award-xp', protect, adminOnly, (req, res) => {
  const { xp, reason } = req.body;
  const user = users.find(u => u._id === req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  user.xp += Number(xp);
  user.notifications = user.notifications || [];
  user.notifications.unshift({ _id: `notif_${++idCounter}`, type: 'xp_award', title: `⚡ +${xp} XP Awarded!`, body: reason || 'XP awarded by admin.', read: false, createdAt: new Date() });
  res.json({ message: `Awarded +${xp} XP to ${user.name}.`, user: userSafe(user) });
});

app.get('/', (req, res) => res.send('⚡ FINDLY API running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ FINDLY server on port ${PORT}`);
  console.log(`🔑 Admin: admin@niet.co.in / admin123`);
  console.log(`🔑 Admin code: NIET_ADMIN_2024`);
});
