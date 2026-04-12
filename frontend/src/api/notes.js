const BASE_URL = '/api/notes';

const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
});

export const getNotes = async (token) => {
  const res = await fetch(BASE_URL, { headers: authHeaders(token) });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch notes');
  return data;
};

export const createNote = async (token, noteData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(noteData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create note');
  return data;
};

export const updateNote = async (token, id, noteData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(noteData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update note');
  return data;
};

export const deleteNote = async (token, id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete note');
  return data;
};

export const summarizeNote = async (token, id) => {
  const res = await fetch(`${BASE_URL}/${id}/summarize`, {
    method: 'POST',
    headers: authHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Summarization failed');
  return data;
};
