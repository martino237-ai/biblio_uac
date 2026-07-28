import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Modal from '../shared/Modal';
import ExportButton from '../shared/ExportButton';
import ImportExcelButton from '../shared/ImportExcelButton';
import { generateSimplePDF } from '../utils/pdfGenerator';

const CONSULT_EXPORT_COLUMNS = [
  { key: 'Reader.matricule', label: 'Matricule lecteur' },
  { key: 'Reader.nom', label: 'Nom lecteur' },
  { key: 'Reader.prenom', label: 'Prénom lecteur' },
  { key: 'Book.code', label: 'Code livre' },
  { key: 'Book.titre', label: 'Titre livre' },
  { key: 'heure_debut', label: 'Début' },
  { key: 'heure_fin', label: 'Fin' }
];

const CONSULT_IMPORT_COLUMNS = [
  { key: 'matricule', label: 'Matricule lecteur*', example: 'UAC2024001' },
  { key: 'code_livre', label: 'Code livre', example: 'UAC-0001' },
  { key: 'heure_debut', label: 'Début (AAAA-MM-JJ HH:MM)*', example: '2026-01-10 09:30' },
  { key: 'heure_fin', label: 'Fin (AAAA-MM-JJ HH:MM, vide si en cours)', example: '' }
];
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700;800&display=swap');
 
:root {
  --cp-surface:  #ffffff;
  --cp-bg:       #f1f5f9;
  --cp-border:   #e2e8f0;
  --cp-text:     #0f172a;
  --cp-text-2:   #475569;
  --cp-text-3:   #94a3b8;
  --cp-primary:  #2563eb;
  --cp-success:  #16a34a;
  --cp-danger:   #dc2626;
  --cp-warning:  #d97706;
  --cp-radius:   14px;
  --cp-shadow:   0 1px 3px rgba(15,23,42,.06), 0 4px 14px rgba(15,23,42,.06);
  --cp-shadow-lg:0 8px 32px rgba(15,23,42,.11);
  --cp-tr:       .18s cubic-bezier(.4,0,.2,1);
}
html.dark {
  --cp-surface:  #0f172a;
  --cp-bg:       #111827;
  --cp-border:   #374151;
  --cp-text:     #f8fafc;
  --cp-text-2:   #d1d5db;
  --cp-text-3:   #9ca3af;
  --cp-primary:  #60a5fa;
  --cp-success:  #22c55e;
  --cp-danger:   #f87171;
  --cp-warning:  #fbbf24;
  --cp-radius:   14px;
  --cp-shadow:   0 1px 2px rgba(0,0,0,.35), 0 4px 18px rgba(0,0,0,.35);
  --cp-shadow-lg:0 8px 24px rgba(0,0,0,.45);
}
 
/* ── WRAPPER ── */
.cp-wrap { font-family: 'Inter', sans-serif; color: var(--cp-text); }
 
/* ── HEADER ── */
.cp-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  flex-wrap: wrap; gap: 14px; margin-bottom: 24px;
}
.cp-head-left h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.75rem; font-weight: 700; color: var(--cp-text); margin: 0 0 4px;
  display: flex; align-items: center; gap: 10px;
}
.cp-head-left h2 .cp-h-icon {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  display: flex; align-items: center; justify-content: center; font-size: 1rem;
}
.cp-head-left p { font-size: .82rem; color: var(--cp-text-3); margin: 0; }
 
/* ── TOOLBAR ── */
.cp-toolbar {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 20px;
  padding: 14px 16px; background: var(--cp-surface);
  border: 1px solid var(--cp-border); border-radius: var(--cp-radius);
  box-shadow: var(--cp-shadow);
}
.cp-toolbar-label {
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--cp-text-3);
}
.cp-date-input {
  padding: 7px 11px; border: 1.5px solid var(--cp-border); border-radius: 9px;
  font-family: 'Inter', sans-serif; font-size: .82rem; color: var(--cp-text);
  background: var(--cp-bg); outline: none; transition: border-color var(--cp-tr);
}
.cp-date-input:focus { border-color: var(--cp-primary); background: #fff; }
 
.cp-toolbar-sep { width: 1px; height: 28px; background: var(--cp-border); margin: 0 2px; }
.cp-toolbar-spacer { flex: 1; min-width: 8px; }
 
/* ── BOUTONS ── */
.cp-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 9px; border: none;
  font-family: 'Inter', sans-serif; font-size: .82rem; font-weight: 600;
  cursor: pointer; white-space: nowrap; transition: all var(--cp-tr);
}
.cp-btn:hover { transform: translateY(-1px); }
.cp-btn:active { transform: none; }
.cp-btn-primary {
  background: linear-gradient(135deg, var(--cp-primary), #1d4ed8); color: #fff;
  box-shadow: 0 3px 10px rgba(37,99,235,.35);
}
.cp-btn-primary:hover { box-shadow: 0 6px 18px rgba(37,99,235,.45); }
.cp-btn-pdf {
  background: linear-gradient(135deg, #dc2626, #b91c1c); color: #fff;
  box-shadow: 0 3px 10px rgba(220,38,38,.3);
}
.cp-btn-pdf:hover { box-shadow: 0 6px 18px rgba(220,38,38,.4); }
 
/* ── STATS STRIP ── */
.cp-stats { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
.cp-stat-pill {
  display: flex; align-items: center; gap: 7px;
  padding: 6px 14px; border-radius: 40px;
  background: var(--cp-surface); border: 1px solid var(--cp-border);
  font-size: .76rem; font-weight: 500; color: var(--cp-text-2);
  box-shadow: var(--cp-shadow);
}
.cp-stat-dot { width: 7px; height: 7px; border-radius: 50%; }
.sd-blue   { background: var(--cp-primary); }
.sd-green  { background: var(--cp-success); }
.sd-amber  { background: var(--cp-warning); }
 
/* ── TABLE CARD ── */
.cp-card {
  background: var(--cp-surface); border: 1px solid var(--cp-border);
  border-radius: var(--cp-radius); box-shadow: var(--cp-shadow); overflow: hidden;
}
.cp-table { width: 100%; border-collapse: collapse; font-size: .82rem; }
.cp-table thead tr {
  background: linear-gradient(90deg, var(--cp-surface), var(--cp-bg));
  border-bottom: 2px solid var(--cp-border);
}
.cp-table thead th {
  padding: 12px 14px; text-align: left;
  font-size: .68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--cp-text-3); white-space: nowrap;
}
.cp-table tbody tr {
  border-bottom: 1px solid var(--cp-border); cursor: pointer;
  transition: background var(--cp-tr);
}
.cp-table tbody tr:last-child { border-bottom: none; }
.cp-table tbody tr:hover { background: rgba(59,130,246,.08); }
.cp-table tbody tr:hover td:first-child { box-shadow: inset 3px 0 0 var(--cp-primary); }
.cp-table td { padding: 11px 14px; vertical-align: middle; color: var(--cp-text); }
 
/* ── READER CELL ── */
.cp-reader-cell { display: flex; align-items: center; gap: 9px; }
.cp-reader-av {
  width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0;
  background: #dbeafe; color: #1e40af;
  display: flex; align-items: center; justify-content: center;
  font-size: .68rem; font-weight: 700;
}
.cp-reader-name  { font-weight: 600; font-size: .82rem; color: var(--cp-text); }
.cp-reader-mat   { font-size: .7rem; color: var(--cp-text-3); font-family:'Courier New',monospace; }
 
/* ── CHIPS ── */
.cp-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 9px; border-radius: 20px; font-size: .72rem; font-weight: 600;
  border: 1px solid;
}
.cp-chip-book  { background: #f0fdf4; color: #15803d; border-color: #bbf7d0; }
.cp-chip-fil   { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; }
html.dark .cp-chip-book  { background: #0f172a; color: #d1fae5; border-color: #14532d; }
html.dark .cp-chip-fil   { background: #111827; color: #93c5fd; border-color: #1e40af; }
 
/* ── STATUS ── */
.cp-status {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px; border-radius: 20px; font-size: .72rem; font-weight: 700;
}
.cp-status .st-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
.cp-st-active  { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.cp-st-done    { background: #f1f5f9; color: #475569; border: 1px solid #e2e8f0; }
 
/* ── BOUTON TERMINER ── */
.cp-btn-end {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 7px; border: none;
  background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0;
  font-family: 'Inter', sans-serif; font-size: .75rem; font-weight: 600;
  cursor: pointer; transition: all var(--cp-tr);
}
.cp-btn-end:hover { background: #dcfce7; transform: translateY(-1px); }
 
/* ── EMPTY ── */
.cp-empty {
  text-align: center; padding: 70px 20px;
}
.cp-empty-icon { font-size: 3.5rem; opacity: .3; margin-bottom: 12px; }
.cp-empty h3 {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; margin: 0 0 6px; color: var(--cp-text);
}
.cp-empty p { font-size: .83rem; color: var(--cp-text-3); margin: 0; }
 
/* ══ FORMULAIRE ══ */
.cp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.cp-form-grid .s2 { grid-column: 1/-1; }
.cp-field { display: flex; flex-direction: column; gap: 5px; }
.cp-field label {
  font-size: .7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--cp-text-2);
}
.cp-field input,
.cp-field select {
  width: 100%; padding: 10px 13px; box-sizing: border-box;
  border: 1.5px solid var(--cp-border); border-radius: 10px;
  font-family: 'Inter', sans-serif; font-size: .875rem; color: var(--cp-text);
  background: var(--cp-bg); outline: none;
  transition: border-color var(--cp-tr), box-shadow var(--cp-tr);
}
.cp-field input:focus, .cp-field select:focus {
  border-color: var(--cp-primary);
  box-shadow: 0 0 0 3px rgba(37,99,235,.15); background: var(--cp-surface);
}
.cp-form-actions { display: flex; gap: 10px; grid-column: 1/-1; margin-top: 6px; }
.cp-save {
  flex: 1; padding: 12px; border: none; border-radius: 11px;
  background: linear-gradient(135deg, #16a34a, #15803d); color: #fff;
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 700;
  cursor: pointer; box-shadow: 0 4px 12px rgba(22,163,74,.3);
  transition: var(--cp-tr);
}
.cp-save:hover { transform: translateY(-2px); filter: brightness(1.05); }
.cp-cancel {
  flex: 1; padding: 12px; border: 1.5px solid var(--cp-border); border-radius: 11px;
  background: var(--cp-bg); color: var(--cp-text-2);
  font-family: 'Inter', sans-serif; font-size: .9rem; font-weight: 600;
  cursor: pointer; transition: var(--cp-tr);
}
.cp-cancel:hover { background: var(--cp-surface); color: var(--cp-text); }
 
/* ══ MODAL DÉTAILS ══ */
.cp-detail-section {
  background: var(--cp-surface); border: 1px solid var(--cp-border);
  border-radius: 12px; padding: 18px; margin-bottom: 14px;
  box-shadow: var(--cp-shadow);
}
.cp-detail-section-title {
  font-family: 'Playfair Display', serif;
  font-size: .95rem; font-weight: 600; color: var(--cp-text);
  margin: 0 0 14px; padding-bottom: 10px;
  border-bottom: 2px solid var(--cp-border);
  display: flex; align-items: center; gap: 7px;
}
.cp-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.cp-detail-item { display: flex; flex-direction: column; gap: 2px; }
.cp-detail-label {
  font-size: .65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .07em; color: var(--cp-text-3);
}
.cp-detail-val { font-size: .83rem; font-weight: 500; color: var(--cp-text); }
.cp-resume-box {
  background: var(--cp-surface); border: 1px solid var(--cp-border);
  border-radius: 9px; padding: 12px; margin-top: 10px;
}
.cp-resume-box h4 { font-size: .78rem; font-weight: 700; color: var(--cp-text-2); margin: 0 0 6px; }
.cp-resume-box p  { font-size: .82rem; color: var(--cp-text-2); margin: 0; line-height: 1.6; }
 
@media (max-width: 640px) {
  .cp-head { flex-direction: column; }
  .cp-form-grid { grid-template-columns: 1fr; }
  .cp-form-grid .s2 { grid-column: 1; }
  .cp-detail-grid  { grid-template-columns: 1fr; }
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
function fmtDt(dt) {
  if (!dt) return '—';
  const d = new Date(dt);
  return isNaN(d) ? new Date().toLocaleString('fr-FR') : d.toLocaleString('fr-FR');
}
function F({ label, s2, children }) {
  return (
    <div className={`cp-field${s2 ? ' s2' : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
function DetailItem({ label, value }) {
  return (
    <div className="cp-detail-item">
      <span className="cp-detail-label">{label}</span>
      <span className="cp-detail-val">{value || '—'}</span>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL — logique 100 % identique
═══════════════════════════════════════════ */
export default function ConsultationsPanel({ query = '', onChange }) {
  const { t } = useTranslation();
  const [consults,       setConsults]       = useState([]);
  const [readers,        setReaders]        = useState([]);
  const [books,          setBooks]          = useState([]);
  const [modal,          setModal]          = useState(false);
  const [detailsConsult, setDetailsConsult] = useState(null);
  const [form,           setForm]           = useState({ lecteur_id: '', livre_id: '' });
  const [readerQuery,    setReaderQuery]    = useState('');
  const [bookQuery,      setBookQuery]      = useState('');
  const [itemType,       setItemType]       = useState('livre');
  const [startDate,      setStartDate]      = useState('');
  const [endDate,        setEndDate]        = useState('');
 
  injectCSS('cp-css', CSS);
 
  /* ─── API calls identiques à l'original ─── */
  const fetchAll = useCallback(async () => {
    try {
      const params = {};
      if (query) params.q = query;
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (startDate && endDate && dateRegex.test(startDate) && dateRegex.test(endDate)) {
        if (startDate > endDate) {
          params.start = endDate; params.end = startDate;
        } else {
          params.start = startDate; params.end = endDate;
        }
      } else if ((startDate && !dateRegex.test(startDate)) || (endDate && !dateRegex.test(endDate))) {
        console.warn('skipping invalid date params', startDate, endDate);
      }
      const res = await api.get('/consultations', { params });
      setConsults(res.data || []);
    } catch (err) {
      console.error('fetchAll consultations failed', err);
      alert(err?.response?.data?.error || err.message || 'Erreur chargement consultations');
    }
  }, [query, startDate, endDate]);
 
  useEffect(() => { fetchAll(); }, [fetchAll]);
 
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
        const res = await api.get('/books/search', { params: { q: bookQuery, type: itemType } });
        setBooks(res.data || []);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(debounce);
  }, [bookQuery, itemType]);
 
  async function create(e) {
    e.preventDefault();
    try {
      await api.post('/consultations', form);
      setModal(false); fetchAll(); onChange && onChange();
    } catch (err) {
      console.error(err);
      alert('Erreur création consultation: ' + (err?.response?.data?.error || err.message));
    }
  }
 
  async function endConsultation(id) {
    try {
      await api.post(`/consultations/${id}/end`);
      fetchAll();
    } catch (err) {
      console.error(err); alert('Erreur');
    }
  }
 
  const exportToPDF = () => {
    if (consults.length === 0) { alert(t('Aucune consultation a exporter')); return; }
    const data = consults.map(c => ({
      '#': c.id,
      [t('Lecteur')]: c.Reader ? `${c.Reader.nom} ${c.Reader.prenom}` : c.lecteur_id,
      [t('Faculté')]: c.Reader?.faculte || '-',
      [t('Filière')]: c.Reader?.filiere || '-',
      [t('Livre')]:   c.Book ? c.Book.titre : '-',
      [t('Debut')]:   c.heure_debut ? new Date(c.heure_debut).toLocaleString('fr-FR') : '-',
      [t('Fin')]:     c.heure_fin   ? new Date(c.heure_fin).toLocaleString('fr-FR')   : '-',
    }));
    const title    = startDate && endDate ? `Consultations du ${startDate} au ${endDate}` : 'Consultations';
    const filename = `consultations_${startDate||'tous'}_${endDate||'tous'}_${new Date().toISOString().split('T')[0]}.pdf`;
    generateSimplePDF(data, {
      filename, title, org: 'Bibliotheque UAC',
      address: 'Universite Adventiste Cosendai',
      columns: ['#', t('Lecteur'), t('Faculté'), t('Filière'), t('Livre'), t('Debut'), t('Fin')],
      orientation: 'landscape'
    });
  };
 
  /* computed */
  const actives = consults.filter(c => !c.heure_fin).length;
  const termines = consults.filter(c => !!c.heure_fin).length;
 
  /* ════ RENDER ════ */
  return (
    <div className="cp-wrap">
 
      {/* ── HEADER ── */}
      <div className="cp-head">
        <div className="cp-head-left">
          <h2>
            <span className="cp-h-icon">💻</span>
            {t('Consultations')}
          </h2>
          <p>{t('Cliquez sur une ligne pour voir les détails complets')}</p>
        </div>
        <button
          className="cp-btn cp-btn-primary"
          onClick={() => {
            setForm({ lecteur_id: '', livre_id: '' });
            setReaderQuery(''); setBookQuery('');
            setItemType('livre'); setBooks([]);
            setModal(true);
          }}
        >
          ＋ Nouvelle consultation
        </button>
      </div>
 
      {/* ── TOOLBAR ── */}
      <div className="cp-toolbar">
        <span className="cp-toolbar-label">📅 {t('Période')}</span>
        <input type="date" className="cp-date-input" value={startDate}
          onChange={e => setStartDate(e.target.value)}/>
        <span style={{color:'var(--cp-text-3)', fontSize:'.8rem'}}>→</span>
        <input type="date" className="cp-date-input" value={endDate}
          onChange={e => setEndDate(e.target.value)}/>
        <div className="cp-toolbar-sep"/>
        <ExportButton
          endpoint="/consultations"
          filename="consultations.xlsx"
          label={t('Excel')}
          format="xlsx"
          columns={CONSULT_EXPORT_COLUMNS}
        />
        <ImportExcelButton
          endpoint="/consultations/import"
          columns={CONSULT_IMPORT_COLUMNS}
          templateFilename="modele_consultations.xlsx"
          title={t('Import des consultations')}
          onImported={fetchAll}
        />
        <button className="cp-btn cp-btn-pdf" onClick={exportToPDF}>
          📄 {t('Exporter PDF')}
        </button>
      </div>
 
      {/* ── STATS ── */}
      <div className="cp-stats">
        <div className="cp-stat-pill"><span className="cp-stat-dot sd-blue"/>{consults.length} {t('au total')}</div>
        <div className="cp-stat-pill"><span className="cp-stat-dot sd-amber"/>{actives} {t('en cours')}</div>
        <div className="cp-stat-pill"><span className="cp-stat-dot sd-green"/>{termines} {t('terminées')}</div>
      </div>
 
      {/* ── TABLE ── */}
      <div className="cp-card">
        {consults.length === 0 ? (
          <div className="cp-empty">
            <div className="cp-empty-icon">💻</div>
            <h3>{t('Aucune consultation trouvée')}</h3>
            <p>{t('Modifiez les filtres ou créez une nouvelle consultation.')}</p>
          </div>
        ) : (
          <div style={{overflowX:'auto'}}>
            <table className="cp-table">
              <thead>
                <tr>
                  <th>{t('Lecteur')}</th>
                  <th>{t('Faculté')}</th>
                  <th>{t('Filière')}</th>
                  <th>{t('Livre')}</th>
                  <th>{t('Début')}</th>
                  <th>{t('Fin')}</th>
                  <th>{t('Statut')}</th>
                  <th>{t('Action')}</th>
                </tr>
              </thead>
              <tbody>
                {consults.map(c => (
                  <tr key={c.id} onClick={() => setDetailsConsult(c)}>
                    <td>
                      <div className="cp-reader-cell">
                        <div className="cp-reader-av">{initials(c.Reader)}</div>
                        <div>
                          <div className="cp-reader-name">
                            {c.Reader ? `${c.Reader.nom} ${c.Reader.prenom}` : c.lecteur_id}
                          </div>
                          {c.Reader?.matricule && (
                            <div className="cp-reader-mat">{c.Reader.matricule}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      {c.Reader?.faculte
                        ? <span className="cp-chip cp-chip-fil">{c.Reader.faculte}</span>
                        : <span style={{color:'var(--cp-text-3)'}}>—</span>}
                    </td>
                    <td style={{color:'var(--cp-text-2)', fontSize:'.8rem'}}>
                      {c.Reader?.filiere || '—'}
                    </td>
                    <td>
                      {c.Book
                        ? <span className="cp-chip cp-chip-book">📖 {c.Book.titre}</span>
                        : <span style={{color:'var(--cp-text-3)'}}>—</span>}
                    </td>
                    <td style={{fontSize:'.78rem', color:'var(--cp-text-2)'}}>
                      {fmtDt(c.heure_debut)}
                    </td>
                    <td style={{fontSize:'.78rem', color:'var(--cp-text-2)'}}>
                      {c.heure_fin ? fmtDt(c.heure_fin) : '—'}
                    </td>
                    <td>
                      {c.heure_fin
                        ? <span className="cp-status cp-st-done"><span className="st-dot"/>Terminée</span>
                        : <span className="cp-status cp-st-active"><span className="st-dot"/>En cours</span>}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      {!c.heure_fin ? (
                        <button className="cp-btn-end"
                          onClick={() => endConsultation(c.id)}>
                          ✓ {t('Terminer')}
                        </button>
                      ) : <span style={{color:'var(--cp-text-3)'}}>—</span>}
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
        <Modal title={t('Nouvelle consultation')} onClose={() => setModal(false)}>
          <form onSubmit={create}>
            <div className="cp-form-grid">
 
              <F label="Lecteur — recherche" s2>
                <input placeholder="Nom, prénom ou matricule..."
                  value={readerQuery} onChange={e => setReaderQuery(e.target.value)}/>
              </F>
              <F label="Sélectionner le lecteur *" s2>
                <select value={form.lecteur_id}
                  onChange={e => setForm({ ...form, lecteur_id: e.target.value })} required>
                  <option value="">— choisir —</option>
                  {readers.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.nom} {r.prenom} ({r.matricule || '—'})
                    </option>
                  ))}
                </select>
              </F>
 
              <F label="Type de document" s2>
                <select value={itemType}
                  onChange={e => {
                    setItemType(e.target.value);
                    setBookQuery(''); setBooks([]);
                    setForm({ ...form, livre_id: '' });
                  }}>
                  <option value="livre">Ouvrage</option>
                  <option value="périodique">Périodique</option>
                </select>
              </F>
 
              <F label={`${itemType === 'périodique' ? 'Périodique' : 'Ouvrage'} — recherche`} s2>
                <input
                  placeholder={itemType === 'périodique'
                    ? 'Titre, ISSN ou auteur...'
                    : 'Titre, code ou auteur...'}
                  value={bookQuery} onChange={e => setBookQuery(e.target.value)}/>
              </F>
              <F label={`Sélectionner le ${itemType === 'périodique' ? 'périodique' : 'livre'} *`} s2>
                <select value={form.livre_id}
                  onChange={e => setForm({ ...form, livre_id: e.target.value })} required>
                  <option value="">— choisir —</option>
                  {books.filter(b => (b.exemplaires_disponibles ?? 0) > 0).map(b => (
                    <option key={b.id} value={b.id}>
                      {b.titre}{itemType === 'périodique' && b.issn ? ` (ISSN ${b.issn})` : ''}
                    </option>
                  ))}
                </select>
              </F>
 
              <div className="cp-form-actions">
                <button type="submit" className="cp-save">▶ Démarrer la consultation</button>
                <button type="button" className="cp-cancel" onClick={() => setModal(false)}>✕ Annuler</button>
              </div>
            </div>
          </form>
        </Modal>
      )}
 
      {/* ══ MODAL DÉTAILS ══ */}
      {detailsConsult && (
        <Modal title="Détails de la consultation" onClose={() => setDetailsConsult(null)}>
          <div style={{padding:'4px 0'}}>
 
            {/* Lecteur */}
            <div className="cp-detail-section">
              <div className="cp-detail-section-title">👤 {t('Lecteur')}</div>
              {detailsConsult.Reader ? (
                <div className="cp-detail-grid">
                  <DetailItem label="Nom"            value={detailsConsult.Reader.nom}/>
                  <DetailItem label="Prénom"         value={detailsConsult.Reader.prenom}/>
                  <DetailItem label="Matricule"      value={detailsConsult.Reader.matricule}/>
                  <DetailItem label="Email"          value={detailsConsult.Reader.email}/>
                  <DetailItem label="Type"           value={detailsConsult.Reader.type}/>
                  <DetailItem label="Téléphone"      value={detailsConsult.Reader.telephone}/>
                  <DetailItem label="Faculté"        value={detailsConsult.Reader.faculte}/>
                  <DetailItem label="Filière"        value={detailsConsult.Reader.filiere}/>
                  <DetailItem label="Niveau"         value={detailsConsult.Reader.niveau}/>
                  <DetailItem label="Date inscription"
                    value={detailsConsult.Reader.date_inscription
                      ? new Date(detailsConsult.Reader.date_inscription).toLocaleDateString('fr-FR')
                      : null}/>
                  <DetailItem label="Créé le"
                    value={detailsConsult.Reader.createdAt
                      ? new Date(detailsConsult.Reader.createdAt).toLocaleString('fr-FR')
                      : null}/>
                  <DetailItem label="Mis à jour"
                    value={detailsConsult.Reader.updatedAt
                      ? new Date(detailsConsult.Reader.updatedAt).toLocaleString('fr-FR')
                      : null}/>
                </div>
              ) : <p style={{color:'var(--cp-text-3)', margin:0}}>—</p>}
            </div>
 
            {/* Livre */}
            {detailsConsult.Book && (
              <div className="cp-detail-section">
                <div className="cp-detail-section-title">📖 {t('Livre')}</div>
                <div className="cp-detail-grid">
                  <DetailItem label="Titre"         value={detailsConsult.Book.titre}/>
                  <DetailItem label="Auteur"        value={detailsConsult.Book.auteur}/>
                  <DetailItem label="Éditeur"       value={detailsConsult.Book.editeur}/>
                  <DetailItem label="Code"          value={detailsConsult.Book.code}/>
                  <DetailItem label="Type"          value={detailsConsult.Book.type_ouvrage}/>
                  <DetailItem label="Genre"         value={detailsConsult.Book.genre}/>
                  <DetailItem label="Année"         value={detailsConsult.Book.annee_publication}/>
                  <DetailItem label="Édition"       value={detailsConsult.Book.edition}/>
                  <DetailItem label="Langue"        value={detailsConsult.Book.langue}/>
                  <DetailItem label="Pages"         value={detailsConsult.Book.nombre_pages}/>
                  <DetailItem label="État"
                    value={detailsConsult.Book.etat === 'disponible' ? 'Disponible'
                      : detailsConsult.Book.etat === 'reparation' ? 'En réparation' : null}/>
                  <DetailItem label="Emplacement"   value={detailsConsult.Book.emplacement}/>
                  <DetailItem label="Thème"         value={detailsConsult.Book.theme}/>
                  <DetailItem label="Exemplaires"
                    value={`${detailsConsult.Book.exemplaires_disponibles}/${detailsConsult.Book.total_exemplaires}`}/>
                  <DetailItem label="Date acquisition"
                    value={detailsConsult.Book.date_acquisition
                      ? new Date(detailsConsult.Book.date_acquisition).toLocaleDateString('fr-FR')
                      : null}/>
                </div>
                {(detailsConsult.Book.mots_cles || detailsConsult.Book.resume || detailsConsult.Book.description) && (
                  <div style={{marginTop:12, display:'flex', flexDirection:'column', gap:8}}>
                    {detailsConsult.Book.mots_cles && (
                      <div className="cp-resume-box">
                        <h4>Mots-clés</h4><p>{detailsConsult.Book.mots_cles}</p>
                      </div>
                    )}
                    {detailsConsult.Book.resume && (
                      <div className="cp-resume-box">
                        <h4>Résumé</h4><p>{detailsConsult.Book.resume}</p>
                      </div>
                    )}
                    {detailsConsult.Book.description && (
                      <div className="cp-resume-box">
                        <h4>Description</h4><p>{detailsConsult.Book.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
 
            {/* Consultation */}
            <div className="cp-detail-section">
              <div className="cp-detail-section-title">📅 {t('Consultation')}</div>
              <div className="cp-detail-grid">
                <DetailItem label="ID"      value={detailsConsult.id}/>
                <DetailItem label="Créé le"
                  value={detailsConsult.createdAt
                    ? new Date(detailsConsult.createdAt).toLocaleString('fr-FR') : null}/>
                <DetailItem label="Début"   value={fmtDt(detailsConsult.heure_debut)}/>
                <DetailItem label="Fin"     value={detailsConsult.heure_fin ? fmtDt(detailsConsult.heure_fin) : 'En cours'}/>
                <DetailItem label="Durée"
                  value={detailsConsult.heure_fin
                    ? `${Math.round((new Date(detailsConsult.heure_fin) - new Date(detailsConsult.heure_debut)) / 60000)} min`
                    : null}/>
              </div>
            </div>
 
          </div>
        </Modal>
      )}
    </div>
  );
}
 