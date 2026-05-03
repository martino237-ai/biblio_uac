import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Sidebar from '../shared/Sidebar';
import Header from '../shared/Header';
import StatsPanel from '../panels/StatsPanel';
import UsersPanel from '../panels/UsersPanel';
import ActivitiesPanel from '../panels/ActivitiesPanel';
import AlertsPanel from '../panels/AlertsPanel';
import BooksPanel from '../panels/BooksPanel';
import SettingsPanel from '../panels/SettingsPanel';
import '../styles/index.css';

export default function Admin() {
  const { t } = useTranslation();

  const tabs = [
    { id: 'dashboard', label: t('Tableau de bord'), icon: '📊' },
    { id: 'users', label: t('Utilisateurs'), icon: '👥' },
    { id: 'books', label: t('Ouvrages'), icon: '📚' },
    { id: 'activities', label: t('Activités'), icon: '📜' },
    { id: 'alerts', label: t('Alertes'), icon: '⚠️' },
    { id: 'stats', label: t('Statistiques'), icon: '📈' },
    { id: 'settings', label: t('Paramètres'), icon: '⚙️' },
  ];

  const [active, setActive] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    books: 0,
    readers: 0,
    loans: 0,
    consultations: 0,
    late: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function changeActiveTab(newActive) {
    if (newActive === active) return; // Ne rien faire si c'est le même onglet
    setLoading(true);
    setTimeout(() => {
      setActive(newActive);
      setLoading(false);
    }, 1000); // 1 seconde de chargement
  }

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await api.get('/stats/summary');
      setStats(res.data);
    } catch (err) {
      console.warn('API stats introuvable → valeurs par défaut utilisées');
      setStats({
        books: 12,
        readers: 45,
        loans: 18,
        consultations: 73,
        late: 3,
      });
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
        return (
          <div className="dashboard-admin">
            <h2>{t('Tableau de bord')} - {t('Administrateur')}</h2>

            <div className="grid-4">
              <div className="card stat stat-card">
                <div className="stat-title">📚 {t('Total livres')}</div>
                <div className="stat-value">{stats.books}</div>
              </div>

              <div className="card stat stat-card">
                <div className="stat-title">👥 {t('Total lecteurs')}</div>
                <div className="stat-value">{stats.readers}</div>
              </div>

              <div className="card stat stat-card">
                <div className="stat-title">📖 {t('Consultations')}</div>
                <div className="stat-value">{stats.consultations}</div>
              </div>

              <div className="card stat stat-card">
                <div className="stat-title">📚 {t('Emprunts')}</div>
                <div className="stat-value">{stats.loans}</div>
              </div>

              <div className="card stat stat-card">
                <div className="stat-title">⏱️ {t('Heures consultées')}</div>
                <div className="stat-value">{stats.consultation_hours}h</div>
              </div>

              <div className="card stat danger stat-card">
                <div className="stat-title">⚠️ {t('Retards')}</div>
                <div className="stat-value">{stats.late}</div>
              </div>

              <div className="card stat stat-card">
                <div className="stat-title">🔄 {t('Prolongations')}</div>
                <div className="stat-value">{stats.prolonged_loans}</div>
              </div>

              <div className="card stat stat-card">
                <div className="stat-title">👤 {t('Lecteurs actifs')}</div>
                <div className="stat-value">{stats.active_readers}</div>
              </div>

              <div className="card stat stat-card">
                <div className="stat-title">📖 {t('Livres actifs')}</div>
                <div className="stat-value">{stats.active_books}</div>
              </div>
            </div>
          </div>
        );

      case 'stats':
        return <StatsPanel />;

      case 'users':
        return <UsersPanel />;

      case 'books':
        return <BooksPanel />;


      case 'activities':
        return <ActivitiesPanel />;

      case 'alerts':
        return <AlertsPanel />;

      case 'settings':
        // ✅ CORRECTION PRINCIPALE : afficher VRAIMENT le panel Paramètres
        return <SettingsPanel />;

      default:
        return null;
    }
  }

  return (
    <div className={"app-shell" + (sidebarOpen ? " sidebar-open" : "")}>
      <Sidebar active={active} onChange={changeActiveTab} tabs={tabs} open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="main">
        <Header onToggleMenu={() => setSidebarOpen(o => !o)} />
        <div className="container">
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
