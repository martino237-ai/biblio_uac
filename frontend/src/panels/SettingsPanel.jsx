import React, { useState, useEffect } from 'react';

export default function SettingsPanel() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'fr');
  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem('notifications') || 'true')
  );
  const [autoSave, setAutoSave] = useState(
    JSON.parse(localStorage.getItem('autoSave') || 'true')
  );
  const [role, setRole] = useState('');
  const [user, setUser] = useState({});
  const [activeSection, setActiveSection] = useState('profile');
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  useEffect(() => {
    // Rôle de l'utilisateur pour afficher les bons paramètres
    try {
      const u = JSON.parse(localStorage.getItem('user') || 'null');
      setRole(u?.role || '');
      setUser(u || {});
    } catch (e) {
      setRole('');
      setUser({});
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', theme);
    localStorage.setItem('lang', language);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    localStorage.setItem('autoSave', JSON.stringify(autoSave));
  }, [theme, language, notifications, autoSave]);

  const handleReset = () => {
    setTheme('light');
    setLanguage('fr');
    setNotifications(true);
    setAutoSave(true);
    setActiveSection('profile');
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const renderProfile = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <span className="text-2xl">👤</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Profil</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nom d'utilisateur</p>
          <p className="text-lg font-medium text-gray-800 dark:text-white">{user.username || '-'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rôle</p>
          <p className="text-lg font-medium text-gray-800 dark:text-white">{role === 'directeur' ? 'Directeur' : 'Bibliothécaire'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nom complet</p>
          <p className="text-lg font-medium text-gray-800 dark:text-white">{user.nom || '-'}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
          <p className="text-lg font-medium text-gray-800 dark:text-white">{user.email || '-'}</p>
        </div>
      </div>
    </div>
  );

  const renderLanguage = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <span className="text-2xl">🌐</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Langue</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Langue de l'interface
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700 dark:text-gray-200"
            >
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇬🇧 English</option>
              <option value="es">🇪🇸 Español</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTheme = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
          <span className="text-2xl">🎨</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Thème</h2>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Thème de l'interface
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                theme === 'light'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">☀️</span>
                <span className="font-medium">Mode clair</span>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 min-w-[140px] px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                theme === 'dark'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl">🌙</span>
                <span className="font-medium">Mode sombre</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <span className="text-2xl">ℹ️</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">À propos</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Nom de l'application</p>
          <p className="text-lg font-medium text-gray-800 dark:text-white">Bibliothèque UAC</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Version</p>
          <p className="text-lg font-medium text-gray-800 dark:text-white">1.0.0</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Auteur</p>
          <p className="text-lg font-medium text-gray-800 dark:text-white">martin's.org</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Contact</p>
          <a
            href="mailto:martino23700@gmail.com"
            className="text-lg font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            martino23700@gmail.com
          </a>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'language':
        return renderLanguage();
      case 'theme':
        return renderTheme();
      case 'about':
        return renderAbout();
      case 'profile':
      default:
        return renderProfile();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      {/* Alerte de confirmation */}
      {showSaveAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Paramètres réinitialisés avec succès</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">Paramètres</h2>
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profil' },
                { id: 'language', label: 'Langue' },
                { id: 'theme', label: 'Thème' },
                { id: 'about', label: 'À propos' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          <section className="md:col-span-3 space-y-6">
            {renderSection()}

            <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Réinitialiser
                </button>
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium shadow-lg shadow-blue-500/25"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Pied de page */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© 2024 Bibliothèque UAC - Tous droits réservés</p>
        </div>
      </div>

      {/* Styles pour l'animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}