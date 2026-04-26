const User = require('../models/User');
const Item = require('../models/Item');

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalItems, openItems, returnedItems, lostItems, foundItems] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      Item.countDocuments(),
      Item.countDocuments({ status: 'open' }),
      Item.countDocuments({ status: 'returned' }),
      Item.countDocuments({ type: 'lost' }),
      Item.countDocuments({ type: 'found' }),
    ]);

    const recentItems = await Item.find().sort({ createdAt: -1 }).limit(5)
      .populate('reportedBy', 'name enrollmentNo');

    const topTrainers = await User.find({ role: 'student' })
      .sort({ xp: -1 }).limit(5)
      .select('name enrollmentNo xp level branch itemsReturned');

    res.json({ totalUsers, totalItems, openItems, returnedItems, lostItems, foundItems, recentItems, topTrainers });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load stats.', error: err.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'student' })
      .select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// PATCH /api/admin/users/:id/toggle — activate/deactivate user
const toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/admin/items — all items with full data
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 })
      .populate('reportedBy', 'name enrollmentNo')
      .populate('claimedBy', 'name enrollmentNo');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// PATCH /api/admin/items/:id/status
const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json({ message: 'Status updated.', item });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// DELETE /api/admin/items/:id
const deleteItem = async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getStats, getAllUsers, toggleUser, getAllItems, updateItemStatus, deleteItem };
