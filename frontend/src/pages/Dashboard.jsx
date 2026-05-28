import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import '../styles/index.css';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
 
:root {
  --db-bg:       #f1f5f9;
  --db-surface:  #ffffff;
  --db-border:   #e2e8f0;
  --db-text:     #0f172a;
  --db-text-2:   #475569;
  --db-text-3:   #94a3b8;
  --db-radius:   16px;
  --db-shadow:   0 1px 3px rgba(15,23,42,.06), 0 4px 16px rgba(15,23,42,.06);
  --db-shadow-lg:0 8px 32px rgba(15,23,42,.10);
  --db-transition:.2s cubic-bezier(.4,0,.2,1);
}
 
.db-wrap {
  font-family: 'Inter', sans-serif;
  color: var(--db-text);
  padding: 4px 0 32px;
}
 
/* ══ HEADER ══ */
.db-header {
  display: flex; align-items: flex-start;
  justify-content: space-between; flex-wrap: wrap;
  gap: 14px; margin-bottom: 32px;
}
.db-header-left {}
.db-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 12px; border-radius: 20px;
  background: #eff6ff; border: 1px solid #bfdbfe;
  color: #2563eb; font-size: .68rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .08em;
  margin-bottom: 8px;
}
.db-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.85rem; font-weight: 700; color: var(--db-text);
  margin: 0 0 4px; line-height: 1.2;
}
.db-subtitle {
  font-size: .83rem; color: var(--db-text-3); margin: 0; font-weight: 400;
}
.db-header-right {
  display: flex; align-items: center; gap: 10px;
}
.db-date-chip {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; border-radius: 10px;
  background: var(--db-surface); border: 1px solid var(--db-border);
  font-size: .78rem; color: var(--db-text-2); font-weight: 500;
  box-shadow: var(--db-shadow);
}
.db-refresh-btn {
  display: flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--db-surface); border: 1px solid var(--db-border);
  color: var(--db-text-2); cursor: pointer;
  box-shadow: var(--db-shadow); transition: var(--db-transition);
  font-size: 1rem;
}
.db-refresh-btn:hover { background: #f8fafc; color: #2563eb; border-color: #bfdbfe; }
 
/* ══ GRID STATS ══ */
.db-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 18px;
  margin-bottom: 32px;
}
 
/* ══ STAT CARD ══ */
.db-stat {
  background: var(--db-surface);
  border: 1px solid var(--db-border);
  border-radius: var(--db-radius);
  padding: 22px 22px 18px;
  box-shadow: var(--db-shadow);
  position: relative; overflow: hidden;
  cursor: default;
  transition: transform var(--db-transition), box-shadow var(--db-transition), border-color var(--db-transition);
  animation: dbFadeUp .4s ease both;
}
.db-stat:hover {
  transform: translateY(-4px);
  box-shadow: var(--db-shadow-lg);
  border-color: transparent;
}
 
/* ligne colorée top */
.db-stat::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--card-color, #e2e8f0);
  border-radius: 16px 16px 0 0;
  opacity: 0; transition: opacity .2s;
}
.db-stat:hover::before { opacity: 1; }
 
/* glow de fond subtil */
.db-stat::after {
  content: '';
  position: absolute; top: -30px; right: -30px;
  width: 100px; height: 100px; border-radius: 50%;
  background: var(--card-bg-glow, transparent);
  pointer-events: none; opacity: .5;
}
 
@keyframes dbFadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.db-stat:nth-child(1){animation-delay:.05s}
.db-stat:nth-child(2){animation-delay:.10s}
.db-stat:nth-child(3){animation-delay:.15s}
.db-stat:nth-child(4){animation-delay:.20s}
.db-stat:nth-child(5){animation-delay:.25s}
.db-stat:nth-child(6){animation-delay:.30s}
 
.db-stat-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; margin-bottom: 16px;
}
.db-stat-icon {
  width: 46px; height: 46px; border-radius: 13px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.3rem; flex-shrink: 0;
  transition: transform .2s;
}
.db-stat:hover .db-stat-icon { transform: scale(1.1) rotate(-3deg); }
 
.db-stat-trend {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 3px 8px; border-radius: 20px;
  font-size: .68rem; font-weight: 700;
}
.db-stat-trend.up   { background: #f0fdf4; color: #15803d; }
.db-stat-trend.down { background: #fef2f2; color: #dc2626; }
.db-stat-trend.flat { background: #f8fafc; color: var(--db-text-3); }
 
.db-stat-value {
  font-size: 2.4rem; font-weight: 800; line-height: 1;
  color: var(--db-text); margin-bottom: 4px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -1px;
}
.db-stat-label {
  font-size: .78rem; color: var(--db-text-2); font-weight: 500;
  display: flex; align-items: center; gap: 5px;
}
 
/* barre de progression en bas */
.db-stat-bar-wrap {
  margin-top: 14px; height: 4px; border-radius: 2px;
  background: var(--db-border); overflow: hidden;
}
.db-stat-bar {
  height: 100%; border-radius: 2px;
  background: var(--card-color, #e2e8f0);
  transition: width 1s cubic-bezier(.4,0,.2,1);
}
 
/* ══ CARD DANGER (retards) ══ */
.db-stat.danger {
  background: linear-gradient(135deg, #fff5f5, #fff);
  border-color: #fecaca;
  --card-color: #ef4444;
  --card-bg-glow: radial-gradient(circle, rgba(239,68,68,.08), transparent);
}
.db-stat.danger .db-stat-value { color: #dc2626; }
 
/* ══ SECTION SECONDAIRE ══ */
.db-secondary {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px; margin-bottom: 24px;
}
.db-info-card {
  background: var(--db-surface); border: 1px solid var(--db-border);
  border-radius: var(--db-radius); padding: 22px;
  box-shadow: var(--db-shadow);
}
.db-info-card-title {
  font-family: 'Playfair Display', serif;
  font-size: .98rem; font-weight: 600; color: var(--db-text);
  margin: 0 0 16px; padding-bottom: 10px;
  border-bottom: 1px solid var(--db-border);
  display: flex; align-items: center; gap: 7px;
}
.db-quick-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 0; border-bottom: 1px solid #f8fafc;
  font-size: .82rem;
}
.db-quick-row:last-child { border-bottom: none; padding-bottom: 0; }
.db-quick-label { color: var(--db-text-2); display: flex; align-items: center; gap: 6px; }
.db-quick-val {
  font-weight: 700; color: var(--db-text);
  font-variant-numeric: tabular-nums;
}
.db-quick-val.red  { color: #dc2626; }
.db-quick-val.green{ color: #16a34a; }
 
/* ══ LOADING ══ */
.db-loading {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 320px; gap: 14px;
}
.db-spinner {
  width: 44px; height: 44px;
  border: 3px solid var(--db-border); border-top-color: #2563eb;
  border-radius: 50%; animation: dbSpin .7s linear infinite;
}
@keyframes dbSpin { to { transform: rotate(360deg); } }
.db-loading p { font-size: .85rem; color: var(--db-text-3); margin: 0; }
 
/* ══ RESPONSIVE ══ */
@media (max-width: 640px) {
  .db-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .db-stat-value { font-size: 1.8rem; }
  .db-header { flex-direction: column; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Config des cartes ── */
const CARDS = [
  {
    key:   'books',
    label: 'Total livres',
    icon:  '📚',
    color: '#2563eb',
    iconBg:'#eff6ff',
    trend: 'up',
    trendLabel: '+12%',
    barMax: 1000,
    suffix: '',
  },
  {
    key:   'readers',
    label: 'Total lecteurs',
    icon:  '👥',
    color: '#16a34a',
    iconBg:'#f0fdf4',
    trend: 'up',
    trendLabel: '+8%',
    barMax: 500,
    suffix: '',
  },
  {
    key:   'loans',
    label: 'Emprunts actifs',
    icon:  '📖',
    color: '#7c3aed',
    iconBg:'#ede9fe',
    trend: 'flat',
    trendLabel: 'stable',
    barMax: 200,
    suffix: '',
  },
  {
    key:   'consultations',
    label: 'Consultations',
    icon:  '🔍',
    color: '#0ea5e9',
    iconBg:'#f0f9ff',
    trend: 'up',
    trendLabel: '+5%',
    barMax: 500,
    suffix: '',
  },
  {
    key:   'late',
    label: 'Retards',
    icon:  '⚠️',
    color: '#ef4444',
    iconBg:'#fef2f2',
    trend: 'down',
    trendLabel: 'À traiter',
    barMax: 50,
    suffix: '',
    danger: true,
  },
  {
    key:   'consultation_hours',
    label: 'Heures consultées',
    icon:  '⏱️',
    color: '#d97706',
    iconBg:'#fffbeb',
    trend: 'up',
    trendLabel: '+3%',
    barMax: 500,
    suffix: 'h',
  },
];
 
/* ── Aujourd'hui formaté ── */
function todayStr() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday:'long', day:'numeric', month:'long', year:'numeric'
  });
}
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL — logique 100 % intacte
═══════════════════════════════════════════ */
export default function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    books: 0, readers: 0, loans: 0,
    consultations: 0, late: 0, consultation_hours: 0
  });
  const [loading, setLoading] = useState(true);
 
  injectCSS('db-css', CSS);
 
  useEffect(() => { loadStats(); }, []);
 
  /* ── API identique à l'original ── */
  async function loadStats() {
    setLoading(true);
    try {
      const res = await api.get('/stats/summary');
      setStats(res.data);
    } catch (err) {
      console.warn('Erreur chargement stats', err);
    } finally {
      setLoading(false);
    }
  }
 
  /* ════ RENDER ════ */
  if (loading) {
    return (
      <div className="db-wrap">
        <div className="db-loading">
          <div className="db-spinner"/>
          <p>{t('Chargement du tableau de bord...')}</p>
        </div>
      </div>
    );
  }
 
  const taux_retard = stats.loans > 0
    ? Math.round((stats.late / stats.loans) * 100)
    : 0;
 
  return (
    <div className="db-wrap">
 
      {/* ══ HEADER ══ */}
      <div className="db-header">
        <div className="db-header-left">
          <div className="db-eyebrow">✦ Vue d'ensemble</div>
          <h2 className="db-title">{t('Tableau de bord')}</h2>
          <p className="db-subtitle">
            {t('Statistiques en temps réel de la bibliothèque')}
          </p>
        </div>
        <div className="db-header-right">
          <div className="db-date-chip">
            📅 <span style={{textTransform:'capitalize'}}>{todayStr()}</span>
          </div>
          <button className="db-refresh-btn" onClick={loadStats} title={t('Actualiser')}>
            🔄
          </button>
        </div>
      </div>
 
      {/* ══ GRILLE STATS ══ */}
      <div className="db-grid">
        {CARDS.map(card => {
          const value = stats[card.key] ?? 0;
          const barPct = Math.min(100, Math.round((value / card.barMax) * 100));
 
          return (
            <div
              key={card.key}
              className={`db-stat${card.danger ? ' danger' : ''}`}
              style={{
                '--card-color': card.color,
                '--card-bg-glow': `radial-gradient(circle, ${card.color}12, transparent)`,
              }}
            >
              {/* Top : icône + trend */}
              <div className="db-stat-top">
                <div
                  className="db-stat-icon"
                  style={{ background: card.iconBg }}
                >
                  {card.icon}
                </div>
                <span className={`db-stat-trend ${card.trend}`}>
                  {card.trend === 'up'   ? '↑' :
                   card.trend === 'down' ? '↓' : '→'}{' '}
                  {card.trendLabel}
                </span>
              </div>
 
              {/* Valeur */}
              <div className="db-stat-value">
                {value.toLocaleString('fr-FR')}{card.suffix}
              </div>
 
              {/* Label */}
              <div className="db-stat-label">
                {t(card.label)}
              </div>
 
              {/* Barre */}
              <div className="db-stat-bar-wrap">
                <div
                  className="db-stat-bar"
                  style={{ width: `${barPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
 
      {/* ══ SECTION SECONDAIRE ══ */}
      <div className="db-secondary">
 
        {/* Résumé rapide */}
        <div className="db-info-card">
          <div className="db-info-card-title">
            📊 {t('Résumé rapide')}
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">📚 {t('Livres en catalogue')}</span>
            <span className="db-quick-val">{stats.books}</span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">👥 {t('Lecteurs inscrits')}</span>
            <span className="db-quick-val">{stats.readers}</span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">📖 {t('Emprunts en cours')}</span>
            <span className="db-quick-val green">{stats.loans}</span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">🔍 {t('Consultations totales')}</span>
            <span className="db-quick-val">{stats.consultations}</span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">⏱️ {t('Heures de consultation')}</span>
            <span className="db-quick-val">{stats.consultation_hours}h</span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">⚠️ {t('Retards actifs')}</span>
            <span className="db-quick-val red">{stats.late}</span>
          </div>
        </div>
 
        {/* Indicateurs de performance */}
        <div className="db-info-card">
          <div className="db-info-card-title">
            🎯 {t('Indicateurs clés')}
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">📊 {t('Taux de retard')}</span>
            <span className={`db-quick-val ${taux_retard > 20 ? 'red' : 'green'}`}>
              {taux_retard}%
            </span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">📈 {t('Moy. consultations / lecteur')}</span>
            <span className="db-quick-val">
              {stats.readers > 0
                ? (stats.consultations / stats.readers).toFixed(1)
                : '0'}
            </span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">📉 {t('Emprunts / livre')}</span>
            <span className="db-quick-val">
              {stats.books > 0
                ? (stats.loans / stats.books).toFixed(2)
                : '0'}
            </span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">⏳ {t('Moy. h / consultation')}</span>
            <span className="db-quick-val">
              {stats.consultations > 0
                ? (stats.consultation_hours / stats.consultations).toFixed(1)
                : '0'}h
            </span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">📚 {t('Livres / lecteur')}</span>
            <span className="db-quick-val">
              {stats.readers > 0
                ? (stats.books / stats.readers).toFixed(1)
                : '0'}
            </span>
          </div>
          <div className="db-quick-row">
            <span className="db-quick-label">
              {stats.late > 0 ? '🔴' : '🟢'} {t('Statut retards')}
            </span>
            <span className={`db-quick-val ${stats.late > 0 ? 'red' : 'green'}`}>
              {stats.late > 0 ? `${stats.late} en attente` : 'Aucun retard'}
            </span>
          </div>
        </div>
 
      </div>
 
    </div>
  );
}