import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export default function SettingsPanel({ inModal = false, onClose = null }) {
  const { t, i18n } = useTranslation();
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
  const [profileForm, setProfileForm] = useState({ nom: '', email: '', password: '' });
  const [readerProfile, setReaderProfile] = useState(null);
  const [readerForm, setReaderForm] = useState({ matricule:'', type:'etudiant', faculte:'', filiere:'', niveau:'', telephone:'' });
  const [savingReader, setSavingReader] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

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

    setProfileForm({ nom: user.nom || '', email: user.email || '', password: '' });

    // si l'utilisateur est lecteur, charger la fiche lecteur
    if ((user?.role || role) === 'lecteur') {
      (async () => {
        try {
          const res = await api.get('/readers/me');
          setReaderProfile(res.data || null);
          setReaderForm({
            matricule: res.data?.matricule || '',
            type: res.data?.type || 'etudiant',
            faculte: res.data?.faculte || '',
            filiere: res.data?.filiere || '',
            niveau: res.data?.niveau || '',
            telephone: res.data?.telephone || ''
          });
        } catch (e) {
          // ignore — la fiche peut ne pas exister
        }
      })();
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

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    window.dispatchEvent(new CustomEvent('app-theme-change', { detail: { theme } }));
  }, [theme, language, notifications, autoSave, i18n, user.nom, user.email]);

  const handleReset = () => {
    setTheme('light');
    setLanguage('fr');
    setNotifications(true);
    setAutoSave(true);
    setActiveSection('profile');
    setShowSaveAlert(true);
    setTimeout(() => setShowSaveAlert(false), 3000);
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    try {
      const payload = {};
      if (profileForm.nom !== user.nom) payload.nom = profileForm.nom;
      if (profileForm.email !== user.email) payload.email = profileForm.email;
      if (profileForm.password) payload.password = profileForm.password;

      if (Object.keys(payload).length === 0) {
        alert(t('Aucune modification détectée'));
        return;
      }

      const res = await api.put('/auth/profile', payload);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setProfileForm({ ...profileForm, password: '' });

      // si lecteur, tenter aussi de sauvegarder la fiche lecteur si modifiée
      if (readerProfile && (user?.role === 'lecteur' || role === 'lecteur')) {
        const readerPayload = {};
        if (readerForm.matricule !== (readerProfile.matricule || '')) readerPayload.matricule = readerForm.matricule || null;
        if (readerForm.type !== (readerProfile.type || 'etudiant')) readerPayload.type = readerForm.type;
        if (readerForm.faculte !== (readerProfile.faculte || '')) readerPayload.faculte = readerForm.faculte || null;
        if (readerForm.filiere !== (readerProfile.filiere || '')) readerPayload.filiere = readerForm.filiere || null;
        if (readerForm.niveau !== (readerProfile.niveau || '')) readerPayload.niveau = readerForm.niveau || null;
        if (readerForm.telephone !== (readerProfile.telephone || '')) readerPayload.telephone = readerForm.telephone || null;

        if (Object.keys(readerPayload).length > 0) {
          setSavingReader(true);
          try {
            await api.put(`/readers/${readerProfile.id}`, readerPayload);
            // recharger la fiche
            const r = await api.get('/readers/me');
            setReaderProfile(r.data || null);
          } catch (e) {
            console.error('Erreur sauvegarde reader', e);
            alert(t('Erreur lors de la sauvegarde des informations lecteur'));
          } finally { setSavingReader(false); }
        }
      }

      setShowSaveAlert(true);
      setTimeout(() => setShowSaveAlert(false), 3000);
    } catch (err) {
      console.error(err);
      alert(t('Erreur lors de la sauvegarde du profil'));
    } finally {
      setSavingProfile(false);
    }
  };

  const renderProfile = () => (
    <div className="space-y-6">
      {/* Section Utilisateur */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <span className="text-2xl">👤</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('Profil utilisateur')}</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nom d'utilisateur - lecture seule */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t("Nom d'utilisateur")}</p>
            <p className="text-base font-medium text-gray-800 dark:text-white">{user.username || '-'}</p>
          </div>

          {/* Rôle - lecture seule */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('Rôle')}</p>
            <p className="text-base font-medium text-gray-800 dark:text-white">
              {role === 'directeur' ? t('Directeur') : role === 'bibliothecaire' ? t('Bibliothécaire') : t('Lecteur')}
            </p>
          </div>

          {/* Nom complet - éditable */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Nom complet')}</label>
            <input
              type="text"
              value={profileForm.nom}
              onChange={(e) => setProfileForm({ ...profileForm, nom: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('Votre nom complet')}
            />
          </div>

          {/* Email - éditable */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Email')}</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('Votre email')}
            />
          </div>

          {/* Mot de passe - éditable */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('Nouveau mot de passe')}
            </label>
            <input
              type="password"
              value={profileForm.password}
              onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('Laisser vide pour ne pas changer')}
            />
          </div>
        </div>

        {/* Bouton sauvegarder profil */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={saveProfile}
            disabled={savingProfile}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {savingProfile ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('Sauvegarde...')}
              </>
            ) : (
              <>💾 {t('Sauvegarder')}</>
            )}
          </button>
        </div>
      </div>

      {/* Section Lecteur - si applicable */}
      {role === 'lecteur' && readerProfile && (
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-700 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <span className="text-2xl">📚</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('Informations lecteur')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Matricule')}</label>
              <input
                type="text"
                value={readerForm.matricule}
                onChange={e => setReaderForm({...readerForm, matricule: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Type')}</label>
              <select
                value={readerForm.type}
                onChange={e => setReaderForm({...readerForm, type: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="etudiant">{t('Étudiant')}</option>
                <option value="enseignant">{t('Enseignant')}</option>
                <option value="personnel">{t('Personnel')}</option>
                <option value="autre">{t('Autre')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Faculté')}</label>
              <input
                type="text"
                value={readerForm.faculte}
                onChange={e => setReaderForm({...readerForm, faculte: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Filière')}</label>
              <input
                type="text"
                value={readerForm.filiere}
                onChange={e => setReaderForm({...readerForm, filiere: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Niveau')}</label>
              <input
                type="text"
                value={readerForm.niveau}
                onChange={e => setReaderForm({...readerForm, niveau: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('Téléphone')}</label>
              <input
                type="text"
                value={readerForm.telephone}
                onChange={e => setReaderForm({...readerForm, telephone: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-between gap-3">
            <button
              onClick={() => {
                setReaderForm({
                  matricule: readerProfile?.matricule || '',
                  type: readerProfile?.type || 'etudiant',
                  faculte: readerProfile?.faculte || '',
                  filiere: readerProfile?.filiere || '',
                  niveau: readerProfile?.niveau || '',
                  telephone: readerProfile?.telephone || ''
                });
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              {t('Annuler')}
            </button>
            <button
              onClick={saveProfile}
              disabled={savingReader || savingProfile}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {savingReader ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('Sauvegarde...')}
                </>
              ) : (
                <>💾 {t('Sauvegarder')}</>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderLanguage = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <span className="text-2xl">🌐</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('Sélectionner votre langue')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { code: 'fr', flag: '🇫🇷', name: 'Français' },
            { code: 'en', flag: '🇬🇧', name: 'English' },
            { code: 'es', flag: '🇪🇸', name: 'Español' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                language === lang.code
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <span className="font-medium text-gray-800 dark:text-white">{lang.name}</span>
              {language === lang.code && (
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTheme = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <span className="text-2xl">🎨</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('Thème de l\'application')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
              theme === 'light'
                ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <span className="text-4xl mb-2">☀️</span>
            <span className="font-medium text-gray-800 dark:text-white">{t('Mode clair')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Interface claire et lumineuse</p>
            {theme === 'light' && (
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
              theme === 'dark'
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            <span className="text-4xl mb-2">🌙</span>
            <span className="font-medium text-gray-800 dark:text-white">{t('Mode sombre')}</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Interface sombre et reposante</p>
            {theme === 'dark' && (
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <span className="text-2xl">ℹ️</span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{t('À propos')}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t("Nom de l'application")}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white">{t('Bibliothèque UAC')}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('Version')}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white">1.0.0</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('Auteur')}</p>
            <p className="text-base font-semibold text-gray-800 dark:text-white">martin's.org</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-4 border border-orange-100 dark:border-orange-800">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('Contact')}</p>
            <a
              href="mailto:martino23700@gmail.com"
              className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              martino23700@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {t('Merci d\'utiliser Bibliothèque UAC. Cette application a été développée pour simplifier la gestion et l\'accès aux ressources de la bibliothèque.')}
          </p>
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

  if (inModal) {
    return (
      <>
        {/* Overlay fond */}
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
        >
          {/* Modal */}
          <div 
            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-2xl">⚙️</span> {t('Paramètres')}
              </h1>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                title={t('Fermer')}
              >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 px-6">
              {[
                { id: 'profile', label: t('Profil'), icon: '👤' },
                { id: 'language', label: t('Langue'), icon: '🌐' },
                { id: 'theme', label: t('Thème'), icon: '🎨' },
                { id: 'about', label: t('À propos'), icon: 'ℹ️' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeSection === item.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>

            {/* Contenu */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {renderSection()}
            </div>

            {/* Pied de modal */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-3xl">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                {t('Fermer')}
              </button>
            </div>
          </div>
        </div>

        {/* Alerte de confirmation */}
        {showSaveAlert && (
          <div className="fixed top-4 right-4 z-50 animate-slideIn">
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">{t('Paramètres réinitialisés avec succès')}</span>
            </div>
          </div>
        )}

        <style>{`
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
      </>
    );
  }

  // Mode page complète (non-modal)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      {/* Alerte de confirmation */}
      {showSaveAlert && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">{t('Paramètres réinitialisés avec succès')}</span>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="md:col-span-1 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4">{t('Paramètres')}</h2>
            <nav className="space-y-2">
              {[
                { id: 'profile', label: t('Profil') },
                { id: 'language', label: t('Langue') },
                { id: 'theme', label: t('Thème') },
                { id: 'about', label: t('À propos') },
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
                  {t('Réinitialiser')}
                </button>
                <button
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors font-medium shadow-lg shadow-blue-500/25"
                >
                  {t('Enregistrer les modifications')}
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
      <style>{`
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