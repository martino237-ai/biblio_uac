import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import '../styles/index.css'

export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    books: 0,
    readers: 0,
    loans: 0,
    consultations: 0,
    late: 0,
    consultation_hours: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await api.get('/stats/summary');
      setStats(res.data);
    } catch (err) {
      console.warn('Erreur chargement stats', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="card">Chargement...</div>;

  return (
    <div className="container">
      <h2 style={{ marginBottom: 20 }}>{t('Tableau de bord')}</h2>
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
          <div className="stat-title">📖 {t('Emprunts')}</div>
          <div className="stat-value">{stats.loans}</div>
        </div>
        <div className="card stat stat-card">
          <div className="stat-title">🔍 {t('Consultations')}</div>
          <div className="stat-value">{stats.consultations}</div>
        </div>
        <div className="card stat danger stat-card">
          <div className="stat-title">⚠️ {t('Retards')}</div>
          <div className="stat-value" style={{ color: '#ef4444' }}>{stats.late}</div>
        </div>
        <div className="card stat stat-card">
          <div className="stat-title">⏱️ {t('Heures consultées')}</div>
          <div className="stat-value">{stats.consultation_hours}h</div>
        </div>
      </div>
    </div>
  );
}
