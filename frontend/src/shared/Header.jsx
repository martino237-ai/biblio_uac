import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Header({ onToggleMenu }) {
  const { t, i18n } = useTranslation();
  const [role, setRole] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setRole(u?.role || '');
    } catch (e) {
      setRole('');
    }
    applyTheme(theme);
    // eslint-disable-next-line
  }, []);

  function applyTheme(next) {
    const html = document.documentElement;
    if (next === 'dark') html.classList.add('dark');
    else html.classList.remove('dark');

    localStorage.setItem('theme', next);
    setTheme(next);
  }

  function toggleTheme() {
    applyTheme(theme === 'dark' ? 'light' : 'dark');
  }

  function changeLang(e) {
    const l = e.target.value;
    i18n.changeLanguage(l);
    localStorage.setItem('lang', l);
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
    <header className="header bg-white dark:bg-gray-800 flex flex-wrap justify-between items-center">
      <div className="header-left flex flex-wrap items-center gap-2">
        {onToggleMenu && (
          <button
            className="md:hidden p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
            onClick={onToggleMenu}
          >
            ☰
          </button>
        )}
        
        <div>
          <h2 className="text-base sm:text-lg dark:text-white">
            {t('Bibliothèque UAC')}
          </h2>
          <div className="muted text-xs sm:text-sm">
            {role ? roleLabel : t('Interface Bibliothécaire')}
          </div>
        </div>
      </div>

      <div className="header-right flex items-center space-x-3">
        <select
          onChange={changeLang}
          value={i18n.language}
          className="px-2 py-1 rounded-md bg-white dark:bg-gray-700 text-sm"
        >
          <option value="fr">FR</option>
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>

        <button
          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded-md text-sm"
          onClick={toggleTheme}
        >
          {theme === 'dark' ? t('Clair') : t('Sombre')}
        </button>

        <div className="user-pill px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-md text-sm">
          {roleLabel}
        </div>

        <button className="btn-logout px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm dark:bg-red-600 dark:hover:bg-red-700 btn-enhanced" onClick={logout}>
          {t('Déconnexion')}
        </button>
      </div>
    </header>
  );
}