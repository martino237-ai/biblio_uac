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
import api from '../api/axios';
import SettingsPanel from '../panels/SettingsPanel';
import PeriodicalsPanel from '../panels/PeriodicalsPanel';
import '../styles/index.css';
 
/* ═══════════════════════════════════════════════════════════
   STYLES — identique au design Admin
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
 
:root {
  --lib-bg:       #f1f5f9;
  --lib-surface:  #ffffff;
  --lib-border:   #e2e8f0;
  --lib-text:     #0f172a;
  --lib-text-2:   #475569;
  --lib-text-3:   #94a3b8;
  --lib-radius:   15px;
  --lib-shadow:   0 1px 3px rgba(15,23,42,.06), 0 4px 14px rgba(15,23,42,.06);
  --lib-shadow-h: 0 8px 32px rgba(15,23,42,.12);
  --lib-tr:       .2s cubic-bezier(.4,0,.2,1);
}
 
/* ── WRAPPER DASHBOARD ── */
.lib-dashboard { font-family: 'Inter', sans-serif; color: var(--lib-text); padding: 4px 0 32px; }
 
/* ── HEADER ── */
.lib-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 14px; margin-bottom: 28px;
}
.lib-eyebrow {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 20px;
  background: var(--lib-primary-lt, #eff6ff); border: 1px solid #bfdbfe;
  color: #2563eb; font-size: .65rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .09em; margin-bottom: 7px;
}
.lib-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.85rem; font-weight: 700; color: var(--lib-text);
  margin: 0 0 4px;
}
.lib-sub { font-size: .82rem; color: var(--lib-text-3); margin: 0; }
.lib-head-right { display: flex; align-items: center; gap: 10px; }
.lib-chip {
  display: flex; align-items: center; gap: 7px;
  padding: 8px 14px; border-radius: 10px;
  background: var(--lib-surface); border: 1px solid var(--lib-border);
  font-size: .78rem; color: var(--lib-text-2); font-weight: 500;
  box-shadow: var(--lib-shadow);
}
.lib-refresh {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--lib-surface); border: 1px solid var(--lib-border);
  color: var(--lib-text-2); cursor: pointer; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  box-shadow: var(--lib-shadow); transition: var(--lib-tr);
}
.lib-refresh:hover { background: #f8fafc; color: #2563eb; border-color: #bfdbfe; }
 
/* ── GRILLE STATS ── */
.lib-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px; margin-bottom: 28px;
}
 
/* ── STAT CARD ── */
.lib-stat {
  background: var(--lib-surface); border: 1px solid var(--lib-border);
  border-radius: var(--lib-radius); padding: 20px 20px 16px;
  box-shadow: var(--lib-shadow); position: relative; overflow: hidden;
  cursor: default;
  transition: transform var(--lib-tr), box-shadow var(--lib-tr), border-color var(--lib-tr);
  animation: libUp .4s ease both;
}
.lib-stat:hover {
  transform: translateY(-4px); box-shadow: var(--lib-shadow-h);
  border-color: transparent;
}
.lib-stat::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: var(--c, #e2e8f0); border-radius: 15px 15px 0 0;
  opacity: 0; transition: opacity .2s;
}
.lib-stat:hover::before { opacity: 1; }
.lib-stat::after {
  content: '';
  position: absolute; top: -30px; right: -30px;
  width: 90px; height: 90px; border-radius: 50%;
  background: var(--glow, transparent);
  pointer-events: none; opacity: .45;
}
 
@keyframes libUp {
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
}
.lib-stat:nth-child(1){animation-delay:.04s} .lib-stat:nth-child(2){animation-delay:.08s}
.lib-stat:nth-child(3){animation-delay:.12s} .lib-stat:nth-child(4){animation-delay:.16s}
.lib-stat:nth-child(5){animation-delay:.20s} .lib-stat:nth-child(6){animation-delay:.24s}
 
.lib-stat-top {
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px;
}
.lib-stat-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem; flex-shrink: 0; transition: transform .2s;
}
.lib-stat:hover .lib-stat-icon { transform: scale(1.1) rotate(-3deg); }
 
.lib-stat-trend {
  display: inline-flex; align-items: center; gap: 3px;
  padding: 3px 8px; border-radius: 20px; font-size: .68rem; font-weight: 700;
}
.lib-stat-trend.up   { background: #f0fdf4; color: #15803d; }
.lib-stat-trend.down { background: #fef2f2; color: #dc2626; }
.lib-stat-trend.flat { background: #f8fafc; color: #94a3b8; }
 
.lib-stat-val {
  font-size: 2.2rem; font-weight: 800; line-height: 1;
  color: var(--lib-text); margin-bottom: 4px;
  font-variant-numeric: tabular-nums; letter-spacing: -1px;
}
.lib-stat-lbl { font-size: .76rem; color: var(--lib-text-2); font-weight: 500; }
 
.lib-stat-bar-wrap {
  margin-top: 12px; height: 3px; border-radius: 2px;
  background: var(--lib-border); overflow: hidden;
}
.lib-stat-bar {
  height: 100%; border-radius: 2px; background: var(--c, #e2e8f0);
  transition: width 1s cubic-bezier(.4,0,.2,1);
}
 
/* Danger */
.lib-stat.danger {
  background: linear-gradient(135deg, #fff5f5, #fff);
  border-color: #fecaca; --c: #ef4444;
}
.lib-stat.danger .lib-stat-val { color: #dc2626; }
 
/* ── BOTTOM ROW ── */
.lib-bottom { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; }
.lib-card {
  background: var(--lib-surface); border: 1px solid var(--lib-border);
  border-radius: var(--lib-radius); padding: 20px; box-shadow: var(--lib-shadow);
}
.lib-card-title {
  font-family: 'Playfair Display', serif;
  font-size: .95rem; font-weight: 600; color: var(--lib-text);
  margin: 0 0 14px; padding-bottom: 10px;
  border-bottom: 1px solid var(--lib-border);
  display: flex; align-items: center; gap: 7px;
}
.lib-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 7px 0; border-bottom: 1px solid #f8fafc; font-size: .81rem;
}
.lib-row:last-child { border-bottom: none; padding-bottom: 0; }
.lib-row-lbl { color: var(--lib-text-2); display: flex; align-items: center; gap: 5px; }
.lib-row-val { font-weight: 700; color: var(--lib-text); font-variant-numeric: tabular-nums; }
.lib-row-val.red   { color: #dc2626; }
.lib-row-val.green { color: #16a34a; }
.lib-row-val.blue  { color: #2563eb; }
 
/* ── LOADING ── */
.lib-loading {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 60vh; gap: 14px; font-family: 'Inter', sans-serif;
}
.lib-spinner {
  width: 44px; height: 44px;
  border: 3px solid var(--lib-border); border-top-color: #2563eb;
  border-radius: 50%; animation: libSpin .7s linear infinite;
}
@keyframes libSpin { to { transform: rotate(360deg); } }
.lib-loading p { font-size: .85rem; color: var(--lib-text-3); margin: 0; }
 
@media (max-width: 640px) {
  .lib-grid { grid-template-columns: 1fr 1fr; gap: 10px; }
  .lib-stat-val { font-size: 1.7rem; }
  .lib-head { flex-direction: column; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Config cartes stats ── */
const LIB_CARDS = [
  { key:'books',              label:'Total livres',       icon:'📚', color:'#2563eb', iconBg:'#eff6ff', trend:'up',   trendLbl:'+12%', barMax:500  },
  { key:'readers',            label:'Total lecteurs',     icon:'👥', color:'#16a34a', iconBg:'#f0fdf4', trend:'up',   trendLbl:'+8%',  barMax:300  },
  { key:'loans',              label:'Emprunts actifs',    icon:'📖', color:'#7c3aed', iconBg:'#ede9fe', trend:'flat', trendLbl:'stable',barMax:200 },
  { key:'consultations',      label:'Consultations',      icon:'🔍', color:'#0ea5e9', iconBg:'#f0f9ff', trend:'up',   trendLbl:'+5%',  barMax:300  },
  { key:'late',               label:'Retards',            icon:'⚠️', color:'#ef4444', iconBg:'#fef2f2', trend:'down', trendLbl:'urgent',barMax:50, danger:true },
  { key:'consultation_hours', label:'Heures consultées',  icon:'⏱️', color:'#d97706', iconBg:'#fffbeb', trend:'up',   trendLbl:'+3%',  barMax:500, suffix:'h' },
];
 
function todayStr() {
  return new Date().toLocaleDateString('fr-FR', {
    weekday:'long', day:'numeric', month:'long', year:'numeric'
  });
}
 
/* ── Dashboard bibliothécaire ── */
function LibDashboard({ stats, onRefresh }) {
  const { t } = useTranslation();
 
  const taux_retard = stats.loans > 0
    ? Math.round((stats.late / stats.loans) * 100) : 0;
 
  return (
    <div className="lib-dashboard">
 
      {/* Header */}
      <div className="lib-head">
        <div>
          <div className="lib-eyebrow">📚 Espace Bibliothécaire</div>
          <h2 className="lib-title">{t('Tableau de bord')}</h2>
          <p className="lib-sub">{t('Statistiques en temps réel de la bibliothèque')}</p>
        </div>
        <div className="lib-head-right">
          <div className="lib-chip">
            📅 <span style={{textTransform:'capitalize'}}>{todayStr()}</span>
          </div>
          <button className="lib-refresh" onClick={onRefresh} title={t('Actualiser')}>🔄</button>
        </div>
      </div>
 
      {/* Grille stats */}
      <div className="lib-grid">
        {LIB_CARDS.map(card => {
          const value  = stats[card.key] ?? 0;
          const barPct = Math.min(100, Math.round((value / card.barMax) * 100));
          return (
            <div
              key={card.key}
              className={`lib-stat${card.danger ? ' danger' : ''}`}
              style={{
                '--c':    card.color,
                '--glow': `radial-gradient(circle, ${card.color}15, transparent)`,
              }}
            >
              <div className="lib-stat-top">
                <div className="lib-stat-icon" style={{ background: card.iconBg }}>
                  {card.icon}
                </div>
                <span className={`lib-stat-trend ${card.trend}`}>
                  {card.trend === 'up' ? '↑' : card.trend === 'down' ? '↓' : '→'}{' '}
                  {card.trendLbl}
                </span>
              </div>
              <div className="lib-stat-val">
                {value.toLocaleString('fr-FR')}{card.suffix || ''}
              </div>
              <div className="lib-stat-lbl">{t(card.label)}</div>
              <div className="lib-stat-bar-wrap">
                <div className="lib-stat-bar" style={{ width:`${barPct}%` }}/>
              </div>
            </div>
          );
        })}
      </div>
 
      {/* Cartes secondaires */}
      <div className="lib-bottom">
 
        <div className="lib-card">
          <div className="lib-card-title">📊 {t('Résumé rapide')}</div>
          <div className="lib-row"><span className="lib-row-lbl">📚 {t('Livres en catalogue')}</span>  <span className="lib-row-val blue">{stats.books ?? 0}</span></div>
          <div className="lib-row"><span className="lib-row-lbl">👥 {t('Lecteurs inscrits')}</span>    <span className="lib-row-val">{stats.readers ?? 0}</span></div>
          <div className="lib-row"><span className="lib-row-lbl">📖 {t('Emprunts en cours')}</span>   <span className="lib-row-val green">{stats.loans ?? 0}</span></div>
          <div className="lib-row"><span className="lib-row-lbl">🔍 {t('Consultations totales')}</span><span className="lib-row-val">{stats.consultations ?? 0}</span></div>
          <div className="lib-row"><span className="lib-row-lbl">⏱️ {t('Heures consultées')}</span>   <span className="lib-row-val">{stats.consultation_hours ?? 0}h</span></div>
          <div className="lib-row"><span className="lib-row-lbl">⚠️ {t('Retards actifs')}</span>      <span className="lib-row-val red">{stats.late ?? 0}</span></div>
        </div>
 
        <div className="lib-card">
          <div className="lib-card-title">🎯 {t('Indicateurs clés')}</div>
          <div className="lib-row">
            <span className="lib-row-lbl">📊 {t('Taux de retard')}</span>
            <span className={`lib-row-val ${taux_retard > 20 ? 'red' : 'green'}`}>{taux_retard}%</span>
          </div>
          <div className="lib-row">
            <span className="lib-row-lbl">📈 {t('Moy. consultations / lecteur')}</span>
            <span className="lib-row-val">
              {stats.readers > 0 ? (stats.consultations / stats.readers).toFixed(1) : '0'}
            </span>
          </div>
          <div className="lib-row">
            <span className="lib-row-lbl">📉 {t('Emprunts / livre')}</span>
            <span className="lib-row-val">
              {stats.books > 0 ? (stats.loans / stats.books).toFixed(2) : '0'}
            </span>
          </div>
          <div className="lib-row">
            <span className="lib-row-lbl">⏳ {t('Moy. h / consultation')}</span>
            <span className="lib-row-val">
              {stats.consultations > 0 ? (stats.consultation_hours / stats.consultations).toFixed(1) : '0'}h
            </span>
          </div>
          <div className="lib-row">
            <span className="lib-row-lbl">📚 {t('Livres / lecteur')}</span>
            <span className="lib-row-val">
              {stats.readers > 0 ? (stats.books / stats.readers).toFixed(1) : '0'}
            </span>
          </div>
          <div className="lib-row">
            <span className="lib-row-lbl">
              {(stats.late ?? 0) > 0 ? '🔴' : '🟢'} {t('Statut retards')}
            </span>
            <span className={`lib-row-val ${(stats.late ?? 0) > 0 ? 'red' : 'green'}`}>
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
export default function Librarian() {
  const { t } = useTranslation();
 
  injectCSS('lib-css', CSS);
 
  // ✅ TABS AVEC ID FIXES (TRÈS IMPORTANT)
  const tabs = [
    { id: 'dashboard',     label: t('Tableau de bord'), icon: '📊' },
    { id: 'books',         label: t('Livres'),           icon: '📚' },
    { id: 'periodicals',   label: t('Périodiques'),      icon: '📰' },
    { id: 'readers',       label: 'Lecteurs',            icon: '👥' },
    { id: 'loans',         label: t('Emprunts'),         icon: '📖' },
    { id: 'consultations', label: t('Consultations'),    icon: '🔍' },
    { id: 'alerts',        label: 'Alertes',             icon: '⚠️' },
    { id: 'settings',      label: t('Paramètres'),       icon: '⚙️' },
  ];
 
  // ✅ Dashboard actif par défaut
  const [active,      setActive]      = useState('dashboard');
  const [loading,     setLoading]     = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  function changeActiveTab(newActive) {
    if (newActive === active) return; // Ne rien faire si c'est le même onglet
    setLoading(true);
    setTimeout(() => {
      setActive(newActive);
      setLoading(false);
    }, 1000); // 1 seconde de chargement
  }
 
  const [stats, setStats] = useState({
    books: 0, readers: 0, loans: 0,
    consultations: 0, late: 0,
    consultation_hours: 0,
  });
 
  useEffect(() => { loadStats(); }, []);
 
  async function loadStats() {
    try {
      const [booksRes, readersRes, loansRes, consultationsRes] =
        await Promise.all([
          api.get('/books'),
          api.get('/readers'),
          api.get('/loans'),
          api.get('/consultations')
        ]);
 
      const books         = booksRes.data         || [];
      const readers       = readersRes.data        || [];
      const loans         = loansRes.data          || [];
      const consultations = consultationsRes.data  || [];
      const late          = loans.filter(l => l.statut === 'en_retard').length || 0;
 
      setStats({
        books:              books.length,
        readers:            readers.length,
        loans:              loans.length,
        consultations:      consultations.length,
        late,
        consultation_hours: stats.consultation_hours ?? 0,
      });
    } catch (err) {
      console.warn('Erreur chargement stats', err);
    }
  }
 
  function renderPanel() {
    if (loading) {
      return (
        <div className="lib-loading">
          <div className="lib-spinner"/>
          <p>{t('Chargement en cours...')}</p>
        </div>
      );
    }
 
    switch (active) {
      case 'dashboard':     return <LibDashboard stats={stats} onRefresh={loadStats}/>;
      case 'books':         return <BooksPanel onChange={loadStats} />;
      case 'periodicals':   return <PeriodicalsPanel onChange={loadStats} />;
      case 'readers':       return <ReadersPanel onChange={loadStats} />;
      case 'loans':         return <LoansPanel onChange={loadStats} />;
      case 'consultations': return <ConsultationsPanel onChange={loadStats} />;
      case 'alerts':        return <AlertsPanel />;
      case 'settings':      return <SettingsPanel />;
      default:              return null;
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
          <div className="toolbar flex flex-wrap gap-4 items-center mb-4">
            {/* export buttons can be added here */}
          </div>
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}