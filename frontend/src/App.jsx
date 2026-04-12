import React from 'react';
import { Provider, useSelector } from 'react-redux';
import store from './store';
import Auth from './components/Auth/Auth';
import NoteList from './components/Notes/NoteList';
import './index.css';

const AppContent = () => {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? <NoteList /> : <Auth />;
};

const App = () => (
  <Provider store={store}>
    <AppContent />
  </Provider>
);

export default App;
