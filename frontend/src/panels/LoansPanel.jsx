import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Modal from '../shared/Modal';
import { generateSimplePDF } from '../utils/pdfGenerator';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
 
:root {
  --lp-surface:  #ffffff;
  --lp-bg:       #f1f5f9;
  --lp-border:   #e2e8f0;
  --lp-text:     #0f172a;
  --lp-text-2:   #475569;
  --lp-text-3:   #94a3b8;
  --lp-primary:  #2563eb;
  --lp-success:  #16a34a;
  --lp-danger:   #dc2626;
  --lp-warning:  #d97706;
  --lp-purple:   #7c3aed;
  --lp-radius:   14px;
  --lp-shadow:   0 1px 3px rgba(15,23,42,.06), 0 4px 14px rgba(15,23,42,.06);
  --lp-shadow-lg:0 8px 32px rgba(15,23,42,.11);
  --lp-tr:       .18s cubic-bezier(.4,0,.2,1);
}
 
/* ── WRAPPER ── */
.lp-wrap { font-family: 'Inter', sans-serif; color: var(--lp-text); }
 
/* ── HEADER ── */
.lp-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 14px; margin-bottom: 22px;
}
.lp-head-left h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem; font-weight: 700; color: var(--lp-text);
  margin: 0 0 4px; display: flex; align-items: center; gap: 10px;
}
.lp-h-icon {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #7c3aed, #2563eb);
  display: flex; align-items: center; justify-content: center; font-size: 1rem;
}
.lp-head-left p { font-size: .82rem; color: var(--lp-text-3); margin: 0; }
.lp-head-right  { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
 
/* ── TOOLBAR ── */
.lp-toolbar {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
  padding: 14px 16px; background: var(--lp-surface);
  border: 1px solid var(--lp-border); border-radius: var(--lp-radius);
  box-shadow: var(--lp-shadow); margin-bottom: 18px;
}
.lp-toolbar-label {
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--lp-text-3);
}
.lp-date-input, .lp-select {
  padding: 7px 11px; border: 1.5px solid var(--lp-border); border-radius: 9px;
  font-family: 'Inter', sans-serif; font-size: .82rem; color: var(--lp-text);
  background: var(--lp-bg); outline: none; transition: border-color var(--lp-tr);
}
.lp-date-input:focus, .lp-select:focus {
  border-color: var(--lp-primary); background: #fff;
}
.lp-toolbar-sep  { width: 1px; height: 28px; background: var(--lp-border); margin: 0 2px; }
.lp-toolbar-space{ flex: 1; min-width: 6px; }
 
/* ── BOUTONS ── */
.lp-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 9px; border: none;
  font-family: 'Inter', sans-serif; font-size: .82rem; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: all var(--lp-tr);
}
.lp-btn:hover:not(:disabled) { transform: translateY(-1px); }
.lp-btn:active { transform: none; }
.lp-btn-primary {
  background: linear-gradient(135deg, var(--lp-primary), #1d4ed8); color: #fff;
  box-shadow: 0 3px 10px rgba(37,99,235,.35);
}
.lp-btn-primary:hover { box-shadow: 0 6px 18px rgba(37,99,235,.45); }
.lp-btn-pdf {
  background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff;
  box-shadow: 0 3px 10px rgba(220,38,38,.3);
}
.lp-btn-pdf:hover { box-shadow: 0 6px 18px rgba(220,38,38,.4); }
 
/* ── STATS ── */
.lp-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.lp-stat-pill {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 14px; border-radius: 40px;
  background: var(--lp-surface); border: 1px solid var(--lp-border);
  font-size: .76rem; font-weight: 500; color: var(--lp-text-2);
  box-shadow: var(--lp-shadow);
}
.lp-stat-dot { width: 7px; height: 7px; border-radius: 50%; }
.ld-blue   { background: var(--lp-primary); }
.ld-green  { background: var(--lp-success); }
.ld-red    { background: var(--lp-danger);  }
.ld-amber  { background: var(--lp-warning); }
.ld-purple { background: var(--lp-purple);  }
 
/* ── TABLE CARD ── */
.lp-card {
  background: var(--lp-surface); border: 1px solid var(--lp-border);
  border-radius: var(--lp-radius); box-shadow: var(--lp-shadow); overflow: hidden;
}
.lp-table { width: 100%; border-collapse: collapse; font-size: .81rem; }
.lp-table thead tr {
  background: linear-gradient(90deg, #f8fafc, #f1f5f9);
  border-bottom: 2px solid var(--lp-border);
}
.lp-table thead th {
  padding: 12px 13px; text-align: left;
  font-size: .67rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--lp-text-3); white-space: nowrap;
}
.lp-table tbody tr {
  border-bottom: 1px solid #f1f5f9; cursor: pointer;
  transition: background var(--lp-tr);
}
.lp-table tbody tr:last-child { border-bottom: none; }
.lp-table tbody tr:hover { background: #f8faff; }
.lp-table tbody tr.retard { background: #fff5f5; }
.lp-table tbody tr.retard:hover { background: #fee2e2; }
.lp-table tbody tr:hover td:first-child { box-shadow: inset 3px 0 0 var(--lp-primary); }
.lp-table tbody tr.retard:hover td:first-child { box-shadow: inset 3px 0 0 var(--lp-danger); }
.lp-table td { padding: 11px 13px; vertical-align: middle; color: var(--lp-text); }
 
/* ── READER CELL ── */
.lp-reader-cell { display: flex; align-items: center; gap: 9px; }
.lp-reader-av {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  background: #dbeafe; color: #1e40af;
  display: flex; align-items: center; justify-content: center;
  font-size: .68rem; font-weight: 700;
}
.lp-reader-name { font-weight: 600; font-size: .82rem; color: var(--lp-text); }
.lp-reader-mat  { font-size: .7rem; color: var(--lp-text-3); font-family:'Courier New',monospace; }
 
/* ── CHIPS ── */
.lp-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 9px; border-radius: 20px; font-size: .72rem; font-weight: 600; border: 1px solid;
  max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.lp-chip-book   { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.lp-chip-type   { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; font-size: .68rem; }
.lp-chip-type.prolonge { background: #f0f9ff; color: #0369a1; border-color: #bae6fd; }
.lp-chip-type.limite   { background: #fef3c7; color: #92400e; border-color: #fde68a; }
 
/* ── STATUS BADGE ── */
.lp-status {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700;
}
.lp-status .st-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.lp-st-emprunte { background: #eff6ff; color: #1e40af;  border: 1px solid #bfdbfe; }
.lp-st-retard   { background: #fef2f2; color: #991b1b;  border: 1px solid #fecaca; }
.lp-st-retourne { background: #f1f5f9; color: #475569;  border: 1px solid #e2e8f0; }
 
/* ── ACTION BUTTONS ── */
.lp-actions { display: flex; gap: 5px; align-items: center; flex-wrap: wrap; }
.lp-act {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 5px 10px; border-radius: 7px; border: none;
  font-family: 'Inter', sans-serif; font-size: .73rem; font-weight: 600;
  cursor: pointer; transition: all var(--lp-tr); white-space: nowrap;
}
.lp-act:hover { transform: translateY(-1px); }
.lp-act-renew  { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
.lp-act-renew:hover  { background: #ffedd5; }
.lp-act-return { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
.lp-act-return:hover { background: #dcfce7; }
.lp-act-detail { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
.lp-act-detail:hover { background: #e2e8f0; color: var(--lp-text); }
 
/* ── EMPTY ── */
.lp-empty {
  text-align: center; padding: 70px 20px;
}
.lp-empty-icon { font-size: 3.5rem; opacity: .3; margin-bottom: 12px; }
.lp-empty h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; margin: 0 0 6px; color: var(--lp-text);
}
.lp-empty p { font-size: .83rem; color: var(--lp-text-3); margin: 0; }
 
/* ══ FORMULAIRE ══ */
.lp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.lp-form-grid .s2 { grid-column: 1/-1; }
.lp-field { display: flex; flex-direction: column; gap: 5px; }
.lp-field label {
  font-size: .7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--lp-text-2);
}
.lp-field input, .lp-field select {
  width: 100%; padding: 10px 13px; box-sizing: border-box;
  border: 1.5px solid var(--lp-border); border-radius: 10px;
  font-family: 'Inter', sans-serif; font-size: .875rem; color: var(--lp-text);
  background: #fafbfd; outline: none;
  transition: border-color var(--lp-tr), box-shadow var(--lp-tr);
}
.lp-field input:focus, .lp-field select:focus {
  border-color: var(--lp-primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,.1); background: #fff;
}
.lp-form-actions { display: flex; gap: 10px; grid-column: 1/-1; margin-top: 6px; }
.lp-save {
  flex: 1; padding: 12px; border: none; border-radius: 11px;
  background: linear-gradient(135deg, #16a34a, #15803d); color: #fff;
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 700;
  cursor: pointer; box-shadow: 0 4px 12px rgba(22,163,74,.3);
  transition: var(--lp-tr);
}
.lp-save:hover { transform: translateY(-2px); filter: brightness(1.05); }
.lp-cancel {
  flex: 1; padding: 12px; border: 1.5px solid var(--lp-border); border-radius: 11px;
  background: #f8fafc; color: var(--lp-text-2);
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 600;
  cursor: pointer; transition: var(--lp-tr);
}
.lp-cancel:hover { background: #f1f5f9; color: var(--lp-text); }
 
/* ══ MODAL DÉTAILS ══ */
.lp-detail-section {
  background: var(--lp-surface); border: 1px solid var(--lp-border);
  border-radius: 12px; padding: 18px; margin-bottom: 14px;
  box-shadow: var(--lp-shadow);
}
.lp-detail-title {
  font-family: 'Playfair Display', serif;
  font-size: .95rem; font-weight: 600; color: var(--lp-text);
  margin: 0 0 14px; padding-bottom: 10px;
  border-bottom: 2px solid var(--lp-border);
  display: flex; align-items: center; gap: 7px;
}
.lp-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.lp-detail-item { display: flex; flex-direction: column; gap: 2px; }
.lp-detail-label {
  font-size: .65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--lp-text-3);
}
.lp-detail-val { font-size: .83rem; font-weight: 500; color: var(--lp-text); }
.lp-detail-status-wrap { grid-column: 1/-1; margin-top: 4px; }
 
.lp-resume-box {
  background: #f8fafc; border: 1px solid var(--lp-border);
  border-radius: 9px; padding: 12px; margin-top: 10px;
}
.lp-resume-box h4 { font-size: .78rem; font-weight: 700; color: var(--lp-text-2); margin: 0 0 6px; }
.lp-resume-box p  { font-size: .82rem; color: var(--lp-text-2); margin: 0; line-height: 1.6; }
 
/* ── STATUS INLINE DÉTAIL ── */
.lp-detail-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 4px 12px; border-radius: 20px; font-size: .78rem; font-weight: 700;
}
.lp-detail-badge.emprunte { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
.lp-detail-badge.retard   { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.lp-detail-badge.retourne { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
 
@media (max-width: 640px) {
  .lp-head { flex-direction: column; }
  .lp-form-grid { grid-template-columns: 1fr; }
  .lp-form-grid .s2 { grid-column: 1; }
  .lp-detail-grid { grid-template-columns: 1fr; }
  .lp-table thead th:nth-child(2),
  .lp-table tbody td:nth-child(2),
  .lp-table thead th:nth-child(3),
  .lp-table tbody td:nth-child(3) { display: none; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Helpers ── */
function initials(r) {
  if (!r) return '?';
  return ((r.prenom?.[0] || '') + (r.nom?.[0] || '')).toUpperCase() || '?';
}
function fmt(v) { return v || '—'; }
function fmtDate(v) {
  if (!v) return '—';
  return new Date(v).toLocaleDateString('fr-FR');
}
function fmtFull(v) {
  if (!v) return '—';
  return new Date(v).toLocaleString('fr-FR');
}
 
function F({ label, s2, children }) {
  return (
    <div className={`lp-field${s2 ? ' s2' : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
function DI({ label, value }) {
  return (
    <div className="lp-detail-item">
      <span className="lp-detail-label">{label}</span>
      <span className="lp-detail-val">{value || '—'}</span>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL — logique 100 % identique
═══════════════════════════════════════════ */
export default function LoansPanel({ query = '', onChange }) {
  const { t } = useTranslation();
  const [loans,        setLoans]        = useState([]);
  const [books,        setBooks]        = useState([]);
  const [readers,      setReaders]      = useState([]);
  const [modal,        setModal]        = useState(false);
  const [detailsLoan,  setDetailsLoan]  = useState(null);
  const [form,         setForm]         = useState({
    lecteur_id: '', livre_id: '',
    date_emprunt: '', date_retour_prevue: '', type_emprunt: 'normal'
  });
  const [readerQuery,  setReaderQuery]  = useState('');
  const [bookQuery,    setBookQuery]    = useState('');
  const [startDate,    setStartDate]    = useState('');
  const [endDate,      setEndDate]      = useState('');
  const [statusFilter, setStatusFilter] = useState('');
 
  injectCSS('lp-css', CSS);
 
  /* ─── API calls identiques à l'original ─── */
  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, startDate, endDate, statusFilter]);
 
  async function fetchAll() {
    try {
      const params = {};
      if (query) params.q = query;
      if (startDate && endDate) { params.start = startDate; params.end = endDate; }
      if (statusFilter) params.statut = statusFilter;
      const loansRes = await api.get('/loans', { params });
      setLoans(loansRes.data || []);
    } catch (err) {
      console.error(err);
      alert(t('Erreur chargement emprunts (voir console)'));
    }
  }
 
  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (!readerQuery) return setReaders([]);
      try {
        const res = await api.get('/readers/search', { params: { q: readerQuery } });
        setReaders(res.data || []);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(debounce);
  }, [readerQuery]);
 
  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (!bookQuery) return setBooks([]);
      try {
        const res = await api.get('/books/search', { params: { q: bookQuery } });
        setBooks(res.data || []);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(debounce);
  }, [bookQuery]);
 
  async function create(e) {
    e.preventDefault();
    if (new Date(form.date_retour_prevue) <= new Date(form.date_emprunt)) {
      alert(t("La date de retour prévue doit être après la date d'emprunt"));
      return;
    }
    try {
      await api.post('/loans', {
        ...form,
        date_emprunt: form.date_emprunt || new Date().toISOString().slice(0, 10)
      });
      setModal(false); fetchAll(); onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t('Erreur création emprunt:') + ' ' + (err?.response?.data?.error || err.message));
    }
  }
 
  async function doReturn(id) {
    if (!window.confirm(t('Marquer comme rendu ?'))) return;
    try {
      await api.post(`/loans/${id}/return`);
      fetchAll(); onChange && onChange();
    } catch (err) {
      console.error(err); alert(t('Erreur restitution'));
    }
  }
 
  async function renewLoan(id) {
    if (!window.confirm(t('Prolonger cet emprunt de 7 jours ?'))) return;
    try {
      const res = await api.post(`/loans/${id}/renew`);
      fetchAll(); onChange && onChange();
      alert(t('Date de retour prolongée') + ': ' + (res.data.date_retour_prevue || ''));
    } catch (err) {
      console.error(err);
      alert(t('Erreur prolongation :') + ' ' + (err?.response?.data?.error || err?.message));
    }
  }
 
  const exportToPDF = () => {
    if (loans.length === 0) { alert(t('Aucun emprunt a exporter')); return; }
    const data = loans.map(l => ({
      '#': l.id,
      [t('Lecteur')]: l.Reader ? `${l.Reader.nom} ${l.Reader.prenom}` : l.lecteur_id,
      [t('Faculté')]: l.Reader?.faculte || '-',
      [t('Filière')]: l.Reader?.filiere || '-',
      [t('Livre')]:   l.Book ? l.Book.titre : l.livre_id,
      [t('Type')]:    l.type_emprunt === 'prolonge' ? t('Prolongé') : l.type_emprunt === 'limite' ? t('Limité') : t('Normal'),
      [t('Date emprunt')]:       l.date_emprunt || '-',
      [t('Date retour prévu')]:  l.date_retour_prevue || '-',
      [t('Date retour effectif')]:l.date_retour_effective || '-',
      [t('Prolongations')]:      l.prolongations || 0,
      [t('Statut')]: l.statut === 'en_retard' ? t('En retard') : l.statut || '-',
    }));
    const title    = startDate && endDate ? `Emprunts du ${startDate} au ${endDate}` : 'Emprunts';
    const filename = `emprunts_${startDate||'tous'}_${endDate||'tous'}_${new Date().toISOString().split('T')[0]}.pdf`;
    generateSimplePDF(data, {
      filename, title, org: 'Bibliotheque UAC',
      address: 'Universite Adventiste Cosendai',
      columns: ['#', t('Lecteur'), t('Faculté'), t('Filière'), t('Livre'), t('Type'),
        t('Date emprunt'), t('Date retour prévu'), t('Date retour effectif'), t('Prolongations'), t('Statut')],
      orientation: 'landscape'
    });
  };
 
  /* computed stats */
  const enCours  = loans.filter(l => l.statut === 'emprunte').length;
  const enRetard = loans.filter(l => l.statut === 'en_retard').length;
  const retournes= loans.filter(l => l.statut === 'retourne').length;
 
  function statutBadge(statut) {
    if (statut === 'en_retard') return <span className="lp-status lp-st-retard"><span className="st-dot"/>En retard</span>;
    if (statut === 'retourne')  return <span className="lp-status lp-st-retourne"><span className="st-dot"/>Retourné</span>;
    return <span className="lp-status lp-st-emprunte"><span className="st-dot"/>Emprunté</span>;
  }
 
  function typeChip(type) {
    if (type === 'prolonge') return <span className="lp-chip lp-chip-type prolonge">Prolongé</span>;
    if (type === 'limite')   return <span className="lp-chip lp-chip-type limite">Limité</span>;
    return <span className="lp-chip lp-chip-type">Normal</span>;
  }
 
  /* ════ RENDER ════ */
  return (
    <div className="lp-wrap">
 
      {/* ── HEADER ── */}
      <div className="lp-head">
        <div className="lp-head-left">
          <h2>
            <span className="lp-h-icon">📚</span>
            {t('Emprunts')}
          </h2>
          <p>{t('Cliquez sur une ligne pour voir les détails complets')}</p>
        </div>
        <div className="lp-head-right">
          <button className="lp-btn lp-btn-primary"
            onClick={() => {
              setForm({
                lecteur_id:'', livre_id:'',
                date_emprunt: new Date().toISOString().slice(0,10),
                date_retour_prevue:'', type_emprunt:'normal'
              });
              setReaderQuery(''); setBookQuery('');
              setModal(true);
            }}>
            ＋ {t('Nouvel emprunt')}
          </button>
        </div>
      </div>
 
      {/* ── TOOLBAR ── */}
      <div className="lp-toolbar">
        <span className="lp-toolbar-label">📅 {t('Période')}</span>
        <input type="date" className="lp-date-input" value={startDate}
          onChange={e => setStartDate(e.target.value)}/>
        <span style={{color:'var(--lp-text-3)',fontSize:'.8rem'}}>→</span>
        <input type="date" className="lp-date-input" value={endDate}
          onChange={e => setEndDate(e.target.value)}/>
        <div className="lp-toolbar-sep"/>
        <span className="lp-toolbar-label">🔖 {t('Statut')}</span>
        <select className="lp-select" value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}>
          <option value="">{t('Tous')}</option>
          <option value="emprunte">{t('Empruntés')}</option>
          <option value="en_retard">{t('En retard')}</option>
          <option value="retourne">{t('Retournés')}</option>
        </select>
        <div className="lp-toolbar-space"/>
        <button className="lp-btn lp-btn-pdf" onClick={exportToPDF}>
          📄 PDF
        </button>
      </div>
 
      {/* ── STATS ── */}
      <div className="lp-stats">
        <div className="lp-stat-pill"><span className="lp-stat-dot ld-blue"/>{loans.length} {t('au total')}</div>
        <div className="lp-stat-pill"><span className="lp-stat-dot ld-purple"/>{enCours} {t('en cours')}</div>
        <div className="lp-stat-pill"><span className="lp-stat-dot ld-red"/>{enRetard} {t('en retard')}</div>
        <div className="lp-stat-pill"><span className="lp-stat-dot ld-green"/>{retournes} {t('retournés')}</div>
      </div>
 
      {/* ── TABLE ── */}
      <div className="lp-card">
        {loans.length === 0 ? (
          <div className="lp-empty">
            <div className="lp-empty-icon">📚</div>
            <h3>{t('Aucun emprunt trouvé')}</h3>
            <p>{t('Modifiez les filtres ou créez un nouvel emprunt.')}</p>
          </div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="lp-table">
              <thead>
                <tr>
                  <th>{t('Lecteur')}</th>
                  <th>{t('Faculté')}</th>
                  <th>{t('Filière')}</th>
                  <th>{t('Livre')}</th>
                  <th>{t("Type")}</th>
                  <th>{t('Emprunt')}</th>
                  <th>{t('Retour prévu')}</th>
                  <th>{t('Retour effectif')}</th>
                  <th>+</th>
                  <th>{t('Statut')}</th>
                  <th>{t('Actions')}</th>
                </tr>
              </thead>
              <tbody>
                {loans.map(l => (
                  <tr key={l.id}
                    className={l.statut === 'en_retard' ? 'retard' : ''}
                    onClick={() => setDetailsLoan(l)}>
 
                    <td>
                      <div className="lp-reader-cell">
                        <div className="lp-reader-av">{initials(l.Reader)}</div>
                        <div>
                          <div className="lp-reader-name">
                            {l.Reader ? `${l.Reader.nom} ${l.Reader.prenom}` : l.lecteur_id}
                          </div>
                          {(l.Reader?.matricule || l.Reader?.id) && (
                            <div className="lp-reader-mat">{l.Reader.matricule || l.Reader.id}</div>
                          )}
                        </div>
                      </div>
                    </td>
 
                    <td style={{color:'var(--lp-text-2)', fontSize:'.78rem'}}>
                      {l.Reader?.faculte || '—'}
                    </td>
                    <td style={{color:'var(--lp-text-2)', fontSize:'.78rem'}}>
                      {l.Reader?.filiere || '—'}
                    </td>
 
                    <td>
                      {l.Book
                        ? <span className="lp-chip lp-chip-book">📖 {l.Book.titre}</span>
                        : <span style={{color:'var(--lp-text-3)'}}>—</span>}
                    </td>
 
                    <td>{typeChip(l.type_emprunt)}</td>
 
                    <td style={{fontSize:'.78rem', color:'var(--lp-text-2)', whiteSpace:'nowrap'}}>
                      {fmt(l.date_emprunt)}
                    </td>
                    <td style={{
                      fontSize:'.78rem', whiteSpace:'nowrap',
                      color: l.statut === 'en_retard' ? 'var(--lp-danger)' : 'var(--lp-text-2)',
                      fontWeight: l.statut === 'en_retard' ? 700 : 400,
                    }}>
                      {fmt(l.date_retour_prevue)}
                    </td>
                    <td style={{fontSize:'.78rem', color:'var(--lp-text-2)', whiteSpace:'nowrap'}}>
                      {fmt(l.date_retour_effective)}
                    </td>
                    <td style={{textAlign:'center', color:'var(--lp-text-2)'}}>
                      {l.prolongations || 0}
                    </td>
 
                    <td>{statutBadge(l.statut)}</td>
 
                    <td onClick={e => e.stopPropagation()}>
                      <div className="lp-actions">
                        {l.statut === 'emprunte' && (
                          <button className="lp-act lp-act-renew"
                            onClick={() => renewLoan(l.id)}>
                            🔄 {t('Prolonger')}
                          </button>
                        )}
                        {l.statut !== 'retourne' && (
                          <button className="lp-act lp-act-return"
                            onClick={() => doReturn(l.id)}>
                            ✓ {t('Rendre')}
                          </button>
                        )}
                        <button className="lp-act lp-act-detail"
                          onClick={() => setDetailsLoan(l)}>
                          👁
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
 
      {/* ══ MODAL FORMULAIRE ══ */}
      {modal && (
        <Modal title={t('Nouvel emprunt')} onClose={() => setModal(false)}>
          <form onSubmit={create}>
            <div className="lp-form-grid">
 
              <F label="Lecteur — recherche" s2>
                <input placeholder="Nom, prénom ou matricule..."
                  value={readerQuery} onChange={e => setReaderQuery(e.target.value)}/>
              </F>
              <F label="Sélectionner le lecteur *" s2>
                <select value={form.lecteur_id}
                  onChange={e => setForm({...form, lecteur_id:e.target.value})} required>
                  <option value="">— choisir —</option>
                  {readers.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.nom} {r.prenom} ({r.matricule || r.id})
                    </option>
                  ))}
                </select>
              </F>
 
              <F label="Livre — recherche" s2>
                <input placeholder="Titre, code ou auteur..."
                  value={bookQuery} onChange={e => setBookQuery(e.target.value)}/>
              </F>
              <F label="Sélectionner le livre *" s2>
                <select value={form.livre_id}
                  onChange={e => setForm({...form, livre_id:e.target.value})} required>
                  <option value="">— choisir —</option>
                  {books.filter(b => (b.exemplaires_disponibles ?? 0) > 0).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.titre} ({b.exemplaires_disponibles}/{b.total_exemplaires})
                    </option>
                  ))}
                </select>
              </F>
 
              <F label={t("Type d'emprunt")} s2>
                <select value={form.type_emprunt}
                  onChange={e => setForm({...form, type_emprunt:e.target.value})} required>
                  <option value="normal">{t('Normal')}</option>
                  <option value="prolonge">{t('Prolongé')}</option>
                  <option value="limite">{t('Limité')}</option>
                </select>
              </F>
 
              <F label={t('Date emprunt')}>
                <input type="date" value={form.date_emprunt} required
                  onChange={e => setForm({...form, date_emprunt:e.target.value})}/>
              </F>
              <F label={t('Date retour prévue')}>
                <input type="date" value={form.date_retour_prevue} required
                  onChange={e => setForm({...form, date_retour_prevue:e.target.value})}/>
              </F>
 
              <div className="lp-form-actions">
                <button type="submit" className="lp-save">
                  💾 {t('Enregistrer')}
                </button>
                <button type="button" className="lp-cancel"
                  onClick={() => setModal(false)}>
                  ✕ {t('Annuler')}
                </button>
              </div>
 
            </div>
          </form>
        </Modal>
      )}
 
      {/* ══ MODAL DÉTAILS ══ */}
      {detailsLoan && (
        <Modal title={t("Détails de l'emprunt")} onClose={() => setDetailsLoan(null)}>
          <div style={{padding:'4px 0'}}>
 
            {/* Lecteur */}
            <div className="lp-detail-section">
              <div className="lp-detail-title">👤 {t('Lecteur')}</div>
              {detailsLoan.Reader ? (
                <div className="lp-detail-grid">
                  <DI label="Nom"              value={detailsLoan.Reader.nom}/>
                  <DI label="Prénom"           value={detailsLoan.Reader.prenom}/>
                  <DI label="Matricule"        value={detailsLoan.Reader.matricule}/>
                  <DI label="Email"            value={detailsLoan.Reader.email}/>
                  <DI label="Type"             value={detailsLoan.Reader.type}/>
                  <DI label="Téléphone"        value={detailsLoan.Reader.telephone}/>
                  <DI label="Faculté"          value={detailsLoan.Reader.faculte}/>
                  <DI label="Filière"          value={detailsLoan.Reader.filiere}/>
                  <DI label="Niveau"           value={detailsLoan.Reader.niveau}/>
                  <DI label="Date inscription" value={fmtDate(detailsLoan.Reader.date_inscription)}/>
                  <DI label="Créé le"          value={fmtFull(detailsLoan.Reader.createdAt)}/>
                  <DI label="Mis à jour"       value={fmtFull(detailsLoan.Reader.updatedAt)}/>
                </div>
              ) : <p style={{color:'var(--lp-text-3)',margin:0}}>—</p>}
            </div>
 
            {/* Livre */}
            <div className="lp-detail-section">
              <div className="lp-detail-title">📖 {t('Livre')}</div>
              {detailsLoan.Book ? (
                <>
                  <div className="lp-detail-grid">
                    <DI label="Titre"           value={detailsLoan.Book.titre}/>
                    <DI label="Auteur"          value={detailsLoan.Book.auteur}/>
                    <DI label="Éditeur"         value={detailsLoan.Book.editeur}/>
                    <DI label="Code"            value={detailsLoan.Book.code}/>
                    <DI label="Type"            value={detailsLoan.Book.type_ouvrage}/>
                    <DI label="Genre"           value={detailsLoan.Book.genre}/>
                    <DI label="Année"           value={detailsLoan.Book.annee_publication}/>
                    <DI label="Édition"         value={detailsLoan.Book.edition}/>
                    <DI label="Langue"          value={detailsLoan.Book.langue}/>
                    <DI label="Pages"           value={detailsLoan.Book.nombre_pages}/>
                    <DI label="État"            value={
                      detailsLoan.Book.etat === 'disponible' ? 'Disponible'
                        : detailsLoan.Book.etat === 'reparation' ? 'En réparation' : null}/>
                    <DI label="Thème"           value={detailsLoan.Book.theme}/>
                    <DI label="Emplacement"     value={detailsLoan.Book.emplacement}/>
                    <DI label="Date acquisition" value={fmtDate(detailsLoan.Book.date_acquisition)}/>
                    <DI label="Exemplaires"
                      value={`${detailsLoan.Book.exemplaires_disponibles}/${detailsLoan.Book.total_exemplaires}`}/>
                  </div>
                  {(detailsLoan.Book.mots_cles || detailsLoan.Book.resume || detailsLoan.Book.description) && (
                    <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
                      {detailsLoan.Book.mots_cles && (
                        <div className="lp-resume-box"><h4>Mots-clés</h4><p>{detailsLoan.Book.mots_cles}</p></div>
                      )}
                      {detailsLoan.Book.resume && (
                        <div className="lp-resume-box"><h4>Résumé</h4><p>{detailsLoan.Book.resume}</p></div>
                      )}
                      {detailsLoan.Book.description && (
                        <div className="lp-resume-box"><h4>Description</h4><p>{detailsLoan.Book.description}</p></div>
                      )}
                    </div>
                  )}
                </>
              ) : <p style={{color:'var(--lp-text-3)',margin:0}}>—</p>}
            </div>
 
            {/* Emprunt */}
            <div className="lp-detail-section">
              <div className="lp-detail-title">📅 {t('Emprunt')}</div>
              <div className="lp-detail-grid">
                <DI label="ID"                  value={detailsLoan.id}/>
                <DI label="Date emprunt"        value={fmt(detailsLoan.date_emprunt)}/>
                <DI label="Date retour prévue"  value={fmt(detailsLoan.date_retour_prevue)}/>
                <DI label="Date retour effective"
                  value={fmt(detailsLoan.date_retour_effective)}/>
                <DI label={t("Type d'emprunt")}
                  value={detailsLoan.type_emprunt === 'prolonge' ? t('Prolongé')
                    : detailsLoan.type_emprunt === 'limite' ? t('Limité') : t('Normal')}/>
                <DI label="Prolongations"       value={detailsLoan.prolongations || 0}/>
                <DI label="Créé le"             value={fmtFull(detailsLoan.createdAt)}/>
                <DI label="Mis à jour"          value={fmtFull(detailsLoan.updatedAt)}/>
                <div className="lp-detail-status-wrap">
                  <span className="lp-detail-label">Statut</span><br/>
                  <div style={{marginTop:5}}>
                    {(() => {
                      const s = detailsLoan.statut;
                      const cls = s === 'en_retard' ? 'retard' : s === 'retourne' ? 'retourne' : 'emprunte';
                      const lbl = s === 'en_retard' ? 'En retard' : s === 'retourne' ? 'Retourné' : 'Emprunté';
                      return <span className={`lp-detail-badge ${cls}`}>● {lbl}</span>;
                    })()}
                  </div>
                </div>
              </div>
            </div>
 
          </div>
        </Modal>
      )}
    </div>
  );
}