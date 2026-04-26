const Item = require('../models/Item');
const User = require('../models/User');

// GET /api/items — list all open items (filterable)
const getItems = async (req, res) => {
  try {
    const { type, category, location, status = 'open', search } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (location) filter.location = new RegExp(location, 'i');
    if (status) filter.status = status;
    if (search) filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { aiTags: { $in: [new RegExp(search, 'i')] } },
    ];

    const items = await Item.find(filter)
      .populate('reportedBy', 'name enrollmentNo')
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items.', error: err.message });
  }
};

// GET /api/items/:id
const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reportedBy', 'name enrollmentNo phone');
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// POST /api/items — create item (auth required)
const createItem = async (req, res) => {
  try {
    const { title, description, category, type, location, locationCoords, contactInfo, aiTags } = req.body;
    if (!title || !description || !category || !type || !location) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    // Assign rarity & XP reward
    const rarityMap = { 'Electronics': 'RARE', 'ID/Wallets': 'LEGENDARY', 'Books': 'UNCOMMON', 'Bags': 'UNCOMMON', 'Keys': 'RARE', 'Clothing': 'COMMON', 'Other': 'COMMON' };
    const xpMap = { 'LEGENDARY': 200, 'RARE': 150, 'UNCOMMON': 100, 'COMMON': 50 };
    const rarity = rarityMap[category] || 'COMMON';

    const item = await Item.create({
      title, description, category, type, location, locationCoords,
      contactInfo, aiTags: aiTags || [],
      rarity, xpReward: xpMap[rarity],
      reportedBy: req.user.id,
    });

    // Award XP to reporter
    await User.findByIdAndUpdate(req.user.id, { $inc: { xp: 10, itemsReported: 1 } });

    res.status(201).json({ message: `Item reported! You earned +10 XP ⚡`, item });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create item.', error: err.message });
  }
};

// PATCH /api/items/:id/return — mark item as returned
const markReturned = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });

    item.status = 'returned';
    item.claimedBy = req.user.id;
    await item.save();

    // Award XP to the person who found/returned it
    await User.findByIdAndUpdate(req.user.id, { $inc: { xp: item.xpReward, itemsReturned: 1 } });
    res.json({ message: `Item marked returned! +${item.xpReward} XP awarded ⚡`, item });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// DELETE /api/items/:id (admin or owner)
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found.' });
    if (item.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorised.' });
    }
    await item.deleteOne();
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

// GET /api/items/my — current user's items
const getMyItems = async (req, res) => {
  try {
    const items = await Item.find({ reportedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
};

module.exports = { getItems, getItem, createItem, markReturned, deleteItem, getMyItems };
