const express = require('express');
const router = express.Router();
const { getItems, getItem, createItem, markReturned, deleteItem, getMyItems } = require('../controllers/itemController');
const { protect } = require('../middleware/auth');

router.get('/', getItems);
router.get('/my', protect, getMyItems);
router.get('/:id', getItem);
router.post('/', protect, createItem);
router.patch('/:id/return', protect, markReturned);
router.delete('/:id', protect, deleteItem);

module.exports = router;
