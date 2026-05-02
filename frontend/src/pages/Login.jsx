import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

// background asset
import fond1 from '../assets/images/fond1.jpeg';



export default function Login(){
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectLoading, setRedirectLoading] = useState(false);

  async function submit(e){
    e.preventDefault();

    // 🔥 TRÈS IMPORTANT : nettoyer l’ancienne session AVANT connexion
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setError('');
    setLoading(true);

    try{
      const r = await api.post('/auth/login', { username, password });

      localStorage.setItem('token', r.data.token);
      localStorage.setItem('user', JSON.stringify(r.data.user));

      const role = r.data.user?.role;

      // 🔥 Afficher le chargement avant redirection
      setRedirectLoading(true);
      
      let redirectPath = '/dashboard'; // default
      if (role === 'directeur') {
        redirectPath = '/admin';
      } 
      else if (role === 'bibliothecaire' || role === 'biblio') {
        redirectPath = '/librarian';
      }
      
      // Attendre 2 secondes puis rediriger
      setTimeout(() => {
        window.location = redirectPath;
      }, 2000);

    } catch(err){
      setError(
        err?.response?.data?.message ||
        err.message ||
        'Erreur de connexion'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {redirectLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p className="text-white text-xl">{t('Redirection en cours...')}</p>
          </div>
        </div>
      )}
      <div
        className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${fond1})` }}
      >
      {/* dark overlay to dim the image */}
      <div className="absolute inset-0 bg-blue-950 opacity-60"></div>
      <div className="w-full max-w-md relative  ">

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Bibliothèque UAC
          </h1>
          <p className="text-yellow-300 text-2xl">
            {t('Système de Gestion des Bibliothèques')}
          </p>
        </div>

        <div className="bg-blue-950 bg-opacity-95 rounded-xl shadow-2xl p-8 backdrop-blur-sm ">
          <h2 className="text-3xl font-bold text-blue-900 mb-2 text-center">
            {t('Connexion')}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">❌ {error}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5 ">

            <div>
              <label className="block text-white text-lg font-bold mb-2 tracking-wide">
                {t("Nom d'utilisateur")}
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white text-lg font-bold mb-2 tracking-wide">
                {t('Mot de passe')}
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition duration-300 btn-enhanced"
            >
              {loading ? `⏳ ${t('Connexion en cours...')}` : ` ${t('Se connecter')}`}
            </button>
            <button
              onClick={() => navigate('/signup')}
              disabled={loading}
              className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition duration-300 btn-enhanced"
            >
              {t('Créer un compte')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 font-semibold transition duration-300 btn-enhanced"
            >
              ← Retour à l'accueil
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
          <p className="text-white text-sm text-center">
            <span className="font-semibold">Identifiants de test :</span><br/>
            Admin: admin / password<br/>
            Biblio: biblio / password<br/>
            Lecteur: MART / password<br/>
            Lecteur2: test.lecteur@uac.edu / password (seed ajouté)
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
