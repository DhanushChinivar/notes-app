import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../api/notes';

// Thunks
export const fetchNotes = createAsyncThunk('notes/fetchAll', async (_, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    return await api.getNotes(token);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createNote = createAsyncThunk('notes/create', async (noteData, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    return await api.createNote(token, noteData);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateNote = createAsyncThunk('notes/update', async ({ id, noteData }, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    return await api.updateNote(token, id, noteData);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const deleteNote = createAsyncThunk('notes/delete', async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    await api.deleteNote(token, id);
    return id;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const summarizeNote = createAsyncThunk('notes/summarize', async (id, { getState, rejectWithValue }) => {
  try {
    const token = getState().auth.token;
    return await api.summarizeNote(token, id);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    items: [],
    loading: false,
    error: null,
    summarizing: null, // id of note being summarized
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchNotes.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchNotes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Create
      .addCase(createNote.fulfilled, (state, action) => { state.items.unshift(action.payload); })
      // Update
      .addCase(updateNote.fulfilled, (state, action) => {
        const idx = state.items.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      // Delete
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload);
      })
      // Summarize
      .addCase(summarizeNote.pending, (state, action) => { state.summarizing = action.meta.arg; })
      .addCase(summarizeNote.fulfilled, (state, action) => {
        state.summarizing = null;
        const idx = state.items.findIndex((n) => n._id === action.payload.note._id);
        if (idx !== -1) state.items[idx] = action.payload.note;
      })
      .addCase(summarizeNote.rejected, (state) => { state.summarizing = null; });
  },
});

export const { clearError } = notesSlice.actions;
export default notesSlice.reducer;
