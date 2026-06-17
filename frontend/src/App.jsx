import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Books from './pages/Reader';
import Librarian from './pages/Librarian';
import Admin from './pages/Admin';

function getRoleFromStorage() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return user?.role || null;
  } catch (e) { 
    return null; 
  }
}

export default function App() {
  const role = getRoleFromStorage();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/books" element={<Books />} />

      {/* ROUTE DU BIBLIOTHÉCAIRE */}
      <Route 
        path="/librarian" 
        element={
          role === 'bibliothecaire' || role === 'biblio'
            ? <Librarian />
            : <Navigate to="/login" replace />
        } 
      />

      {/* ROUTE DU DIRECTEUR */}
      <Route 
        path="/admin" 
        element={
          role === 'directeur'
            ? <Admin />
            : <Navigate to="/login" replace />
        } 
      />

      {/* ROUTE PAR DÉFAUT APRÈS LOGIN */}
      <Route 
        path="/dashboard"
        element={
          role === 'directeur'
            ? <Navigate to="/admin" replace />
            : role === 'bibliothecaire' || role === 'biblio'
              ? <Navigate to="/librarian" replace />
              : role === 'lecteur'
                ? <Navigate to="/books" replace />
                : <Navigate to="/login" replace />
        }
      />
    </Routes>
    </div>
  );
}

