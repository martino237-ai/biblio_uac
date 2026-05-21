import React, { useEffect, useState } from "react";
import Modal from "../shared/Modal";
import api from "../api/axios";
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
:root {
  --rd-primary:    #2563eb;
  --rd-primary-lt: #eff6ff;
  --rd-success:    #16a34a;
  --rd-warning:    #d97706;
  --rd-danger:     #dc2626;
  --rd-text:       #0f172a;
  --rd-text-2:     #475569;
  --rd-text-3:     #94a3b8;
  --rd-border:     #e2e8f0;
  --rd-surface:    #ffffff;
  --rd-bg:         #f8fafc;
  --rd-radius:     12px;
  --rd-radius-sm:  8px;
  --rd-shadow:     0 2px 10px rgba(15,23,42,.07);
  --rd-transition: .18s cubic-bezier(.4,0,.2,1);
}
 
.rd { font-family:'Inter',sans-serif; color:var(--rd-text); }
 
/* ══════════════════════════════
   PROFIL HERO
══════════════════════════════ */
.rd-hero {
  display:flex; align-items:center; gap:20px;
  padding:20px; background:linear-gradient(135deg,#1e40af,#2563eb,#0ea5e9);
  border-radius:var(--rd-radius); margin-bottom:20px; color:#fff;
}
 
.rd-avatar-lg {
  width:70px; height:70px; border-radius:50%;
  display:flex; align-items:center; justify-content:center;
  font-size:1.6rem; font-weight:700; flex-shrink:0;
  background:rgba(255,255,255,.25); border:3px solid rgba(255,255,255,.5);
  color:#fff;
}
 
.rd-hero-info { flex:1; }
.rd-hero-name {
  font-family:'Playfair Display',serif;
  font-size:1.4rem; font-weight:700; margin:0 0 4px; color:#fff;
}
.rd-hero-mat {
  font-size:.78rem; font-family:'Courier New',monospace;
  opacity:.85; margin:0 0 8px;
}
.rd-hero-chips { display:flex; gap:6px; flex-wrap:wrap; }
.rd-hero-chip {
  display:inline-block; padding:3px 10px; border-radius:20px;
  font-size:.7rem; font-weight:600;
  background:rgba(255,255,255,.2); color:#fff;
  border:1px solid rgba(255,255,255,.3);
}
 
.rd-hero-status {
  display:flex; align-items:center; gap:5px;
  padding:6px 14px; border-radius:20px; font-size:.75rem; font-weight:700;
  flex-shrink:0;
}
.rd-hero-status.ok   { background:#ecfdf5; color:#065f46; }
.rd-hero-status.warn { background:#fffbeb; color:#92400e; }
.rd-hero-status.bad  { background:#fef2f2; color:#991b1b; }
.rd-hero-status .hst-dot { width:7px; height:7px; border-radius:50%; background:currentColor; }
 
/* ══════════════════════════════
   STATS RAPIDES
══════════════════════════════ */
.rd-quick-stats {
  display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:20px;
}
.rd-qs {
  background:var(--rd-surface); border:1px solid var(--rd-border);
  border-radius:var(--rd-radius-sm); padding:12px 14px; text-align:center;
}
.rd-qs-n { font-size:1.6rem; font-weight:800; color:var(--rd-text); line-height:1; }
.rd-qs-l { font-size:.7rem; color:var(--rd-text-3); font-weight:500; margin-top:3px; }
.rd-qs.ok   .rd-qs-n { color:var(--rd-success); }
.rd-qs.warn .rd-qs-n { color:var(--rd-warning); }
.rd-qs.bad  .rd-qs-n { color:var(--rd-danger); }
 
/* ══════════════════════════════
   INFO GRID
══════════════════════════════ */
.rd-info-card {
  background:var(--rd-surface); border:1px solid var(--rd-border);
  border-radius:var(--rd-radius); padding:18px; margin-bottom:20px;
  box-shadow:var(--rd-shadow);
}
.rd-section-title {
  font-family:'Playfair Display',serif;
  font-size:1rem; font-weight:600; color:var(--rd-text);
  margin:0 0 14px; padding-bottom:8px;
  border-bottom:2px solid var(--rd-primary-lt);
  display:flex; align-items:center; gap:8px;
}
.rd-info-grid {
  display:grid; grid-template-columns:1fr 1fr; gap:10px;
}
.rd-info-row {
  display:flex; flex-direction:column; gap:2px;
}
.rd-info-label { font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.07em; color:var(--rd-text-3); }
.rd-info-val   { font-size:.85rem; font-weight:500; color:var(--rd-text); }
 
/* ══════════════════════════════
   ONGLETS
══════════════════════════════ */
.rd-tabs { display:flex; gap:0; margin-bottom:16px; border-bottom:2px solid var(--rd-border); }
.rd-tab {
  padding:10px 18px; font-size:.82rem; font-weight:600; cursor:pointer;
  color:var(--rd-text-3); border-bottom:2px solid transparent;
  margin-bottom:-2px; transition:var(--rd-transition); white-space:nowrap;
  background:none; border-left:none; border-right:none; border-top:none;
  font-family:'Inter',sans-serif;
}
.rd-tab:hover { color:var(--rd-text-2); }
.rd-tab.active { color:var(--rd-primary); border-bottom-color:var(--rd-primary); }
 
/* ══════════════════════════════
   TABLES HISTORIQUE
══════════════════════════════ */
.rd-hist-card {
  background:var(--rd-surface); border:1px solid var(--rd-border);
  border-radius:var(--rd-radius); overflow:hidden; box-shadow:var(--rd-shadow);
}
 
.rd-hist-table { width:100%; border-collapse:collapse; font-size:.8rem; }
.rd-hist-table thead tr {
  background:linear-gradient(90deg,#f8fafc,#f1f5f9);
  border-bottom:1.5px solid var(--rd-border);
}
.rd-hist-table thead th {
  padding:10px 13px; text-align:left;
  font-size:.68rem; font-weight:700; text-transform:uppercase;
  letter-spacing:.07em; color:var(--rd-text-3); white-space:nowrap;
}
.rd-hist-table tbody tr {
  border-bottom:1px solid #f1f5f9; transition:background var(--rd-transition);
}
.rd-hist-table tbody tr:last-child { border-bottom:none; }
.rd-hist-table tbody tr:hover { background:#f8faff; }
.rd-hist-table td { padding:10px 13px; vertical-align:middle; color:var(--rd-text-2); }
.rd-hist-table td strong { color:var(--rd-text); font-weight:600; }
 
/* ── Badge statut ligne ── */
.rd-badge {
  display:inline-flex; align-items:center; gap:4px;
  padding:3px 9px; border-radius:20px; font-size:.7rem; font-weight:700;
}
.bd-ok     { background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
.bd-warn   { background:#fffbeb; color:#92400e; border:1px solid #fde68a; }
.bd-danger { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }
.bd-info   { background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; }
.bd-dot    { width:5px; height:5px; border-radius:50%; background:currentColor; }
 
/* ── Pénalité ── */
.rd-penalty {
  display:inline-block; padding:2px 8px; border-radius:6px;
  font-size:.72rem; font-weight:700;
  background:#fef2f2; color:#dc2626; border:1px solid #fecaca;
}
 
/* ── Empty state dans tab ── */
.rd-tab-empty {
  text-align:center; padding:40px 20px; color:var(--rd-text-3);
  font-size:.85rem;
}
.rd-tab-empty-icon { font-size:2.5rem; opacity:.35; margin-bottom:10px; }
 
/* ── Spinner ── */
.rd-spinner-wrap { text-align:center; padding:30px; }
.rd-spinner {
  width:36px; height:36px; margin:0 auto 10px;
  border:3px solid var(--rd-border); border-top-color:var(--rd-primary);
  border-radius:50%; animation:rd-spin .7s linear infinite;
}
@keyframes rd-spin { to { transform:rotate(360deg); } }
 
/* ── FOOTER ── */
.rd-footer { display:flex; justify-content:flex-end; padding-top:4px; margin-top:16px; }
.rd-btn-close {
  display:inline-flex; align-items:center; gap:8px;
  padding:10px 26px; border-radius:10px;
  border:1.5px solid var(--rd-border); background:var(--rd-bg);
  color:var(--rd-text-2); font-family:'Inter',sans-serif;
  font-size:.875rem; font-weight:600; cursor:pointer; transition:var(--rd-transition);
}
.rd-btn-close:hover { background:#f1f5f9; color:var(--rd-text); }
 
@media(max-width:640px){
  .rd-hero           { flex-direction:column; text-align:center; }
  .rd-quick-stats    { grid-template-columns:1fr 1fr; }
  .rd-info-grid      { grid-template-columns:1fr; }
  .rd-tabs           { overflow-x:auto; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Helpers ── */
function initials(r) {
  return ((r.prenom?.[0] || '') + (r.nom?.[0] || '')).toUpperCase() || '?';
}
function readerStatus(r) {
  if (r.statut === 'suspendu' || r.suspendu) return { cls:'bad',  label:'Suspendu' };
  if ((r.retards ?? 0) > 0)                  return { cls:'warn', label:'En retard' };
  return                                             { cls:'ok',   label:'Actif' };
}
function fmt(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}
function fmtFull(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('fr-FR');
}
function daysBetween(d1, d2) {
  if (!d1 || !d2) return null;
  const diff = (new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24);
  return Math.round(diff);
}
 
/* ── Composant ligne de date infos ── */
function InfoRow({ label, value }) {
  return (
    <div className="rd-info-row">
      <span className="rd-info-label">{label}</span>
      <span className="rd-info-val">{value || '—'}</span>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════ */
export default function ReaderDetailsPanel({ reader, onClose }) {
  injectCSS("rd-css", CSS);
 
  const [activeTab,    setActiveTab]    = useState('emprunts');
  const [emprunts,     setEmprunts]     = useState([]);
  const [consultations,setConsultations]= useState([]);
  const [loading,      setLoading]      = useState(false);
 
  /* ── Chargement historique ── */
  useEffect(() => {
    if (!reader) return;
    async function load() {
      setLoading(true);
      try {
        const [empRes, conRes] = await Promise.all([
          api.get(`/readers/${reader.id}/loans`).catch(() => ({ data:[] })),
          api.get(`/readers/${reader.id}/consultations`).catch(() => ({ data:[] })),
        ]);
        setEmprunts(empRes.data || []);
        setConsultations(conRes.data || []);
      } finally { setLoading(false); }
    }
    load();
  }, [reader]);
 
  if (!reader) return null;
 
  const st = readerStatus(reader);
 
  /* ── Stats calculées ── */
  const totalEmprunts    = emprunts.length;
  const enCours          = emprunts.filter(e => !e.date_retour_effective).length;
  const retards          = emprunts.filter(e => {
    if (e.date_retour_effective) return false;
    if (!e.date_retour_prevue) return false;
    return new Date(e.date_retour_prevue) < new Date();
  }).length;
  const totalConsultations = consultations.length;
 
  /* ── Onglet emprunts ── */
  function TabEmprunts() {
    if (loading) return (
      <div className="rd-spinner-wrap">
        <div className="rd-spinner"/>
        <p style={{color:'var(--rd-text-3)', fontSize:'.82rem', margin:0}}>Chargement...</p>
      </div>
    );
    if (emprunts.length === 0) return (
      <div className="rd-tab-empty">
        <div className="rd-tab-empty-icon">📚</div>
        <p>Aucun emprunt enregistré pour ce lecteur.</p>
      </div>
    );
 
    return (
      <div className="rd-hist-card">
        <table className="rd-hist-table">
          <thead>
            <tr>
              <th>Ouvrage</th>
              <th>Code</th>
              <th>Date emprunt</th>
              <th>Retour prévu</th>
              <th>Retour effectif</th>
              <th>Durée</th>
              <th>Statut</th>
              <th>Pénalité</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.map((e, i) => {
              const enRetard = !e.date_retour_effective &&
                e.date_retour_prevue && new Date(e.date_retour_prevue) < new Date();
              const rendu    = !!e.date_retour_effective;
              const duree    = rendu
                ? daysBetween(e.date_emprunt, e.date_retour_effective)
                : daysBetween(e.date_emprunt, new Date());
 
              let badge, bCls;
              if (rendu)          { badge = '✅ Retourné'; bCls = 'bd-ok'; }
              else if (enRetard)  { badge = '🔴 En retard'; bCls = 'bd-danger'; }
              else                { badge = '🟡 En cours'; bCls = 'bd-warn'; }
 
              return (
                <tr key={e.id ?? i}>
                  <td><strong>{e.titre || e.book?.titre || '—'}</strong></td>
                  <td style={{fontFamily:"'Courier New',monospace", fontSize:'.72rem', color:'var(--rd-primary)'}}>
                    {e.code || e.book?.code || '—'}
                  </td>
                  <td>{fmt(e.date_emprunt)}</td>
                  <td style={{color: enRetard ? 'var(--rd-danger)' : 'inherit'}}>
                    {fmt(e.date_retour_prevue)}
                  </td>
                  <td>{rendu ? fmt(e.date_retour_effective) : <span style={{color:'var(--rd-text-3)'}}>—</span>}</td>
                  <td style={{fontWeight:600}}>{duree != null ? `${duree}j` : '—'}</td>
                  <td><span className={`rd-badge ${bCls}`}><span className="bd-dot"/>{badge.replace(/^[^ ]+ /,'')}</span></td>
                  <td>
                    {e.penalite
                      ? <span className="rd-penalty">{e.penalite} FCFA</span>
                      : <span style={{color:'var(--rd-text-3)'}}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
 
  /* ── Onglet consultations ── */
  function TabConsultations() {
    if (loading) return (
      <div className="rd-spinner-wrap">
        <div className="rd-spinner"/>
        <p style={{color:'var(--rd-text-3)', fontSize:'.82rem', margin:0}}>Chargement...</p>
      </div>
    );
    if (consultations.length === 0) return (
      <div className="rd-tab-empty">
        <div className="rd-tab-empty-icon">📖</div>
        <p>Aucune consultation enregistrée pour ce lecteur.</p>
      </div>
    );
 
    return (
      <div className="rd-hist-card">
        <table className="rd-hist-table">
          <thead>
            <tr>
              <th>Ouvrage</th>
              <th>Code</th>
              <th>Date consultation</th>
              <th>Durée (min)</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {consultations.map((c, i) => (
              <tr key={c.id ?? i}>
                <td><strong>{c.titre || c.book?.titre || '—'}</strong></td>
                <td style={{fontFamily:"'Courier New',monospace", fontSize:'.72rem', color:'var(--rd-primary)'}}>
                  {c.code || c.book?.code || '—'}
                </td>
                <td>{fmtFull(c.date_consultation || c.created_at)}</td>
                <td style={{fontWeight:600}}>{c.duree_minutes ?? '—'}</td>
                <td style={{color:'var(--rd-text-3)', fontSize:'.78rem'}}>
                  {c.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
 
  /* ── Onglet retards ── */
  function TabRetards() {
    const retardsListe = emprunts.filter(e => {
      if (e.date_retour_effective) return false;
      if (!e.date_retour_prevue)   return false;
      return new Date(e.date_retour_prevue) < new Date();
    });
 
    if (loading) return (
      <div className="rd-spinner-wrap">
        <div className="rd-spinner"/>
        <p style={{color:'var(--rd-text-3)', fontSize:'.82rem', margin:0}}>Chargement...</p>
      </div>
    );
    if (retardsListe.length === 0) return (
      <div className="rd-tab-empty">
        <div className="rd-tab-empty-icon">✅</div>
        <p>Aucun retard en cours pour ce lecteur.</p>
      </div>
    );
 
    return (
      <div className="rd-hist-card">
        <table className="rd-hist-table">
          <thead>
            <tr>
              <th>Ouvrage</th>
              <th>Code</th>
              <th>Date emprunt</th>
              <th>Retour prévu</th>
              <th>Jours de retard</th>
              <th>Pénalité</th>
            </tr>
          </thead>
          <tbody>
            {retardsListe.map((e, i) => {
              const joursRetard = daysBetween(e.date_retour_prevue, new Date());
              return (
                <tr key={e.id ?? i} style={{background:'#fff8f8'}}>
                  <td><strong>{e.titre || e.book?.titre || '—'}</strong></td>
                  <td style={{fontFamily:"'Courier New',monospace", fontSize:'.72rem', color:'var(--rd-danger)'}}>
                    {e.code || e.book?.code || '—'}
                  </td>
                  <td>{fmt(e.date_emprunt)}</td>
                  <td style={{color:'var(--rd-danger)', fontWeight:600}}>
                    {fmt(e.date_retour_prevue)}
                  </td>
                  <td>
                    <span className="rd-badge bd-danger">
                      <span className="bd-dot"/>
                      {joursRetard}j de retard
                    </span>
                  </td>
                  <td>
                    {e.penalite
                      ? <span className="rd-penalty">{e.penalite} FCFA</span>
                      : <span style={{color:'var(--rd-text-3)'}}>—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
 
  /* ════ RENDER ════ */
  return (
    <Modal title="👤 Fiche lecteur" onClose={onClose}>
      <div className="rd">
 
        {/* ── HERO PROFIL ── */}
        <div className="rd-hero">
          <div className="rd-avatar-lg">{initials(reader)}</div>
          <div className="rd-hero-info">
            <p className="rd-hero-name">{reader.prenom} {reader.nom}</p>
            <p className="rd-hero-mat">{reader.matricule || 'Matricule non renseigné'}</p>
            <div className="rd-hero-chips">
              {reader.type    && <span className="rd-hero-chip">{reader.type}</span>}
              {reader.filiere && <span className="rd-hero-chip">{reader.filiere}</span>}
              {reader.niveau  && <span className="rd-hero-chip">{reader.niveau}</span>}
              {reader.faculte && <span className="rd-hero-chip">{reader.faculte}</span>}
            </div>
          </div>
          <span className={`rd-hero-status ${st.cls}`}>
            <span className="hst-dot"/>
            {st.label}
          </span>
        </div>
 
        {/* ── STATS RAPIDES ── */}
        <div className="rd-quick-stats">
          <div className="rd-qs">
            <div className="rd-qs-n">{totalEmprunts}</div>
            <div className="rd-qs-l">Emprunts total</div>
          </div>
          <div className="rd-qs ok">
            <div className="rd-qs-n">{enCours}</div>
            <div className="rd-qs-l">En cours</div>
          </div>
          <div className="rd-qs warn">
            <div className="rd-qs-n">{retards}</div>
            <div className="rd-qs-l">En retard</div>
          </div>
          <div className="rd-qs">
            <div className="rd-qs-n">{totalConsultations}</div>
            <div className="rd-qs-l">Consultations</div>
          </div>
        </div>
 
        {/* ── INFOS PERSONNELLES ── */}
        <div className="rd-info-card">
          <h2 className="rd-section-title">📋 Informations personnelles</h2>
          <div className="rd-info-grid">
            <InfoRow label="Nom complet"      value={`${reader.prenom} ${reader.nom}`}/>
            <InfoRow label="Matricule"        value={reader.matricule}/>
            <InfoRow label="Type"             value={reader.type}/>
            <InfoRow label="Email"            value={reader.email}/>
            <InfoRow label="Téléphone"        value={reader.telephone}/>
            <InfoRow label="Filière"          value={reader.filiere}/>
            <InfoRow label="Niveau"           value={reader.niveau}/>
            <InfoRow label="Faculté"          value={reader.faculte}/>
            <InfoRow label="Date inscription" value={fmt(reader.date_inscription)}/>
            <InfoRow label="Créé le"          value={fmtFull(reader.createdAt)}/>
          </div>
        </div>
 
        {/* ── ONGLETS HISTORIQUE ── */}
        <div className="rd-tabs">
          {[
            { key:'emprunts',      label:`📚 Emprunts (${totalEmprunts})` },
            { key:'consultations', label:`📖 Consultations (${totalConsultations})` },
            { key:'retards',       label:`⚠️ Retards (${retards})` },
          ].map(tab => (
            <button
              key={tab.key}
              className={`rd-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
 
        {/* ── CONTENU ONGLET ── */}
        {activeTab === 'emprunts'      && <TabEmprunts/>}
        {activeTab === 'consultations' && <TabConsultations/>}
        {activeTab === 'retards'       && <TabRetards/>}
 
        {/* ── FOOTER ── */}
        <div className="rd-footer">
          <button className="rd-btn-close" onClick={onClose}>✕ Fermer</button>
        </div>
 
      </div>
    </Modal>
  );
}