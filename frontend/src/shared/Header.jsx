import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Header({ onToggleMenu }) {
  const { t } = useTranslation();
  const [role, setRole] = useState('');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setRole(u?.role || '');
    } catch (e) {
      setRole('');
    }

    // Listen for theme changes from settings
    const handleThemeChange = (event) => {
      const nextTheme = event?.detail?.theme;
      if (nextTheme) {
        applyTheme(nextTheme);
      }
    };

    window.addEventListener('app-theme-change', handleThemeChange);
    return () => window.removeEventListener('app-theme-change', handleThemeChange);
    // eslint-disable-next-line
  }, []);

  function applyTheme(next) {
    const html = document.documentElement;
    if (next === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/login';
  }

  const roleLabel = role === 'directeur'
    ? t('Administrateur')
    : t('Bibliothécaire');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          {/* Left side - Menu Toggle */}
          <div className="absolute left-0 flex items-center">
            {onToggleMenu && (
              <button
                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 text-white"
                onClick={onToggleMenu}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>

          {/* Center - Logo and Title */}
          <div className="flex items-center space-x-3 ml-48">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {t('Bibliothèque UAC')}
              </h1>
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="absolute right-0 flex items-center space-x-3">
            {/* User Role Badge */}
            <div className="hidden sm:flex items-center space-x-2 bg-white/10 text-white px-3 py-2 rounded-lg text-sm font-medium border border-white/20">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{roleLabel}</span>
            </div>

            {/* Logout Button */}
            <button
              className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
              onClick={logout}
              aria-label="Logout"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">{t('Déconnexion')}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};