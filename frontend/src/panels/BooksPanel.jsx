import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import api from "../api/axios";
import Modal from "../shared/Modal";
import SearchBar from "../shared/SearchBar";
import BookDetailsPanel from "./BookDetailsPanel";
import { getBookCoverCandidates } from "../components/BookCover";
 
/* ═══════════════════════════════════════════════════════════
   STYLES  —  injectés une seule fois dans <head>
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
:root {
  --bg:          #F5F7FB;
  --surface:     #ffffff;
  --border:      #e8edf5;
  --primary:     #2563eb;
  --primary-dk:  #1d4ed8;
  --primary-lt:  #eff6ff;
  --success:     #16a34a;
  --warning:     #d97706;
  --danger:      #dc2626;
  --text:        #0f172a;
  --text-2:      #475569;
  --text-3:      #94a3b8;
  --radius:      16px;
  --radius-sm:   10px;
  --shadow:      0 2px 12px rgba(15,23,42,.07), 0 1px 3px rgba(15,23,42,.05);
  --shadow-lg:   0 20px 60px rgba(15,23,42,.16), 0 4px 16px rgba(15,23,42,.07);
  --transition:  .22s cubic-bezier(.4,0,.2,1);
}
 
.bp { font-family:'Inter',sans-serif; color:var(--text); }
 
/* ── HEADER ── */
.bp-head {
  display:flex; align-items:flex-start; justify-content:space-between;
  flex-wrap:wrap; gap:16px; margin-bottom:28px;
}
.bp-head-left h2 {
  font-family:'Playfair Display',serif;
  font-size:2rem; font-weight:700; margin:0 0 6px;
  display:flex; align-items:center; gap:12px;
}
.bp-head-left h2 .title-icon {
  display:inline-flex; align-items:center; justify-content:center;
  width:42px; height:42px; border-radius:12px;
  background:linear-gradient(135deg,#2563eb,#0ea5e9); font-size:1.2rem;
}
.bp-head-left p { color:var(--text-2); font-size:.875rem; margin:0; }
.bp-head-right  { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
 
/* ── STATS ── */
.bp-stats { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
.bp-pill {
  display:flex; align-items:center; gap:8px;
  padding:7px 16px; border-radius:40px;
  border:1px solid var(--border); background:var(--surface);
  font-size:.78rem; font-weight:500; color:var(--text-2);
  box-shadow:var(--shadow);
}
.bp-pill .dot { width:8px; height:8px; border-radius:50%; }
.dot-blue  { background:#2563eb; }
.dot-green { background:#16a34a; }
.dot-red   { background:#dc2626; }
 
/* ── FILTRES ── */
.bp-toolbar {
  display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:28px;
}
.bp-filter-lbl { font-size:.78rem; font-weight:600; color:var(--text-2); margin-right:4px; }
.bp-filter-btn {
  display:inline-flex; align-items:center; gap:6px;
  padding:7px 16px; border-radius:40px; border:1.5px solid var(--border);
  background:var(--surface); color:var(--text-2);
  font-family:'Inter',sans-serif; font-size:.8rem; font-weight:500;
  cursor:pointer; transition:var(--transition); white-space:nowrap;
}
.bp-filter-btn:hover  { background:#f1f5f9; }
.bp-filter-btn.active {
  background:var(--primary); color:#fff; border-color:var(--primary);
  box-shadow:0 2px 8px rgba(37,99,235,.3);
}
 
/* ── BOUTON NOUVEL OUVRAGE ── */
.bp-btn-new {
  display:inline-flex; align-items:center; gap:8px;
  padding:11px 22px; border-radius:12px; border:none;
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:#fff; font-family:'Inter',sans-serif;
  font-size:.875rem; font-weight:600; cursor:pointer;
  box-shadow:0 4px 14px rgba(37,99,235,.4);
  transition:var(--transition); white-space:nowrap;
}
.bp-btn-new:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(37,99,235,.5); }
.bp-btn-new:active { transform:none; }
 
/* ══════════════════════════════
   GRILLE CARTES LIVRES
══════════════════════════════ */
.bp-grid {
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
  gap:24px;
}
 
.book-card {
  background:var(--surface);
  border-radius:var(--radius);
  border:1px solid var(--border);
  box-shadow:var(--shadow);
  overflow:hidden; cursor:pointer;
  display:flex; flex-direction:column;
  transition:transform var(--transition), box-shadow var(--transition);
  animation:fadeUp .4s ease both;
}
.book-card:hover {
  transform:translateY(-8px);
  box-shadow:var(--shadow-lg);
}
 
@keyframes fadeUp {
  from { opacity:0; transform:translateY(22px); }
  to   { opacity:1; transform:translateY(0); }
}
.book-card:nth-child(1){animation-delay:.04s}
.book-card:nth-child(2){animation-delay:.08s}
.book-card:nth-child(3){animation-delay:.12s}
.book-card:nth-child(4){animation-delay:.16s}
.book-card:nth-child(5){animation-delay:.20s}
.book-card:nth-child(6){animation-delay:.24s}
.book-card:nth-child(n+7){animation-delay:.28s}
 
/* ══════════════════════════════
   COUVERTURE — image réelle ou placeholder
══════════════════════════════ */
.book-cover-wrap {
  position:relative; overflow:hidden;
  height:220px; flex-shrink:0;
  background:#e8edf5;
}
 
/* ── Image réelle ── */
.book-real-img {
  width:100%; height:100%; object-fit:cover;
  transition:transform .4s ease;
  display:block;
}
.book-card:hover .book-real-img {
  transform:scale(1.07);
}
 
/* Overlay dégradé sur l'image réelle */
.book-img-overlay {
  position:absolute; inset:0;
  background:linear-gradient(
    to bottom,
    transparent 40%,
    rgba(15,23,42,.55) 100%
  );
  transition:opacity var(--transition);
}
.book-card:hover .book-img-overlay { opacity:.8; }
 
/* ── Placeholder coloré (si pas d'image) ── */
.book-placeholder {
  width:100%; height:100%;
  display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:8px;
}
.book-card:nth-child(6n+1) .book-placeholder{background:linear-gradient(145deg,#dbeafe,#bfdbfe);}
.book-card:nth-child(6n+2) .book-placeholder{background:linear-gradient(145deg,#dcfce7,#bbf7d0);}
.book-card:nth-child(6n+3) .book-placeholder{background:linear-gradient(145deg,#fef3c7,#fde68a);}
.book-card:nth-child(6n+4) .book-placeholder{background:linear-gradient(145deg,#fce7f3,#fbcfe8);}
.book-card:nth-child(6n+5) .book-placeholder{background:linear-gradient(145deg,#ede9fe,#ddd6fe);}
.book-card:nth-child(6n+0) .book-placeholder{background:linear-gradient(145deg,#ffedd5,#fed7aa);}
 
/* Spine (visible uniquement sur placeholder) */
.book-spine {
  position:absolute; left:0; top:0; bottom:0; width:7px;
  border-radius:0 3px 3px 0; z-index:2;
}
.book-placeholder-active .book-spine { display:block; }
.book-real-active .book-spine { display:none; }
 
.book-card:nth-child(6n+1) .book-spine{background:linear-gradient(180deg,#2563eb,#1e40af);}
.book-card:nth-child(6n+2) .book-spine{background:linear-gradient(180deg,#16a34a,#14532d);}
.book-card:nth-child(6n+3) .book-spine{background:linear-gradient(180deg,#d97706,#92400e);}
.book-card:nth-child(6n+4) .book-spine{background:linear-gradient(180deg,#db2777,#9d174d);}
.book-card:nth-child(6n+5) .book-spine{background:linear-gradient(180deg,#7c3aed,#4c1d95);}
.book-card:nth-child(6n+0) .book-spine{background:linear-gradient(180deg,#ea580c,#7c2d12);}
 
.book-ph-icon {
  font-size:3.4rem; opacity:.45;
  transition:transform .3s ease;
}
.book-card:hover .book-ph-icon { transform:scale(1.15); }
.book-ph-title {
  font-size:.7rem; font-weight:700; color:var(--text-2);
  text-align:center; text-transform:uppercase; letter-spacing:.07em;
  padding:0 18px; line-height:1.3;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.book-ph-author {
  font-size:.65rem; color:var(--text-3); text-align:center;
  overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:180px;
}
 
/* ── Badge disponibilité (sur la couverture) ── */
.book-badge {
  position:absolute; top:10px; right:10px; z-index:3;
  display:inline-flex; align-items:center; gap:5px;
  padding:4px 10px; border-radius:20px; font-size:.7rem; font-weight:700;
  backdrop-filter:blur(8px); border:1px solid transparent;
}
.book-badge.ok   {background:rgba(240,253,244,.92);color:#166534;border-color:#a7f3d0;}
.book-badge.warn {background:rgba(255,251,235,.92);color:#92400e;border-color:#fde68a;}
.book-badge.none {background:rgba(254,242,242,.92);color:#991b1b;border-color:#fecaca;}
.book-badge .bdot{width:6px;height:6px;border-radius:50%;}
.book-badge.ok   .bdot{background:#16a34a;}
.book-badge.warn .bdot{background:#d97706;}
.book-badge.none .bdot{background:#dc2626;}
 
/* ── Code badge (bas gauche de la couverture) ── */
.book-code-badge {
  position:absolute; bottom:10px; left:12px; z-index:3;
  background:rgba(15,23,42,.72); color:#fff;
  font-size:.66rem; font-weight:700; font-family:'Courier New',monospace;
  padding:3px 9px; border-radius:6px; backdrop-filter:blur(4px); letter-spacing:.04em;
}
 
/* ── CORPS CARTE ── */
.book-body {
  padding:14px 16px 10px; flex:1;
  display:flex; flex-direction:column; gap:7px;
}
 
.book-genre {
  display:inline-flex; align-items:center; gap:4px;
  background:var(--primary-lt); color:var(--primary);
  border:1px solid #bfdbfe; border-radius:20px;
  font-size:.68rem; font-weight:700; text-transform:uppercase; letter-spacing:.05em;
  padding:2px 10px; align-self:flex-start;
}
 
.book-title {
  font-family:'Playfair Display',serif;
  font-size:.97rem; font-weight:600; color:var(--text); line-height:1.35; margin:0;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
 
.book-author {
  display:flex; align-items:center; gap:5px;
  font-size:.78rem; color:var(--text-2); font-weight:500; margin:0;
}
 
.book-meta { display:flex; gap:10px; flex-wrap:wrap; }
.book-meta-item {
  display:flex; align-items:center; gap:4px;
  font-size:.72rem; color:var(--text-3);
}
 
.book-dispo-bar {
  display:flex; align-items:center; justify-content:space-between;
  padding:8px 10px; border-radius:8px; background:#f8fafc;
  border:1px solid var(--border); margin-top:2px;
}
.book-dispo-label { font-size:.72rem; color:var(--text-2); font-weight:500; }
.book-dispo-count { font-size:.82rem; font-weight:700; color:var(--text); }
 
/* ── BOUTONS ── */
.book-actions {
  display:flex; gap:6px;
  padding:12px 14px; border-top:1px solid var(--border); background:#fafbfc;
}
.book-btn {
  flex:1; display:inline-flex; align-items:center; justify-content:center; gap:5px;
  padding:8px 4px; border-radius:8px; border:none;
  font-family:'Inter',sans-serif; font-size:.75rem; font-weight:600;
  cursor:pointer; transition:var(--transition);
}
.book-btn:hover { transform:translateY(-1px); }
.bk-primary { background:var(--primary);color:#fff;box-shadow:0 2px 8px rgba(37,99,235,.3); }
.bk-primary:hover { background:var(--primary-dk); }
.bk-edit    { background:#fffbeb;color:#b45309;border:1px solid #fde68a; }
.bk-edit:hover { background:#fef3c7; }
.bk-delete  { background:#fef2f2;color:#dc2626;border:1px solid #fecaca; }
.bk-delete:hover { background:#fee2e2; }
 
/* ── EMPTY / LOADING ── */
.bp-empty, .bp-loading {
  text-align:center; padding:80px 20px; color:var(--text-2);
}
.bp-empty-icon { font-size:4rem; opacity:.45; margin-bottom:16px; }
.bp-empty h3 { font-family:'Playfair Display',serif; font-size:1.2rem; margin:0 0 8px; }
.bp-empty p  { font-size:.85rem; color:var(--text-3); margin:0; }
.bp-spinner {
  width:44px; height:44px; margin:0 auto 14px;
  border:3px solid var(--border); border-top-color:var(--primary);
  border-radius:50%; animation:spin .7s linear infinite;
}
@keyframes spin { to { transform:rotate(360deg); } }
 
/* ══════════════════════
   FORMULAIRE MODAL
══════════════════════ */
.bp-form { display:grid; grid-template-columns:1fr 1fr; gap:14px; padding:4px 0; }
.bp-form .s2 { grid-column:1/-1; }
.bp-field label {
  display:block; margin-bottom:5px;
  font-size:.72rem; font-weight:700; text-transform:uppercase;
  letter-spacing:.07em; color:var(--text-2);
}
.bp-field input,
.bp-field select,
.bp-field textarea {
  width:100%; padding:10px 13px; box-sizing:border-box;
  border:1.5px solid var(--border); border-radius:var(--radius-sm);
  font-family:'Inter',sans-serif; font-size:.875rem; color:var(--text);
  background:#fafbfd; outline:none;
  transition:border-color var(--transition), box-shadow var(--transition);
}
.bp-field input:focus,
.bp-field select:focus,
.bp-field textarea:focus {
  border-color:var(--primary);
  box-shadow:0 0 0 3px rgba(37,99,235,.1); background:#fff;
}
.bp-field textarea { resize:vertical; min-height:76px; }
 
.bp-form-actions { display:flex; gap:10px; margin-top:6px; grid-column:1/-1; }
.bp-save {
  flex:1; display:inline-flex; align-items:center; justify-content:center; gap:8px;
  padding:12px; border:none; border-radius:var(--radius-sm);
  background:linear-gradient(135deg,#16a34a,#15803d); color:#fff;
  font-family:'Inter',sans-serif; font-size:.9rem; font-weight:700; cursor:pointer;
  box-shadow:0 4px 12px rgba(22,163,74,.35); transition:var(--transition);
}
.bp-save:hover { transform:translateY(-2px); filter:brightness(1.05); }
.bp-cancel {
  flex:1; display:inline-flex; align-items:center; justify-content:center; gap:8px;
  padding:12px; border:1.5px solid var(--border); border-radius:var(--radius-sm);
  background:#f8fafc; color:var(--text-2);
  font-family:'Inter',sans-serif; font-size:.9rem; font-weight:600; cursor:pointer;
  transition:var(--transition);
}
.bp-cancel:hover { background:#f1f5f9; color:var(--text); }
 
@media(max-width:640px){
  .bp-grid { grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; }
  .bp-form { grid-template-columns:1fr; }
  .bp-form .s2 { grid-column:1; }
  .book-cover-wrap { height:180px; }
  .bp-head { flex-direction:column; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Disponibilité ── */
function dispo(b) {
  const a = b.exemplaires_disponibles ?? 0;
  const t = b.total_exemplaires ?? 0;
  if (a === 0) return { cls: "none", label: "Indisponible" };
  if (a < t)   return { cls: "warn", label: `${a}/${t} dispo` };
  return             { cls: "ok",   label: `${a}/${t} dispo` };
}
 
/* ── Champ formulaire ── */
function F({ label, s2, children }) {
  return (
    <div className={`bp-field${s2 ? " s2" : ""}`}>
      <label>{label}</label>
      {children}
    </div>
  );
}
 
/* ══════════════════════════════════════════════
   Couverture — image réelle OU placeholder coloré
══════════════════════════════════════════════ */
function BookCover({ book, index }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const imageUrls = getBookCoverCandidates(book);
  const imageUrl = imageUrls[currentIndex] || null;
  const hasImage = Boolean(imageUrl);

  return (
    <div className="book-cover-wrap">
      {/* Spine (seulement sur placeholder) */}
      {!hasImage && <div className="book-spine" />}

      {hasImage ? (
        /* ── IMAGE RÉELLE ── */
        <>
          <img
            className="book-real-img"
            src={imageUrl}
            alt={`Couverture de ${book.titre}`}
            onError={() => {
              if (currentIndex + 1 < imageUrls.length) {
                setCurrentIndex(currentIndex + 1);
              }
            }}
          />
          <div className="book-img-overlay" />
        </>
      ) : (
        /* ── PLACEHOLDER COLORÉ ── */
        <div className="book-placeholder">
          <span className="book-ph-icon">📖</span>
          <span className="book-ph-title">{book.titre}</span>
          {book.auteur && (
            <span className="book-ph-author">{book.auteur}</span>
          )}
        </div>
      )}
 
      {/* Badge dispo — toujours visible */}
      <span className={`book-badge ${dispo(book).cls}`}>
        <span className="bdot" />
        {dispo(book).label}
      </span>
 
      {/* Code — toujours visible */}
      <span className="book-code-badge">{book.code}</span>
    </div>
  );
}
 
/* ═══════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════ */
export default function BooksPanel({ onChange }) {
  const { t } = useTranslation();
  const [books,        setBooks]        = useState([]);
  const [localQuery,   setLocalQuery]   = useState('');
  const [loading,      setLoading]      = useState(false);
  const [modal,        setModal]        = useState(false);
  const [editing,      setEditing]      = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [filterEtat,   setFilterEtat]   = useState('all');
 
  const [form, setForm] = useState({
    code:"", titre:"", auteur:"", editeur:"",
    annee_publication:"", edition:"", langue:"",
    nombre_pages:"", resume:"", theme:"", mots_cles:"",
    genre:"", type_ouvrage:"livre", etat:"disponible",
    date_acquisition:"", total_exemplaires:"1",
    exemplaires_disponibles:"1", description:"", emplacement:""
  });
 
  injectCSS("bp-css-v3", CSS);
 
  /* ════ API — 100 % identiques à l'original ════ */
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/books", { params: { q: localQuery } });
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
      alert(t('Erreur chargement des ouvrages — regarde la console'));
    } finally { setLoading(false); }
  }, [localQuery, t]);
 
  useEffect(() => { fetchBooks(); }, [fetchBooks]);
 
  function openNew() {
    setEditing(null);
    setForm({
      code:"", titre:"", auteur:"", editeur:"",
      annee_publication:"", edition:"", langue:"", nombre_pages:"",
      resume:"", theme:"", mots_cles:"", genre:"",
      type_ouvrage:"livre", etat:"disponible", date_acquisition:"",
      emplacement:"", total_exemplaires:"1", exemplaires_disponibles:"1", description:""
    });
    setModal(true);
  }
 
  function openEdit(b) {
    setEditing(b);
    setForm({
      code:b.code||"", titre:b.titre||"", auteur:b.auteur||"",
      editeur:b.editeur||"", annee_publication:b.annee_publication||"",
      edition:b.edition||"", langue:b.langue||"",
      nombre_pages:b.nombre_pages||"", resume:b.resume||"",
      theme:b.theme||"", mots_cles:b.mots_cles||"", genre:b.genre||"",
      type_ouvrage:b.type_ouvrage||"livre", etat:b.etat||"disponible",
      date_acquisition:b.date_acquisition||"", emplacement:b.emplacement||"",
      description:b.description||"",
      total_exemplaires:String(b.total_exemplaires??1),
      exemplaires_disponibles:String(b.exemplaires_disponibles??b.total_exemplaires??1)
    });
    setModal(true);
  }
 
  async function submit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        annee_publication: form.annee_publication ? Number(form.annee_publication) : null,
        nombre_pages:      form.nombre_pages      ? Number(form.nombre_pages)      : null,
        total_exemplaires: Number(form.total_exemplaires) || 1,
        exemplaires_disponibles:
          Number(form.exemplaires_disponibles) ||
          Number(form.total_exemplaires) || 1
      };
      if (editing) await api.put(`/books/${editing.id}`, payload);
      else         await api.post("/books", payload);
      setModal(false); fetchBooks(); onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t('Erreur sauvegarde :') + ' ' + (err?.response?.data?.error || err.message));
    }
  }
 
  async function remove(id) {
    if (!window.confirm(t('Supprimer cet ouvrage ?'))) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks(); onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t('Erreur suppression — regarde la console'));
    }
  }
 
  /* ── Filtrage local ── */
  const visible = books.filter(b => {
    if (filterEtat === 'dispo')   return (b.exemplaires_disponibles ?? 0) > 0;
    if (filterEtat === 'indispo') return (b.exemplaires_disponibles ?? 0) === 0;
    return true;
  });
 
  const totalDispos   = books.filter(b => (b.exemplaires_disponibles ?? 0) > 0).length;
  const totalIndispos = books.filter(b => (b.exemplaires_disponibles ?? 0) === 0).length;
 
  /* ════ RENDER ════ */
  return (
    <div className="bp">
 
      {/* ── HEADER ── */}
      <div className="bp-head">
        <div className="bp-head-left">
          <h2>
            <span className="title-icon">📚</span>
            {t('Catalogue des ouvrages')}
          </h2>
          <p>{t('Cliquez sur une carte pour consulter les détails complets')}</p>
        </div>
        <div className="bp-head-right">
          <SearchBar
            value={localQuery}
            onChange={setLocalQuery}
            placeholder={t("Titre, auteur, code...")}
          />
          <button className="bp-btn-new" onClick={openNew}>
            <span style={{fontSize:'1.1rem'}}>＋</span>
            {t('Nouvel ouvrage')}
          </button>
        </div>
      </div>
 
      {/* ── STATS ── */}
      <div className="bp-stats">
        <div className="bp-pill">
          <span className="dot dot-blue"/>
          {books.length} {t('ouvrages au total')}
        </div>
        <div className="bp-pill">
          <span className="dot dot-green"/>
          {totalDispos} {t('disponibles')}
        </div>
        <div className="bp-pill">
          <span className="dot dot-red"/>
          {totalIndispos} {t('indisponibles')}
        </div>
      </div>
 
      {/* ── FILTRES ── */}
      <div className="bp-toolbar">
        <span className="bp-filter-lbl">Filtrer :</span>
        {[
          { key:'all',     label:'📋 Tous' },
          { key:'dispo',   label:'🟢 Disponibles' },
          { key:'indispo', label:'🔴 Indisponibles' },
        ].map(f => (
          <button
            key={f.key}
            className={`bp-filter-btn${filterEtat === f.key ? ' active' : ''}`}
            onClick={() => setFilterEtat(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
 
      {/* ── CONTENU ── */}
      {loading ? (
        <div className="bp-loading">
          <div className="bp-spinner"/>
          <p style={{margin:0, fontSize:'.88rem'}}>{t('Chargement des ouvrages...')}</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="bp-empty">
          <div className="bp-empty-icon">📭</div>
          <h3>{t('Aucun ouvrage trouvé')}</h3>
          <p>{t('Modifiez votre recherche ou ajoutez un nouvel ouvrage.')}</p>
        </div>
      ) : (
        <div className="bp-grid">
          {visible.map((b, index) => {
            return (
              <div
                key={b.id}
                className="book-card"
                onClick={() => setSelectedBook(b)}
              >
                {/* ── COUVERTURE (image réelle ou placeholder) ── */}
                <BookCover book={b} index={index} />
 
                {/* ── CORPS ── */}
                <div className="book-body">
                  {(b.genre || b.theme) && (
                    <span className="book-genre">🏷 {b.genre || b.theme}</span>
                  )}
 
                  <p className="book-title">{b.titre}</p>
 
                  <p className="book-author">
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                    </svg>
                    {b.auteur || <em style={{color:'var(--text-3)'}}>Auteur inconnu</em>}
                  </p>
 
                  <div className="book-meta">
                    {b.annee_publication && (
                      <span className="book-meta-item">📅 {b.annee_publication}</span>
                    )}
                    {b.emplacement && (
                      <span className="book-meta-item">📍 {b.emplacement}</span>
                    )}
                    {b.langue && (
                      <span className="book-meta-item">🌐 {b.langue}</span>
                    )}
                  </div>
 
                  <div className="book-dispo-bar">
                    <span className="book-dispo-label">📦 {t('Exemplaires')}</span>
                    <span className="book-dispo-count">
                      {b.exemplaires_disponibles}/{b.total_exemplaires}
                    </span>
                  </div>
                </div>
 
                {/* ── BOUTONS ── */}
                <div className="book-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className="book-btn bk-primary"
                    title={t('Voir les détails')}
                    onClick={() => setSelectedBook(b)}
                  >
                    👁 {t('Détails')}
                  </button>
                  <button
                    className="book-btn bk-edit"
                    title={t('Modifier')}
                    onClick={() => openEdit(b)}
                  >
                    ✏️
                  </button>
                  <button
                    className="book-btn bk-delete"
                    title={t('Supprimer')}
                    onClick={() => remove(b.id)}
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
 
      {/* ══ MODAL FORMULAIRE ══ */}
      {modal && (
        <Modal title={editing ? t("Modifier l'ouvrage") : t("Ajouter un nouvel ouvrage")}>
          <form onSubmit={submit}>
            <div className="bp-form">
 
              <F label={t("Code de l'ouvrage *")} s2>
                <input placeholder="Ex: BK-001" value={form.code} required
                  onChange={e => setForm({...form, code:e.target.value})}/>
              </F>
 
              <F label={t("Titre de l'ouvrage *")} s2>
                <input placeholder={t("Titre de l'ouvrage")} value={form.titre} required
                  onChange={e => setForm({...form, titre:e.target.value})}/>
              </F>
 
              <F label={t("Auteur")}>
                <input placeholder={t("Auteur")} value={form.auteur}
                  onChange={e => setForm({...form, auteur:e.target.value})}/>
              </F>
 
              <F label={t("Éditeur")}>
                <input placeholder={t("Éditeur")} value={form.editeur}
                  onChange={e => setForm({...form, editeur:e.target.value})}/>
              </F>
 
              <F label={t("Année de publication")}>
                <input type="number" placeholder="Ex: 2023" value={form.annee_publication}
                  onChange={e => setForm({...form, annee_publication:e.target.value})}/>
              </F>
 
              <F label={t("Édition")}>
                <input placeholder="Ex: 1ère édition" value={form.edition}
                  onChange={e => setForm({...form, edition:e.target.value})}/>
              </F>
 
              <F label={t("Langue")}>
                <input placeholder="Ex: Français" value={form.langue}
                  onChange={e => setForm({...form, langue:e.target.value})}/>
              </F>
 
              <F label={t("Nombre de pages")}>
                <input type="number" placeholder="Ex: 300" value={form.nombre_pages}
                  onChange={e => setForm({...form, nombre_pages:e.target.value})}/>
              </F>
 
              <F label={t("Genre d'ouvrage")}>
                <input list="genre-opts" placeholder={t("Sélectionner ou saisir")} value={form.genre}
                  onChange={e => setForm({...form, genre:e.target.value})}/>
                <datalist id="genre-opts">
                  {["Roman","Essai","Histoire","Science","BD","Poésie","Théâtre","Manuel","Autre"]
                    .map(v => <option key={v} value={v}/>)}
                </datalist>
              </F>
 
              <F label="Type d'ouvrage">
                <input list="type-opts" placeholder="Sélectionner ou saisir" value={form.type_ouvrage}
                  onChange={e => setForm({...form, type_ouvrage:e.target.value})}/>
                <datalist id="type-opts">
                  {["Livre","Revue","Ouvrage de référence","Document académique","Mémoire"]
                    .map(v => <option key={v} value={v}/>)}
                </datalist>
              </F>
 
              <F label="État">
                <select value={form.etat}
                  onChange={e => setForm({...form, etat:e.target.value})}>
                  <option value="disponible">Disponible</option>
                  <option value="reparation">En réparation</option>
                </select>
              </F>
 
              <F label="Date d'acquisition">
                <input type="date" value={form.date_acquisition}
                  onChange={e => setForm({...form, date_acquisition:e.target.value})}/>
              </F>
 
              <F label="Mots-clés" s2>
                <input placeholder="Séparés par des virgules" value={form.mots_cles}
                  onChange={e => setForm({...form, mots_cles:e.target.value})}/>
              </F>
 
              <F label="Résumé" s2>
                <textarea rows={3} placeholder="Résumé de l'ouvrage..." value={form.resume}
                  onChange={e => setForm({...form, resume:e.target.value})}/>
              </F>
 
              <F label="Description" s2>
                <textarea rows={3} placeholder="Description détaillée..." value={form.description}
                  onChange={e => setForm({...form, description:e.target.value})}/>
              </F>
 
              <F label="Emplacement" s2>
                <input placeholder="Ex: Rayon A1, Étagère 3" value={form.emplacement}
                  onChange={e => setForm({...form, emplacement:e.target.value})}/>
              </F>
 
              <div className="bp-form-actions">
                <button type="submit" className="bp-save">
                  💾 {t('Sauvegarder')}
                </button>
                <button type="button" className="bp-cancel"
                  onClick={() => setModal(false)}>
                  ✕ {t('Annuler')}
                </button>
              </div>
            </div>
          </form>
        </Modal>
      )}
 
      {/* ══ DÉTAILS ══ */}
      {selectedBook && (
        <BookDetailsPanel
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}