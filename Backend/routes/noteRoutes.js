const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.userId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, user: req.userId });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const note = await Note.create({
      user: req.userId,
      title: req.body.title,
      content: req.body.content,
    });
    res.status(201).json(note);
  } catch (err) { next(err); }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title: req.body.title, content: req.body.content },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Note not found' });
    res.json(updated);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Note.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deleted) return res.status(404).json({ message: 'Note not found' });
    res.json({ message: 'Note deleted', deleted });
  } catch (err) { next(err); }
});

module.exports = router;
