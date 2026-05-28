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
 
/* ═══════════════════════════════════════════════════════════
   STYLES DASHBOARD ADMIN
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
 
:root {
  --adm-bg:       #f1f5f9;
  --adm-surface:  #ffffff;
  --adm-border:   #e2e8f0;
  --adm-text:     #0f172a;
  --adm-text-2:   #475569;
  --adm-text-3:   #94a3b8;
  --adm-radius:   15px;
  --adm-shadow:   0 1px 3px rgba(15,23,42,.06), 0 4px 14px rgba(15,23,42,.06);
  --adm-shadow-h: 0 8px 32px rgba(15,23,42,.12);
  --adm-tr:       .2s cubic-bezier(.4,0,.2,1);
}
 
/* ── WRAPPER ── */
.adm-dashboard { font-family: 'Inter', sans-serif; color: var(--adm-text); padding: 4px 0 32px; }
 
/* ── HEADER ── */
.adm-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 14px; margin-bottom: 28px;
}
.adm-eyebrow {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 20px;
  background: rgba(239,68,68,.08); border: 1px solid rgba(239,68,68,.2);
  color: #dc2626; font-size: .65rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .09em; margin-bottom: 7px;
}
.adm-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.85rem; font-weight: 700; color: var(--adm-text);
  margin: 0 0 4px;
}
.adm-sub { font-size: .82rem; color: var(--adm-text-3); margin: 0; }
.adm-head-right { display: flex; align-items: center; gap: 10px; }
.adm-chip {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; border-radius: 10px;
  background: var(--adm-surface); border: 1px solid var(--adm-border);
  font-size: .78rem; color: var(--adm-text-2); font-weight: 500;
  box-shadow: var(--adm-shadow);
}
.adm-refresh {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--adm-surface); border: 1px solid var(--adm-border);
  color: var(--adm-text-2); cursor: pointer; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--adm-shadow); transition: var(--adm-tr);
}
.adm-refresh:hover { background: #f8fafc; color: #2563eb; border-color: #bfdbfe; }
 
/* ── GRID STATS ── */
.adm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px; margin-bottom: 28px;
}
 
/* ── STAT CARD ── */
.adm-stat {
  background: var(--adm-surface); border: 1px solid var(--adm-border);
  border-radius: var(--adm-radius); padding: 20px 20px 16px;
  box-shadow: var(--adm-shadow); position: relative; overflow: hidden;
  cursor: default;
  transition: transform var(--adm-tr), box-shadow var(--adm-tr), border-color var(--adm-tr);
  animation: admUp .4s ease both;
}
.adm-stat:hover {
  transform: translateY(-4px); box-shadow: var(--adm-shadow-h);
  border-color: transparent;
}
.adm-stat::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--c, #e2e8f0); border-radius: 15px 15px 0 0;
  opacity: 0; transition: opacity .2s;
}
.adm-stat:hover::before { opacity: 1; }
 
@keyframes admUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.adm-stat:nth-child(1){animation-delay:.04s} .adm-stat:nth-child(2){animation-delay:.08s}
.adm-stat:nth-child(3){animation-delay:.12s} .adm-stat:nth-child(4){animation-delay:.16s}
.adm-stat:nth-child(5){animation-delay:.20s} .adm-stat:nth-child(6){animation-delay:.24s}
.adm-stat:nth-child(7){animation-delay:.28s} .adm-stat:nth-child(8){animation-delay:.32s}
.adm-stat:nth-child(9){animation-delay:.36s}
 
.adm-stat-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
.adm-stat-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem; flex-shrink: 0;
  transition: transform .2s;
}
.adm-stat:hover .adm-stat-icon { transform: scale(1.1) rotate(-3deg); }
 
.adm-stat-badge {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 3px 7px; border-radius: 20px;
  font-size: .65rem; font-weight: 700;
}
 
.adm-stat-val {
  font-size: 2.2rem; font-weight: 800; line-height: 1;
  color: var(--adm-text); margin-bottom: 4px;
  font-variant-numeric: tabular-nums; letter-spacing: -1px;
}
.adm-stat-lbl { font-size: .76rem; color: var(--adm-text-2); font-weight: 500; }
 
.adm-stat-bar-wrap {
  margin-top: 12px; height: 3px; border-radius: 2px;
  background: var(--adm-border); overflow: hidden;
}
.adm-stat-bar {
  height: 100%; border-radius: 2px; background: var(--c, #e2e8f0);
  transition: width 1s cubic-bezier(.4,0,.2,1);
}
 
/* Danger */
.adm-stat.danger {
  background: linear-gradient(135deg, #fff5f5, #fff);
  border-color: #fecaca;
  --c: #ef4444;
}
.adm-stat.danger .adm-stat-val { color: #dc2626; }
 
/* ── BOTTOM ROW ── */
.adm-bottom { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.adm-card {
  background: var(--adm-surface); border: 1px solid var(--adm-border);
  border-radius: var(--adm-radius); padding: 20px; box-shadow: var(--adm-shadow);
}
.adm-card-title {
  font-family: 'Playfair Display', serif;
  font-size: .95rem; font-weight: 600; color: var(--adm-text);
  margin: 0 0 14px; padding-bottom: 10px;
  border-bottom: 1px solid var(--adm-border);
  display: flex; align-items: center; gap: 7px;
}
.adm-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 0; border-bottom: 1px solid #f8fafc;
  font-size: .81rem;
}
.adm-row:last-child { border-bottom: none; padding-bottom: 0; }
.adm-row-lbl { color: var(--adm-text-2); display: flex; align-items: center; gap: 5px; }
.adm-row-val { font-weight: 700; color: var(--adm-text); font-variant-numeric: tabular-nums; }
.adm-row-val.red   { color: #dc2626; }
.adm-row-val.green { color: #16a34a; }
.adm-row-val.blue  { color: #2563eb; }
 
/* ── LOADING ── */
.adm-loading {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 60vh; gap: 14px;
  font-family: 'Inter', sans-serif;
}
.adm-spinner {
  width: 44px; height: 44px;
  border: 3px solid var(--adm-border); border-top-color: #dc2626;
  border-radius: 50%; animation: admSpin .7s linear infinite;
}
@keyframes admSpin { to { transform: rotate(360deg); } }
.adm-loading p { font-size: .85rem; color: var(--adm-text-3); margin: 0; }
 
@media (max-width: 640px) {
  .adm-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .adm-stat-val { font-size: 1.7rem; }
  .adm-head { flex-direction: column; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Config des cartes ── */
const ADM_CARDS = [
  { key:'books',              label:'Total livres',       icon:'📚', color:'#2563eb', iconBg:'#eff6ff', barMax:500  },
  { key:'readers',            label:'Total lecteurs',     icon:'👥', color:'#16a34a', iconBg:'#f0fdf4', barMax:300  },
  { key:'consultations',      label:'Consultations',      icon:'🔍', color:'#0ea5e9', iconBg:'#f0f9ff', barMax:300  },
  { key:'loans',              label:'Emprunts',           icon:'📖', color:'#7c3aed', iconBg:'#ede9fe', barMax:200  },
  { key:'consultation_hours', label:'Heures consultées',  icon:'⏱️', color:'#d97706', iconBg:'#fffbeb', barMax:500, suffix:'h' },
  { key:'late',               label:'Retards',            icon:'⚠️', color:'#ef4444', iconBg:'#fef2f2', barMax:50,  danger:true },
  { key:'prolonged_loans',    label:'Prolongations',      icon:'🔄', color:'#06b6d4', iconBg:'#ecfeff', barMax:100  },
  { key:'active_readers',     label:'Lecteurs actifs',    icon:'🎓', color:'#10b981', iconBg:'#ecfdf5', barMax:200  },
  { key:'active_books',       label:'Livres actifs',      icon:'📘', color:'#f59e0b', iconBg:'#fef3c7', barMax:300  },
];
 
function todayStr() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday:'long', day:'numeric', month:'long', year:'numeric'
  });
}
 
/* ── Dashboard Admin Component ── */
function AdminDashboard({ stats, onRefresh }) {
  const { t } = useTranslation();
 
  const taux_retard = stats.loans > 0
    ? Math.round((stats.late / stats.loans) * 100) : 0;
 
  return (
    <div className="adm-dashboard">
 
      {/* Header */}
      <div className="adm-head">
        <div>
          <div className="adm-eyebrow">🔐 Espace Administrateur</div>
          <h2 className="adm-title">{t('Tableau de bord')}</h2>
          <p className="adm-sub">{t('Vue d\'ensemble complète de la bibliothèque')}</p>
        </div>
        <div className="adm-head-right">
          <div className="adm-chip">
            📅 <span style={{textTransform:'capitalize'}}>{todayStr()}</span>
          </div>
          <button className="adm-refresh" onClick={onRefresh} title={t('Actualiser')}>🔄</button>
        </div>
      </div>
 
      {/* Grille stats */}
      <div className="adm-grid">
        {ADM_CARDS.map(card => {
          const value  = stats[card.key] ?? 0;
          const barPct = Math.min(100, Math.round((value / card.barMax) * 100));
          return (
            <div
              key={card.key}
              className={`adm-stat${card.danger ? ' danger' : ''}`}
              style={{ '--c': card.color }}
            >
              <div className="adm-stat-top">
                <div className="adm-stat-icon" style={{ background: card.iconBg }}>
                  {card.icon}
                </div>
                {card.danger && (
                  <span className="adm-stat-badge"
                    style={{ background:'rgba(239,68,68,.12)', color:'#dc2626', border:'1px solid rgba(239,68,68,.25)' }}>
                    ⚠ urgent
                  </span>
                )}
              </div>
              <div className="adm-stat-val">
                {(value ?? 0).toLocaleString('fr-FR')}{card.suffix || ''}
              </div>
              <div className="adm-stat-lbl">{t(card.label)}</div>
              <div className="adm-stat-bar-wrap">
                <div className="adm-stat-bar" style={{ width:`${barPct}%` }}/>
              </div>
            </div>
          );
        })}
      </div>
 
      {/* Cartes secondaires */}
      <div className="adm-bottom">
 
        <div className="adm-card">
          <div className="adm-card-title">📊 {t('Résumé global')}</div>
          <div className="adm-row"><span className="adm-row-lbl">📚 {t('Livres')}</span><span className="adm-row-val blue">{stats.books ?? 0}</span></div>
          <div className="adm-row"><span className="adm-row-lbl">👥 {t('Lecteurs inscrits')}</span><span className="adm-row-val">{stats.readers ?? 0}</span></div>
          <div className="adm-row"><span className="adm-row-lbl">📖 {t('Emprunts')}</span><span className="adm-row-val">{stats.loans ?? 0}</span></div>
          <div className="adm-row"><span className="adm-row-lbl">🔍 {t('Consultations')}</span><span className="adm-row-val">{stats.consultations ?? 0}</span></div>
          <div className="adm-row"><span className="adm-row-lbl">⏱️ {t('Heures consultées')}</span><span className="adm-row-val">{stats.consultation_hours ?? 0}h</span></div>
          <div className="adm-row"><span className="adm-row-lbl">⚠️ {t('Retards')}</span><span className="adm-row-val red">{stats.late ?? 0}</span></div>
        </div>
 
        <div className="adm-card">
          <div className="adm-card-title">🎯 {t('Indicateurs clés')}</div>
          <div className="adm-row">
            <span className="adm-row-lbl">📊 {t('Taux de retard')}</span>
            <span className={`adm-row-val ${taux_retard > 20 ? 'red' : 'green'}`}>{taux_retard}%</span>
          </div>
          <div className="adm-row">
            <span className="adm-row-lbl">🎓 {t('Lecteurs actifs')}</span>
            <span className="adm-row-val green">{stats.active_readers ?? 0}</span>
          </div>
          <div className="adm-row">
            <span className="adm-row-lbl">📘 {t('Livres actifs')}</span>
            <span className="adm-row-val blue">{stats.active_books ?? 0}</span>
          </div>
          <div className="adm-row">
            <span className="adm-row-lbl">🔄 {t('Prolongations')}</span>
            <span className="adm-row-val">{stats.prolonged_loans ?? 0}</span>
          </div>
          <div className="adm-row">
            <span className="adm-row-lbl">📈 {t('Moy. emprunts / lecteur')}</span>
            <span className="adm-row-val">
              {stats.readers > 0 ? (stats.loans / stats.readers).toFixed(1) : '0'}
            </span>
          </div>
          <div className="adm-row">
            <span className="adm-row-lbl">
              {(stats.late ?? 0) > 0 ? '🔴' : '🟢'} {t('Statut retards')}
            </span>
            <span className={`adm-row-val ${(stats.late ?? 0) > 0 ? 'red' : 'green'}`}>
              {(stats.late ?? 0) > 0 ? `${stats.late} en attente` : 'Aucun retard'}
            </span>
          </div>
        </div>
 
      </div>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL — logique 100 % identique
═══════════════════════════════════════════ */
export default function Admin() {
  const { t } = useTranslation();
 
  injectCSS('adm-css', CSS);
 
  const tabs = [
    { id: 'dashboard',  label: t('Tableau de bord'), icon: '📊' },
    { id: 'users',      label: t('Utilisateurs'),    icon: '👥' },
    { id: 'books',      label: t('Ouvrages'),         icon: '📚' },
    { id: 'activities', label: t('Activités'),        icon: '📜' },
    { id: 'alerts',     label: t('Alertes'),          icon: '⚠️' },
    { id: 'stats',      label: t('Statistiques'),     icon: '📈' },
    { id: 'settings',   label: t('Paramètres'),       icon: '⚙️' },
  ];
 
  const [active,      setActive]      = useState('dashboard');
  const [loading,     setLoading]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    books: 0, readers: 0, loans: 0, consultations: 0, late: 0,
  });
 
  function changeActiveTab(newActive) {
    if (newActive === active) return; // Ne rien faire si c'est le même onglet
    setLoading(true);
    setTimeout(() => {
      setActive(newActive);
      setLoading(false);
    }, 1000); // 1 seconde de chargement
  }
 
  useEffect(() => { loadStats(); }, []);
 
  async function loadStats() {
    try {
      const res = await api.get('/stats/summary');
      setStats(res.data);
    } catch (err) {
      console.warn('API stats introuvable → valeurs par défaut utilisées');
      setStats({ books:12, readers:45, loans:18, consultations:73, late:3 });
    }
  }
 
  function renderPanel() {
    if (loading) {
      return (
        <div className="adm-loading">
          <div className="adm-spinner"/>
          <p>{t('Chargement en cours...')}</p>
        </div>
      );
    }
 
    switch (active) {
      case 'dashboard':
        return <AdminDashboard stats={stats} onRefresh={loadStats}/>;
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
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}