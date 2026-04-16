import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

import { FACULTY_OPTIONS, getFiliereOptions } from '../utils/faculties';
// background image
import fond1 from '../assets/images/fond1.jpeg';

export default function Signup() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [reader, setReader] = useState({
    nom: '',
    prenom: '',
    type: 'etudiant',
    faculte: '',
    filiere: '',
    niveau: '',
    telephone: '',
    matricule: '',
    email: ''
  });

  // options for the current faculty selection
  const filiereOptions = getFiliereOptions(reader.faculte);

  // reset filiere any time the faculty changes
  useEffect(() => {
    setReader(r => ({ ...r, filiere: '' }));
  }, [reader.faculte]);
  const [readerCreated, setReaderCreated] = useState(null);
  const [creds, setCreds] = useState({
    username: '',
    password: '',
    confirm: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [redirectLoading, setRedirectLoading] = useState(false);

  function handleReaderChange(e) {
    const { name, value } = e.target;
    setReader(r => {
      const next = { ...r, [name]: value };
      if (name === 'faculte') {
        next.filiere = '';
      }
      return next;
    });
  }

  function handleCredsChange(e) {
    const { name, value } = e.target;
    setCreds(c => ({ ...c, [name]: value }));
  }

  async function goNext(e) {
    e.preventDefault();
    if (!reader.nom || !reader.prenom) {
      setError(t('Nom et prénom requis'));
      return;
    }
    // Validation conditionnelle selon le type
    if (reader.type === "etudiant") {
      if (!reader.matricule || !reader.faculte || !reader.filiere || !reader.niveau) {
        setError(t('Pour un étudiant : matricule, faculté, filière et niveau sont obligatoires'));
        return;
      }
    }
    if (!reader.email) {
      setError(t('Email requis'));
      return;
    }
    setError('');

    // create reader record on server
    setLoading(true);
    try {
      const res = await api.post('/readers', reader);
      setReaderCreated(res.data);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error || err?.message || t('Erreur lors de la création du lecteur'));
    } finally {
      setLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!creds.username) {
      setError(t('Nom d\'utilisateur requis'));
      return;
    }
    if (creds.password !== creds.confirm) {
      setError(t('Les mots de passe ne correspondent pas'));
      return;
    }

    setLoading(true);
    setError('');
    try {
      // use public endpoint for reader registration which handles both
      // the reader record and user creation, returning a token directly.
      const payload = {
        readerId: readerCreated?.id,
        username: creds.username,
        password: creds.password,
        nom: reader.nom,
        prenom: reader.prenom,
        type: reader.type,
        faculte: reader.faculte,
        filiere: reader.filiere,
        niveau: reader.niveau,
        telephone: reader.telephone,
        matricule: reader.matricule,
        email: reader.email
      };
      const regRes = await api.post('/auth/register-reader', payload);
      const { token, user, reader: returnedReader } = regRes.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      if (returnedReader) {
        setReaderCreated(returnedReader);
      }

      // Afficher le chargement avant redirection
      setRedirectLoading(true);
      
      // Attendre 2 secondes puis rediriger vers la page des livres
      setTimeout(() => {
        window.location = '/books';
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || err.message || t('Erreur lors de l\'inscription'));
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
            <p className="text-white text-xl">{t('Redirection vers votre espace lecteur...')}</p>
          </div>
        </div>
      )}
      <div
        className="min-h-screen flex items-center justify-center px-4 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${fond1})` }}
      >
      <div className="absolute inset-0 bg-blue-950 opacity-60"></div>
      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h1 className="text-4xl font-bold text-white mb-2">{t('Inscription Lecteur')}</h1>
          <p className="text-blue-200">{t('Étape')} {step} {t('sur')} 2: {step === 1 ? t('Informations personnelles') : t('Créer un compte')}</p>
        </div>

        <div className="bg-blue-950 bg-opacity-95 rounded-xl shadow-2xl p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">❌ {error}</p>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={goNext} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
              {/* Type */}
              <div>
                <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Type')}</label>
                <select
                  name="type"
                  value={reader.type}
                  onChange={handleReaderChange}
                  className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                  disabled={loading}
                >
                  <option value="etudiant">Étudiant</option>
                  <option value="enseignant">Enseignant</option>
                  <option value="personnel">Personnel</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              {/* Nom */}
              <div>
                <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Nom')} *</label>
                <input
                  name="nom"
                  value={reader.nom}
                  onChange={handleReaderChange}
                  required
                  className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                  disabled={loading}
                />
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Prénom')} *</label>
                <input
                  name="prenom"
                  value={reader.prenom}
                  onChange={handleReaderChange}
                  required
                  className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                  disabled={loading}
                />
              </div>

              {/* Étudiant : Matricule, Faculté, Filière, Niveau */}
              {reader.type === "etudiant" && (
                <>
                  <div>
                    <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Matricule')} *</label>
                    <input
                      name="matricule"
                      value={reader.matricule}
                      onChange={handleReaderChange}
                      required
                      className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Faculté')} *</label>
                    <select
                      name="faculte"
                      value={reader.faculte}
                      onChange={handleReaderChange}
                      required
                      className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                      disabled={loading}
                    >
                      <option value="">{t('Sélectionner une faculté')}</option>
                      {FACULTY_OPTIONS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Filière')} *</label>
                    <select
                      name="filiere"
                      value={reader.filiere}
                      onChange={handleReaderChange}
                      required
                      disabled={loading || filiereOptions.length === 0}
                      className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                    >
                      <option value="">{t('Sélectionner une filière')}</option>
                      {filiereOptions.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Niveau')} *</label>
                    <input
                      name="niveau"
                      value={reader.niveau}
                      onChange={handleReaderChange}
                      required
                      className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* Téléphone */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">{t('Téléphone')}</label>
                <input
                  name="telephone"
                  value={reader.telephone}
                  onChange={handleReaderChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  disabled={loading}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2">{t('Email')} *</label>
                <input
                  type="email"
                  name="email"
                  value={reader.email}
                  onChange={handleReaderChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg"
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2 flex gap-4 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-700 text-white font-bold rounded-lg"
                >
                  {t('Suivant')} →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div>
                <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Nom d\'utilisateur')} *</label>
                <input
                  type="text"
                  name="username"
                  value={creds.username}
                  onChange={handleCredsChange}
                  required
                  className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Mot de passe')} *</label>
                <input
                  type="password"
                  name="password"
                  value={creds.password}
                  onChange={handleCredsChange}
                  required
                  className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-white text-lg font-bold mb-2 tracking-wide">{t('Confirmer mot de passe')} *</label>
                <input
                  type="password"
                  name="confirm"
                  value={creds.confirm}
                  onChange={handleCredsChange}
                  required
                  className="w-full px-4 py-3 border-2 border-transparent rounded-lg bg-white bg-opacity-90 focus:border-blue-400 focus:bg-opacity-100 transition"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-lg"
              >
                {loading ? t('Inscription...') : t('S\'inscrire')}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 font-semibold"
              disabled={loading}
            >
              ← {t('Retour')}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}