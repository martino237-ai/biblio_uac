import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// assets
import logo from '../assets/images/logo.jpeg';
import fondsImg from '../assets/images/fonds_acceuil.jpeg';

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  function navigateWithLoading(path) {
    setLoading(true);
    setTimeout(() => {
      navigate(path);
    }, 2000);
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loading-screen">
            <div className="loading-spinner"></div>
            <p>{t('Chargement en cours...')}</p>
          </div>
        </div>
      )}
      <div
        className="min-h-screen relative bg-fixed bg-cover bg-center pt-24"
        style={{
          backgroundImage: `url(${fondsImg})`,
        }}
      >
      {/* dark overlay on background */}
      <div className="absolute inset-0 bg-blue-950 opacity-60"></div>
      <section className="relative">

        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-20 flex flex-col sm:flex-row justify-between items-center px-8 py-6 bg-blue-950">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-white">Bibliothèque UAC</h1>
          </div>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button
              onClick={() => navigateWithLoading('/login')}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold rounded-lg transition duration-300 btn-enhanced"
            >
              Connexion
            </button>
            <button
              onClick={() => navigateWithLoading('/signup')}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition duration-300 btn-enhanced"
            >
              {t('S\'inscrire')}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-8 py-20 text-center text-white ">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            Bienvenue à la<br />
            <span className="text-yellow-300">Bibliothèque UAC</span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Gérez efficacement vos livres, lecteurs et emprunts avec notre système de gestion de bibliothèque moderne et intuitif.
          </p>
          <button
            onClick={() => navigateWithLoading('/login')}
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold text-lg rounded-lg transition duration-300 shadow-lg btn-enhanced"
          >
            Commencer →
          </button>
        </section>

        {/* Features Section */}
        <section className="px-8 py-16 max-w-6xl mx-auto ">
          <h3 className="text-4xl font-bold text-white text-center mb-12">Fonctionnalités Principales</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 border border-white border-opacity-20 hover:border-opacity-50 transition duration-300 card-enhanced">
              <div className="text-5xl mb-4 card-icon">📖</div>
              <h4 className="text-2xl font-bold text-white mb-3">{t('Gestion des livres')}</h4>
              <p className="text-blue-100">
                Cataloguez et organisez vos livres par thème, auteur et emplacement avec un système de suivi des exemplaires.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 border border-white border-opacity-20 hover:border-opacity-50 transition duration-300 card-enhanced">
              <div className="text-5xl mb-4 card-icon">👥</div>
              <h4 className="text-2xl font-bold text-white mb-3">{t('Gestion des lecteurs')}</h4>
              <p className="text-blue-100">
                Gérez facilement votre base de lecteurs avec le suivi de leurs emprunts et consultations.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 border border-white border-opacity-20 hover:border-opacity-50 transition duration-300 card-enhanced">
              <div className="text-5xl mb-4 card-icon">📊</div>
              <h4 className="text-2xl font-bold text-white mb-3">{t('Statistiques')}</h4>
              <p className="text-blue-100">
                Accédez à des statistiques détaillées sur vos emprunts, consultations et activités de la bibliothèque.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 border border-white border-opacity-20 hover:border-opacity-50 transition duration-300 card-enhanced">
              <div className="text-5xl mb-4 card-icon">📜</div>
              <h4 className="text-2xl font-bold text-white mb-3">Journal d'activités</h4>
              <p className="text-blue-100">
                Suivez toutes les actions (emprunts, consultations, connexions) avec filtres, recherche et export CSV/PDF.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 border border-white border-opacity-20 hover:border-opacity-50 transition duration-300 card-enhanced">
              <div className="text-5xl mb-4 card-icon">🔄</div>
              <h4 className="text-2xl font-bold text-white mb-3">{t('Gestion des emprunts')}</h4>
              <p className="text-blue-100">
                Suivez les emprunts et retours avec des alertes pour les retards et disponibilité des exemplaires.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 border border-white border-opacity-20 hover:border-opacity-50 transition duration-300">
              <div className="text-5xl mb-4">🔐</div>
              <h4 className="text-2xl font-bold text-white mb-3">{t('Sécurité')}</h4>
              <p className="text-blue-100">
                Système d'authentification sécurisé avec des rôles (Administrateur, Bibliothécaire).
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 border border-white border-opacity-20 hover:border-opacity-50 transition duration-300 card-enhanced">
              <div className="text-5xl mb-4 card-icon">🌐</div>
              <h4 className="text-2xl font-bold text-white mb-3">Livres gratuits en ligne</h4>
              <p className="text-blue-100">
                Recherchez et lisez des livres numériques gratuits classés par catégorie (informatique, santé, droit, etc.).
              </p>
            </div>

            {/* Card 7 */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 border border-white border-opacity-20 hover:border-opacity-50 transition duration-300 card-enhanced">
              <div className="text-5xl mb-4 card-icon">📤</div>
              <h4 className="text-2xl font-bold text-white mb-3">{t('Exports')}</h4>
              <p className="text-blue-100">
                Exportez vos données et rapports en formats divers pour une meilleure analyse.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-8 py-16  mt-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold text-white text-center mb-12">{t('')}</h3>
            
            <div className="grid md:grid-cols-2 gap-8 text-blue-100">
              <div className="flex gap-4">
                <span className="text-3xl">✓</span>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">Interface Intuitive</h5>
                  <p>Facile à utiliser pour tous les niveaux d'utilisateurs</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-3xl">✓</span>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">Rapide et Fiable</h5>
                  <p>Performance optimisée pour gérer de grandes bibliothèques</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-3xl">✓</span>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">Support Multilingue</h5>
                  <p>Interface disponible en français et autres langues</p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="text-3xl">✓</span>
                <div>
                  <h5 className="text-xl font-bold text-white mb-2">Données Sécurisées</h5>
                  <p>Vos données sont protégées avec des standards de sécurité élevés</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-20 text-center ">
          <h3 className="text-3xl font-bold text-white mb-6">Prêt à Commencer ?</h3>
          <p className="text-blue-100 text-lg mb-8">Connectez-vous maintenant pour accéder à toutes les fonctionnalités.</p>
          <button
            onClick={() => navigateWithLoading('/login')}
            className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold text-lg rounded-lg transition duration-300 shadow-lg btn-enhanced"
          >
            Se Connecter Maintenant
          </button>
        </section>

        {/* Footer */}
        <footer className="bg-blue-950 text-blue-200 py-8 px-8 text-center mt-12">
          <p>&copy; 2026 Bibliothèque UAC. Tous droits réservés.</p>
          <p className="text-sm mt-2">Gestion Intelligente des Bibliothèques</p>
        </footer>
      </section>
    </div>
    </>
  );
}
