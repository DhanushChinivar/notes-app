const express = require('express');
const Note = require('../models/Note');
const authenticate = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(authenticate);

// GET /api/notes - List all notes for logged-in user
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/notes - Create a new note
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const note = new Note({ userId: req.userId, title, content });
    await note.save();

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/notes/:id - Update an existing note
router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, content, summary: null }, // reset summary on edit
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE /api/notes/:id - Delete a note
router.delete('/:id', async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST /api/notes/:id/summarize - Generate AI summary using Claude API
router.post('/:id/summarize', async (req, res) => {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.userId });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!ANTHROPIC_API_KEY) {
      // Fallback mock summary if no API key
      const mockSummary = `Summary of "${note.title}": ${note.content.slice(0, 100)}...`;
      note.summary = mockSummary;
      await note.save();
      return res.json({ note, mock: true });
    }

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: `Please provide a concise 2-3 sentence summary of the following note:\n\nTitle: ${note.title}\n\nContent: ${note.content}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const summary = data.content[0].text;

    note.summary = summary;
    await note.save();

    res.json({ note });
  } catch (err) {
    res.status(500).json({ message: 'Summarization failed', error: err.message });
  }
});

module.exports = router;
