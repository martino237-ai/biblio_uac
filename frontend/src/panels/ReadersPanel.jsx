import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import api from "../api/axios";
import Modal from "../shared/Modal";
import SearchBar from "../shared/SearchBar";
import ReaderDetailsPanel from "./ReaderDetailsPanel";
import { FACULTY_OPTIONS, getFiliereOptions } from "../utils/faculties";
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
:root {
  --rp-primary:    #2563eb;
  --rp-primary-dk: #1d4ed8;
  --rp-primary-lt: #eff6ff;
  --rp-success:    #16a34a;
  --rp-warning:    #d97706;
  --rp-danger:     #dc2626;
  --rp-text:       #0f172a;
  --rp-text-2:     #475569;
  --rp-text-3:     #94a3b8;
  --rp-border:     #e2e8f0;
  --rp-surface:    #ffffff;
  --rp-bg:         #f8fafc;
  --rp-radius:     14px;
  --rp-radius-sm:  9px;
  --rp-shadow:     0 2px 12px rgba(15,23,42,.07);
  --rp-shadow-lg:  0 12px 40px rgba(15,23,42,.12);
  --rp-transition: .18s cubic-bezier(.4,0,.2,1);
}
 
.rp { font-family:'Inter',sans-serif; color:var(--rp-text); }
 
/* ── HEADER ── */
.rp-head {
  display:flex; align-items:flex-start; justify-content:space-between;
  flex-wrap:wrap; gap:16px; margin-bottom:24px;
}
.rp-head-left h2 {
  font-family:'Playfair Display',serif;
  font-size:1.9rem; font-weight:700; margin:0 0 5px;
  display:flex; align-items:center; gap:12px;
}
.rp-head-left h2 .rp-title-icon {
  display:inline-flex; align-items:center; justify-content:center;
  width:40px; height:40px; border-radius:11px;
  background:linear-gradient(135deg,#2563eb,#0ea5e9); font-size:1.1rem;
}
.rp-head-left p { color:var(--rp-text-2); font-size:.85rem; margin:0; }
.rp-head-right  { display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
 
/* ── STATS ── */
.rp-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:20px; }
.rp-stat {
  background:var(--rp-bg); border:1px solid var(--rp-border);
  border-radius:var(--rp-radius-sm); padding:12px 16px;
}
.rp-stat-n { font-size:1.5rem; font-weight:700; color:var(--rp-text); line-height:1; }
.rp-stat-l { font-size:.72rem; color:var(--rp-text-3); font-weight:500; margin-top:3px; }
.rp-stat.ok   .rp-stat-n { color:var(--rp-success); }
.rp-stat.warn .rp-stat-n { color:var(--rp-warning); }
.rp-stat.bad  .rp-stat-n { color:var(--rp-danger); }
 
/* ── TOOLBAR ── */
.rp-toolbar {
  display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:16px;
}
.rp-filter-lbl { font-size:.78rem; font-weight:600; color:var(--rp-text-2); }
.rp-filter-btn {
  padding:6px 14px; border-radius:20px; border:1.5px solid var(--rp-border);
  background:var(--rp-surface); color:var(--rp-text-2);
  font-family:'Inter',sans-serif; font-size:.78rem; font-weight:500;
  cursor:pointer; transition:var(--rp-transition); white-space:nowrap;
}
.rp-filter-btn:hover  { background:var(--rp-bg); }
.rp-filter-btn.active {
  background:var(--rp-primary); color:#fff; border-color:var(--rp-primary);
  box-shadow:0 2px 8px rgba(37,99,235,.28);
}
 
/* ── BOUTON NOUVEAU ── */
.rp-btn-new {
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 20px; border-radius:11px; border:none;
  background:linear-gradient(135deg,#2563eb,#1d4ed8); color:#fff;
  font-family:'Inter',sans-serif; font-size:.875rem; font-weight:600;
  cursor:pointer; box-shadow:0 4px 14px rgba(37,99,235,.4);
  transition:var(--rp-transition); white-space:nowrap;
}
.rp-btn-new:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(37,99,235,.5); }
 
/* ══════════════════════════════
   TABLE CARD
══════════════════════════════ */
.rp-card {
  background:var(--rp-surface); border:1px solid var(--rp-border);
  border-radius:var(--rp-radius); box-shadow:var(--rp-shadow); overflow:hidden;
}
 
.rp-table { width:100%; border-collapse:collapse; font-size:.83rem; }
 
.rp-table thead tr {
  background:linear-gradient(90deg,#f8fafc,#f1f5f9);
  border-bottom:2px solid var(--rp-border);
}
.rp-table thead th {
  padding:12px 14px; text-align:left;
  font-size:.7rem; font-weight:700; text-transform:uppercase;
  letter-spacing:.07em; color:var(--rp-text-3); white-space:nowrap;
}
 
.rp-table tbody tr {
  border-bottom:1px solid #f1f5f9; cursor:pointer;
  transition:background var(--rp-transition);
  position:relative;
}
.rp-table tbody tr:last-child { border-bottom:none; }
.rp-table tbody tr:hover { background:#f8faff; }
 
/* barre accent gauche au hover */
.rp-table tbody tr td:first-child {
  position:relative; padding-left:4px;
}
.rp-table tbody tr:hover td:first-child::before {
  content:''; position:absolute; left:0; top:0; bottom:0;
  width:3px; background:var(--rp-primary); border-radius:0 2px 2px 0;
}
 
.rp-table td { padding:11px 14px; vertical-align:middle; color:var(--rp-text); }
 
/* ── AVATAR ── */
.rp-av {
  width:34px; height:34px; border-radius:50%;
  display:inline-flex; align-items:center; justify-content:center;
  font-size:.78rem; font-weight:700; flex-shrink:0;
}
.av-blue   { background:#dbeafe; color:#1e40af; }
.av-teal   { background:#ccfbf1; color:#0f766e; }
.av-purple { background:#ede9fe; color:#6d28d9; }
.av-amber  { background:#fef3c7; color:#b45309; }
.av-pink   { background:#fce7f3; color:#be185d; }
.av-green  { background:#dcfce7; color:#15803d; }
 
.rp-name-cell { display:flex; align-items:center; gap:10px; }
.rp-name-block .rp-fullname {
  font-size:.85rem; font-weight:600; color:var(--rp-text); margin:0;
  white-space:nowrap;
}
.rp-name-block .rp-mat {
  font-size:.7rem; color:var(--rp-text-3);
  font-family:'Courier New',monospace; margin:0;
}
 
/* ── CHIPS ── */
.rp-chip {
  display:inline-block; padding:2px 9px; border-radius:20px;
  font-size:.72rem; font-weight:600; border:1px solid;
  white-space:nowrap;
}
.rp-chip-type {
  background:#eff6ff; color:#1e40af; border-color:#bfdbfe;
}
.rp-chip-filiere {
  background:#f0fdf4; color:#15803d; border-color:#bbf7d0;
}
 
/* ── BADGE STATUT ── */
.rp-status {
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 9px; border-radius:20px; font-size:.72rem; font-weight:700;
  white-space:nowrap;
}
.st-ok   { background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
.st-warn { background:#fffbeb; color:#92400e; border:1px solid #fde68a; }
.st-bad  { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
.rp-status .st-dot { width:6px; height:6px; border-radius:50%; background:currentColor; }
 
/* ── ACTIONS ── */
.rp-actions { display:flex; gap:5px; align-items:center; }
.rp-act {
  display:inline-flex; align-items:center; justify-content:center;
  width:30px; height:30px; border-radius:8px; border:none;
  cursor:pointer; font-size:.85rem; transition:var(--rp-transition);
}
.rp-act:hover { transform:translateY(-2px); }
.rp-act-view   { background:#eff6ff; color:#1d4ed8; }
.rp-act-edit   { background:#fffbeb; color:#b45309; }
.rp-act-delete { background:#fef2f2; color:#dc2626; }
 
/* ── FOOTER TABLE ── */
.rp-table-footer {
  display:flex; align-items:center; justify-content:space-between;
  padding:10px 16px; border-top:1px solid var(--rp-border);
  font-size:.75rem; color:var(--rp-text-3);
}
 
/* ── EMPTY / LOADING ── */
.rp-empty, .rp-loading {
  text-align:center; padding:70px 20px; color:var(--rp-text-2);
}
.rp-empty-icon { font-size:3.5rem; opacity:.4; margin-bottom:14px; }
.rp-empty h3 { font-family:'Playfair Display',serif; font-size:1.1rem; margin:0 0 6px; }
.rp-empty p  { font-size:.83rem; color:var(--rp-text-3); margin:0; }
.rp-spinner {
  width:40px; height:40px; margin:0 auto 14px;
  border:3px solid var(--rp-border); border-top-color:var(--rp-primary);
  border-radius:50%; animation:rp-spin .7s linear infinite;
}
@keyframes rp-spin { to { transform:rotate(360deg); } }
 
/* ══════════════════════
   FORMULAIRE MODAL
══════════════════════ */
.rp-form { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.rp-form .s2 { grid-column:1/-1; }
.rp-field label {
  display:block; margin-bottom:5px;
  font-size:.72rem; font-weight:700; text-transform:uppercase;
  letter-spacing:.07em; color:var(--rp-text-2);
}
.rp-field input,
.rp-field select {
  width:100%; padding:10px 13px; box-sizing:border-box;
  border:1.5px solid var(--rp-border); border-radius:var(--rp-radius-sm);
  font-family:'Inter',sans-serif; font-size:.875rem; color:var(--rp-text);
  background:#fafbfd; outline:none;
  transition:border-color var(--rp-transition), box-shadow var(--rp-transition);
}
.rp-field input:focus,
.rp-field select:focus {
  border-color:var(--rp-primary);
  box-shadow:0 0 0 3px rgba(37,99,235,.1); background:#fff;
}
.rp-field input:disabled,
.rp-field select:disabled { opacity:.5; cursor:not-allowed; }
 
.rp-form-actions { display:flex; gap:10px; margin-top:6px; grid-column:1/-1; }
.rp-save {
  flex:1; padding:12px; border:none; border-radius:var(--rp-radius-sm);
  background:linear-gradient(135deg,#16a34a,#15803d); color:#fff;
  font-family:'Inter',sans-serif; font-size:.9rem; font-weight:700;
  cursor:pointer; box-shadow:0 4px 12px rgba(22,163,74,.3);
  transition:var(--rp-transition);
}
.rp-save:hover { transform:translateY(-1px); filter:brightness(1.05); }
.rp-cancel {
  flex:1; padding:12px; border:1.5px solid var(--rp-border);
  border-radius:var(--rp-radius-sm); background:#f8fafc;
  color:var(--rp-text-2); font-family:'Inter',sans-serif;
  font-size:.9rem; font-weight:600; cursor:pointer; transition:var(--rp-transition);
}
.rp-cancel:hover { background:#f1f5f9; color:var(--rp-text); }
 
@media(max-width:640px){
  .rp-stats { grid-template-columns:1fr 1fr; }
  .rp-form  { grid-template-columns:1fr; }
  .rp-form .s2 { grid-column:1; }
  .rp-head  { flex-direction:column; }
  .rp-table thead th:nth-child(5),
  .rp-table tbody td:nth-child(5),
  .rp-table thead th:nth-child(6),
  .rp-table tbody td:nth-child(6) { display:none; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Avatar couleur selon index ── */
const AV_COLORS = ['av-blue','av-teal','av-purple','av-amber','av-pink','av-green'];
function avColor(idx) { return AV_COLORS[idx % AV_COLORS.length]; }
function initials(r) {
  return ((r.prenom?.[0] || '') + (r.nom?.[0] || '')).toUpperCase() || '?';
}
 
/* ── Statut lecteur (basé sur retards éventuels) ── */
function readerStatus(r) {
  if (r.statut === 'suspendu' || r.suspendu) return { cls:'st-bad',  label:'Suspendu' };
  if ((r.retards ?? 0) > 0)                  return { cls:'st-warn', label:'En retard' };
  return                                             { cls:'st-ok',   label:'Actif' };
}
 
/* ── Champ formulaire ── */
function F({ label, s2, children }) {
  return (
    <div className={`rp-field${s2 ? ' s2' : ''}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════ */
export default function ReadersPanel({ onChange }) {
  const { t } = useTranslation();
  const [readers,        setReaders]        = useState([]);
  const [loading,        setLoading]        = useState(false);
  const [localQuery,     setLocalQuery]     = useState('');
  const [modal,          setModal]          = useState(false);
  const [editing,        setEditing]        = useState(null);
  const [selectedReader, setSelectedReader] = useState(null);
  const [filterSt,       setFilterSt]       = useState('all');
 
  const [form, setForm] = useState({
    matricule:"", nom:"", prenom:"", type:"etudiant",
    faculte:"", filiere:"", niveau:"", email:"", telephone:""
  });
 
  const filiereOptions = getFiliereOptions(form.faculte);
 
  injectCSS("rp-css", CSS);
 
  useEffect(() => {
    setForm(f => ({ ...f, filiere:'' }));
  }, [form.faculte]);
 
  /* ════ API (100 % identiques à l'original) ════ */
  const fetchReaders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/readers", { params: { q: localQuery } });
      setReaders(res.data || []);
    } catch (err) {
      console.error(err);
      alert(t("Erreur chargement des lecteurs"));
    } finally { setLoading(false); }
  }, [localQuery, t]);
 
  useEffect(() => { fetchReaders(); }, [fetchReaders]);
 
  function openNew() {
    setEditing(null);
    setForm({ matricule:"", nom:"", prenom:"", type:"etudiant",
              faculte:"", filiere:"", niveau:"", email:"", telephone:"" });
    setModal(true);
  }
 
  function openEdit(r) {
    setEditing(r);
    setForm({ ...r });
    setModal(true);
  }
 
  async function submit(e) {
    e.preventDefault();
    if (!form.nom || !form.prenom) return alert("Nom et prénom sont obligatoires");
    try {
      if (editing) await api.put(`/readers/${editing.id}`, form);
      else         await api.post("/readers", form);
      setModal(false); fetchReaders(); onChange && onChange();
    } catch (err) {
      console.error(err);
      alert("Erreur sauvegarde");
    }
  }
 
  async function remove(id) {
    if (!window.confirm(t("Supprimer ce lecteur ?"))) return;
    try {
      await api.delete(`/readers/${id}`);
      fetchReaders(); onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t("Erreur suppression"));
    }
  }
 
  /* ── Filtrage local ── */
  const visible = readers.filter(r => {
    const st = readerStatus(r);
    if (filterSt === 'ok')   return st.cls === 'st-ok';
    if (filterSt === 'warn') return st.cls === 'st-warn';
    if (filterSt === 'bad')  return st.cls === 'st-bad';
    return true;
  });
 
  const totalOk   = readers.filter(r => readerStatus(r).cls === 'st-ok').length;
  const totalWarn = readers.filter(r => readerStatus(r).cls === 'st-warn').length;
  const totalBad  = readers.filter(r => readerStatus(r).cls === 'st-bad').length;
 
  /* ════ RENDER ════ */
  return (
    <div className="rp">
 
      {/* ── HEADER ── */}
      <div className="rp-head">
        <div className="rp-head-left">
          <h2>
            <span className="rp-title-icon">👥</span>
            {t('Gestion des lecteurs')}
          </h2>
          <p>{t('Cliquez sur une ligne pour voir le profil et l\'historique complet')}</p>
        </div>
        <div className="rp-head-right">
          <SearchBar
            value={localQuery}
            onChange={setLocalQuery}
            placeholder={t("Nom, matricule, filière...")}
          />
          <button className="rp-btn-new" onClick={openNew}>
            <span style={{fontSize:'1rem'}}>＋</span>
            {t('Nouveau lecteur')}
          </button>
        </div>
      </div>
 
      {/* ── STATS ── */}
      <div className="rp-stats">
        <div className="rp-stat">
          <div className="rp-stat-n">{readers.length}</div>
          <div className="rp-stat-l">{t('inscrits')}</div>
        </div>
        <div className="rp-stat ok">
          <div className="rp-stat-n">{totalOk}</div>
          <div className="rp-stat-l">{t('actifs')}</div>
        </div>
        <div className="rp-stat warn">
          <div className="rp-stat-n">{totalWarn}</div>
          <div className="rp-stat-l">{t('en retard')}</div>
        </div>
        <div className="rp-stat bad">
          <div className="rp-stat-n">{totalBad}</div>
          <div className="rp-stat-l">{t('suspendus')}</div>
        </div>
      </div>
 
      {/* ── FILTRES ── */}
      <div className="rp-toolbar">
        <span className="rp-filter-lbl">Filtrer :</span>
        {[
          { key:'all',  label:'📋 Tous' },
          { key:'ok',   label:'🟢 Actifs' },
          { key:'warn', label:'🟡 En retard' },
          { key:'bad',  label:'🔴 Suspendus' },
        ].map(f => (
          <button
            key={f.key}
            className={`rp-filter-btn${filterSt === f.key ? ' active' : ''}`}
            onClick={() => setFilterSt(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
 
      {/* ── TABLE CARD ── */}
      <div className="rp-card">
        {loading ? (
          <div className="rp-loading">
            <div className="rp-spinner"/>
            <p style={{margin:0, fontSize:'.85rem'}}>{t('Chargement des lecteurs...')}</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="rp-empty">
            <div className="rp-empty-icon">👤</div>
            <h3>{t('Aucun lecteur trouvé')}</h3>
            <p>{t('Modifiez votre recherche ou ajoutez un nouveau lecteur.')}</p>
          </div>
        ) : (
          <>
            <div style={{overflowX:'auto'}}>
              <table className="rp-table">
                <thead>
                  <tr>
                    <th>{t('Lecteur')}</th>
                    <th>{t('Type')}</th>
                    <th>{t('Filière')}</th>
                    <th>{t('Niveau')}</th>
                    <th>{t('Téléphone')}</th>
                    <th>{t('Statut')}</th>
                    <th>{t('Actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((r, idx) => {
                    const st = readerStatus(r);
                    return (
                      <tr key={r.id} onClick={() => setSelectedReader(r)}>
 
                        {/* Lecteur — avatar + nom + matricule */}
                        <td>
                          <div className="rp-name-cell">
                            <div className={`rp-av ${avColor(idx)}`}>
                              {initials(r)}
                            </div>
                            <div className="rp-name-block">
                              <p className="rp-fullname">{r.prenom} {r.nom}</p>
                              <p className="rp-mat">{r.matricule || '—'}</p>
                            </div>
                          </div>
                        </td>
 
                        {/* Type */}
                        <td>
                          <span className="rp-chip rp-chip-type">{r.type}</span>
                        </td>
 
                        {/* Filière */}
                        <td>
                          {r.filiere
                            ? <span className="rp-chip rp-chip-filiere">{r.filiere}</span>
                            : <span style={{color:'var(--rp-text-3)'}}>—</span>}
                        </td>
 
                        {/* Niveau */}
                        <td style={{color:'var(--rp-text-2)', fontSize:'.8rem'}}>
                          {r.niveau || '—'}
                        </td>
 
                        {/* Téléphone */}
                        <td style={{color:'var(--rp-text-2)', fontSize:'.8rem'}}>
                          {r.telephone || '—'}
                        </td>
 
                        {/* Statut */}
                        <td>
                          <span className={`rp-status ${st.cls}`}>
                            <span className="st-dot"/>
                            {st.label}
                          </span>
                        </td>
 
                        {/* Actions */}
                        <td onClick={e => e.stopPropagation()}>
                          <div className="rp-actions">
                            <button className="rp-act rp-act-view"
                              title={t('Voir profil')}
                              onClick={() => setSelectedReader(r)}>
                              👁
                            </button>
                            <button className="rp-act rp-act-edit"
                              title={t('Modifier')}
                              onClick={() => openEdit(r)}>
                              ✏️
                            </button>
                            <button className="rp-act rp-act-delete"
                              title={t('Supprimer')}
                              onClick={() => remove(r.id)}>
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
 
            {/* Footer */}
            <div className="rp-table-footer">
              <span>{visible.length} lecteur{visible.length > 1 ? 's' : ''} affiché{visible.length > 1 ? 's' : ''}</span>
              <span style={{fontSize:'.72rem'}}>
                Cliquez sur une ligne pour voir les détails
              </span>
            </div>
          </>
        )}
      </div>
 
      {/* ══ MODAL FORMULAIRE (logique 100 % identique) ══ */}
      {modal && (
        <Modal
          title={editing ? `✏️ ${t('Modifier lecteur')}` : `👥 ${t('Ajouter lecteur')}`}
          onClose={() => setModal(false)}
        >
          <form onSubmit={submit}>
            <div className="rp-form">
 
              <F label="Type">
                <select value={form.type}
                  onChange={e => setForm({ ...form, type:e.target.value })}>
                  <option value="etudiant">Étudiant</option>
                  <option value="enseignant">Enseignant</option>
                  <option value="personnel">Personnel</option>
                  <option value="autre">Autre</option>
                </select>
              </F>
 
              <F label="Nom *">
                <input value={form.nom} required
                  onChange={e => setForm({ ...form, nom:e.target.value })}/>
              </F>
 
              <F label="Prénom *">
                <input value={form.prenom} required
                  onChange={e => setForm({ ...form, prenom:e.target.value })}/>
              </F>
 
              {form.type === "etudiant" && (<>
                <F label="Matricule">
                  <input value={form.matricule} required
                    onChange={e => setForm({ ...form, matricule:e.target.value })}/>
                </F>
 
                <F label="Faculté">
                  <select value={form.faculte} required
                    onChange={e => setForm({ ...form, faculte:e.target.value, filiere:'' })}>
                    <option value="">Sélectionner une faculté</option>
                    {FACULTY_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </F>
 
                <F label="Filière">
                  <select value={form.filiere} required
                    disabled={filiereOptions.length === 0}
                    onChange={e => setForm({ ...form, filiere:e.target.value })}>
                    <option value="">Sélectionner une filière</option>
                    {filiereOptions.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </F>
 
                <F label="Niveau">
                  <input value={form.niveau} required
                    onChange={e => setForm({ ...form, niveau:e.target.value })}/>
                </F>
              </>)}
 
              <F label="Téléphone" s2>
                <input value={form.telephone}
                  onChange={e => setForm({ ...form, telephone:e.target.value })}/>
              </F>
 
              <div className="rp-form-actions">
                <button type="submit" className="rp-save">💾 Sauvegarder</button>
                <button type="button" className="rp-cancel"
                  onClick={() => setModal(false)}>✕ Annuler</button>
              </div>
 
            </div>
          </form>
        </Modal>
      )}
 
      {/* ══ DÉTAILS ══ */}
      {selectedReader && (
        <ReaderDetailsPanel
          reader={selectedReader}
          onClose={() => setSelectedReader(null)}
        />
      )}
    </div>
  );
}