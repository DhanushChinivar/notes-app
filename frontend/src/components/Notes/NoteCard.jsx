import React from 'react';
import './Notes.css';

const NoteCard = ({ note, onEdit, onDelete, onSummarize, isSummarizing }) => {
  const preview = note.content.length > 120 ? note.content.slice(0, 120) + '...' : note.content;
  const date = new Date(note.updatedAt).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
        <span className="note-date">{date}</span>
      </div>
      <p className="note-preview">{preview}</p>

      {note.summary && (
        <div className="note-summary">
          <span className="summary-badge">✨ AI Summary</span>
          <p>{note.summary}</p>
        </div>
      )}

      <div className="note-actions">
        <button className="btn-icon" onClick={() => onEdit(note)} title="Edit">✏️ Edit</button>
        <button
          className="btn-icon btn-summarize"
          onClick={() => onSummarize(note._id)}
          disabled={isSummarizing}
          title="Summarize with AI"
        >
          {isSummarizing ? '⏳ Summarizing...' : '🤖 Summarize'}
        </button>
        <button className="btn-icon btn-delete" onClick={() => onDelete(note._id)} title="Delete">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
