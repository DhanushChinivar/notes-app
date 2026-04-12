import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, createNote, updateNote, deleteNote, summarizeNote } from '../../store/notesSlice';
import { logout } from '../../store/authSlice';
import NoteCard from './NoteCard';
import NoteEditor from './NoteEditor';
import './Notes.css';

const NoteList = () => {
  const dispatch = useDispatch();
  const { items: notes, loading, error, summarizing } = useSelector((s) => s.notes);
  const { user } = useSelector((s) => s.auth);

  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const handleNew = () => {
    setEditingNote(null);
    setShowEditor(true);
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editingNote) {
        await dispatch(updateNote({ id: editingNote._id, noteData: form })).unwrap();
      } else {
        await dispatch(createNote(form)).unwrap();
      }
      setShowEditor(false);
      setEditingNote(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this note?')) {
      dispatch(deleteNote(id));
    }
  };

  const handleSummarize = (id) => {
    dispatch(summarizeNote(id));
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="notes-page">
      {/* Header */}
      <header className="notes-header">
        <div className="header-left">
          <h1>📝 NotesAI</h1>
          <span className="welcome-text">Hello, {user?.username}!</span>
        </div>
        <div className="header-right">
          <button className="btn-primary btn-new" onClick={handleNew}>+ New Note</button>
          <button className="btn-secondary btn-logout" onClick={() => dispatch(logout())}>Logout</button>
        </div>
      </header>

      {/* Search */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="🔍 Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Error */}
      {error && <div className="notes-error">{error}</div>}

      {/* Notes Grid */}
      <main className="notes-grid">
        {loading && <div className="notes-loading">Loading your notes...</div>}

        {!loading && filtered.length === 0 && (
          <div className="notes-empty">
            {search ? 'No notes match your search.' : 'No notes yet. Create your first note!'}
          </div>
        )}

        {filtered.map((note) => (
          <NoteCard
            key={note._id}
            note={note}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSummarize={handleSummarize}
            isSummarizing={summarizing === note._id}
          />
        ))}
      </main>

      {/* Editor Modal */}
      {showEditor && (
        <NoteEditor
          note={editingNote}
          onSave={handleSave}
          onCancel={() => { setShowEditor(false); setEditingNote(null); }}
          loading={saving}
        />
      )}
    </div>
  );
};

export default NoteList;
