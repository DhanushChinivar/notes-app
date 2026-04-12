import React, { useState, useEffect } from 'react';
import './Notes.css';

const NoteEditor = ({ note, onSave, onCancel, loading }) => {
  const [form, setForm] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (note) {
      setForm({ title: note.title, content: note.content });
    } else {
      setForm({ title: '', content: '' });
    }
  }, [note]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.');
      return;
    }
    onSave(form);
  };

  return (
    <div className="editor-overlay">
      <div className="editor-modal">
        <div className="editor-header">
          <h2>{note ? 'Edit Note' : 'New Note'}</h2>
          <button className="btn-close" onClick={onCancel}>✕</button>
        </div>

        {error && <div className="editor-error">{error}</div>}

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Note title..."
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              placeholder="Write your note here..."
              rows={10}
            />
          </div>
          <div className="editor-footer">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteEditor;
