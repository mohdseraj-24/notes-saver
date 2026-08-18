const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

router.get('/', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

router.get('/:id', async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.json(item);
});

router.post('/', async (req, res) => {
  const newItem = new Item(req.body);
  const saved = await newItem.save();
  res.status(201).json(saved);
});

router.patch('/:id', async (req, res) => {
  const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Item.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted', deleted });
});

module.exports = router;