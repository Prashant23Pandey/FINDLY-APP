const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, toggleUser, getAllItems, updateItemStatus, deleteItem } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly); // All admin routes require login + admin role

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/toggle', toggleUser);
router.get('/items', getAllItems);
router.patch('/items/:id/status', updateItemStatus);
router.delete('/items/:id', deleteItem);

module.exports = router;
