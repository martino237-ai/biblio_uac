import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../shared/Sidebar';
import Header from '../shared/Header';
import BooksPanel from '../panels/BooksPanel';
import ReadersPanel from '../panels/ReadersPanel';
import LoansPanel from '../panels/LoansPanel';
import ConsultationsPanel from '../panels/ConsultationsPanel';
import Dashboard from './Dashboard';
import AlertsPanel from '../panels/AlertsPanel';
// import ExportButton from '../shared/ExportButton';
import api from '../api/axios';
import SettingsPanel from '../panels/SettingsPanel';
import PeriodicalsPanel from '../panels/PeriodicalsPanel';
import '../styles/index.css';

export default function Librarian() {
  const { t } = useTranslation();

  // ✅ TABS AVEC ID FIXES (TRÈS IMPORTANT)
  const tabs = [
    { id: 'dashboard', label: t('Tableau de bord') },
    { id: 'books', label: t('Livres') },
    { id: 'periodicals', label: t('Périodiques') },
    { id: 'readers', label: 'Lecteurs' },
    { id: 'loans', label: t('Emprunts') },
    { id: 'consultations', label: t('Consultations') },
    { id: 'alerts', label: 'Alertes' },
    { id: 'settings', label: t('Paramètres') }
  ];

  // ✅ Dashboard actif par défaut
  const [active, setActive] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function changeActiveTab(newActive) {
    if (newActive === active) return; // Ne rien faire si c'est le même onglet
    setLoading(true);
    setTimeout(() => {
      setActive(newActive);
      setLoading(false);
    }, 2000); // 2 secondes de chargement
  }

  const [stats, setStats] = useState({
    books: 0,
    readers: 0,
    loans: 0,
    consultations: 0,
    late: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [booksRes, readersRes, loansRes, consultationsRes] =
        await Promise.all([
          api.get('/books'),
          api.get('/readers'),
          api.get('/loans'),
          api.get('/consultations')
        ]);

      const books = booksRes.data || [];
      const readers = readersRes.data || [];
      const loans = loansRes.data || [];
      const consultations = consultationsRes.data || [];

      const late = loans.filter(l => l.statut === 'en_retard').length || 0;

      setStats({
        books: books.length,
        readers: readers.length,
        loans: loans.length,
        consultations: consultations.length,
        late
      });

    } catch (err) {
      console.warn('Erreur chargement stats', err);
    }
  }

  function renderPanel() {
    if (loading) {
      return (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <p>{t('Chargement en cours...')}</p>
        </div>
      );
    }

    switch (active) {
      case 'dashboard':
        return <Dashboard stats={stats} />;
      case 'books':
        return <BooksPanel onChange={loadStats} />;
      case 'periodicals':
        return <PeriodicalsPanel onChange={loadStats} />;
      case 'readers':
        return <ReadersPanel onChange={loadStats} />;
      case 'loans':
        return <LoansPanel onChange={loadStats} />;
      case 'consultations':
        return <ConsultationsPanel onChange={loadStats} />;
      case 'alerts':
        return <AlertsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return null;
    }
  }

  return (
    <div className={"app-shell" + (sidebarOpen ? " sidebar-open" : "")}>
      <Sidebar
        active={active}
        onChange={changeActiveTab}
        tabs={tabs}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <main className="main">
        <Header onToggleMenu={() => setSidebarOpen(o => !o)} />

        <div className="container">

          {/* Barre de recherche + export */}
          <div className="toolbar flex flex-wrap gap-4 items-center mb-4">
              {/* other export buttons could be added here if needed */}
          </div>

          {/* 🔽 RENDU DES PANELS (CORRECT) 🔽 */}
          {renderPanel()}

        </div>
      </main>
    </div>
  );
}
