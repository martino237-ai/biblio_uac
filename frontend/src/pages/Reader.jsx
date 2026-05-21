import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import BookDetailsPanel from '../panels/BookDetailsPanel';
 
/* ═══════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
:root {
  --bk-primary:    #2563eb;
  --bk-primary-dk: #1d4ed8;
  --bk-primary-lt: #eff6ff;
  --bk-success:    #16a34a;
  --bk-success-lt: #f0fdf4;
  --bk-danger:     #dc2626;
  --bk-danger-lt:  #fef2f2;
  --bk-purple:     #7c3aed;
  --bk-purple-lt:  #ede9fe;
  --bk-text:       #0f172a;
  --bk-text-2:     #475569;
  --bk-text-3:     #94a3b8;
  --bk-border:     #e2e8f0;
  --bk-surface:    #ffffff;
  --bk-bg:         #f1f5f9;
  --bk-radius:     14px;
  --bk-radius-sm:  9px;
  --bk-transition: .2s cubic-bezier(.4,0,.2,1);
}
 
/* ── LAYOUT ── */
.bk-layout {
  display: flex;
  min-height: 100vh;
  background: var(--bk-bg);
  font-family: 'Inter', sans-serif;
  color: var(--bk-text);
}
 
/* ══════════════════════════════
   SIDEBAR
══════════════════════════════ */
.bk-sidebar {
  width: 220px;
  min-height: 100vh;
  background: var(--bk-surface);
  border-right: 1px solid var(--bk-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}
 
.bk-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px;
  border-bottom: 1px solid var(--bk-border);
}
.bk-brand-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--bk-primary-lt);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.bk-brand-name {
  font-family: 'Playfair Display', serif;
  font-size: .95rem; font-weight: 600; color: var(--bk-text);
  line-height: 1.2;
}
.bk-brand-sub { font-size: .7rem; color: var(--bk-text-3); }
 
.bk-nav-section {
  padding: 16px 12px 6px;
  font-size: .65rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .1em;
  color: var(--bk-text-3);
}
.bk-nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 12px; margin: 1px 8px;
  border-radius: var(--bk-radius-sm);
  font-size: .83rem; font-weight: 500; color: var(--bk-text-2);
  cursor: pointer; background: none; border: none;
  width: calc(100% - 16px); text-align: left;
  font-family: 'Inter', sans-serif;
  transition: var(--bk-transition);
}
.bk-nav-item:hover { background: var(--bk-bg); color: var(--bk-text); }
.bk-nav-item.active {
  background: var(--bk-primary-lt); color: var(--bk-primary);
}
.bk-nav-icon { font-size: 1.05rem; flex-shrink: 0; }
.bk-nav-badge {
  margin-left: auto;
  background: var(--bk-primary-lt); color: var(--bk-primary);
  font-size: .65rem; font-weight: 700;
  padding: 1px 7px; border-radius: 20px;
}
.bk-nav-item.active .bk-nav-badge { background: #bfdbfe; }
 
.bk-sidebar-bottom {
  margin-top: auto;
  border-top: 1px solid var(--bk-border);
  padding: 12px;
}
.bk-user-row {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 6px; border-radius: var(--bk-radius-sm);
  cursor: pointer; transition: var(--bk-transition);
}
.bk-user-row:hover { background: var(--bk-bg); }
.bk-avatar-sm {
  width: 32px; height: 32px; border-radius: 50%;
  background: #dbeafe; display: flex; align-items: center;
  justify-content: center; font-size: .75rem; font-weight: 700;
  color: #1e40af; flex-shrink: 0;
}
.bk-user-name { font-size: .8rem; font-weight: 600; color: var(--bk-text); }
.bk-user-role { font-size: .7rem; color: var(--bk-text-3); }
.bk-logout-btn {
  display: flex; align-items: center; gap: 7px;
  width: 100%; padding: 7px 8px; margin-top: 4px;
  border-radius: var(--bk-radius-sm);
  border: 1px solid var(--bk-border);
  background: none; color: var(--bk-text-2);
  font-family: 'Inter', sans-serif; font-size: .8rem;
  cursor: pointer; transition: var(--bk-transition);
}
.bk-logout-btn:hover { background: #fef2f2; color: #dc2626; border-color: #fecaca; }
 
/* ══════════════════════════════
   CONTENU PRINCIPAL
══════════════════════════════ */
.bk-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
 
.bk-topbar {
  background: var(--bk-surface);
  border-bottom: 1px solid var(--bk-border);
  padding: 12px 20px;
  display: flex; align-items: center; gap: 12px;
  position: sticky; top: 0; z-index: 10;
}
.bk-topbar h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem; font-weight: 600; color: var(--bk-text);
  margin: 0; margin-right: auto;
}
.bk-search-box {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 12px; border: 1.5px solid var(--bk-border);
  border-radius: 40px; background: var(--bk-bg);
  transition: var(--bk-transition);
}
.bk-search-box:focus-within { border-color: var(--bk-primary); background: var(--bk-surface); }
.bk-search-box input {
  border: none; background: none; font-size: .83rem;
  color: var(--bk-text); outline: none; width: 200px;
  font-family: 'Inter', sans-serif;
}
.bk-search-box input::placeholder { color: var(--bk-text-3); }
.bk-search-icon { color: var(--bk-text-3); font-size: .9rem; }
 
.bk-content { padding: 20px; flex: 1; }
 
/* ══════════════════════════════
   STATS
══════════════════════════════ */
.bk-stats {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 12px; margin-bottom: 20px;
}
.bk-stat {
  background: var(--bk-surface); border: 1px solid var(--bk-border);
  border-radius: var(--bk-radius-sm); padding: 12px 16px;
}
.bk-stat-n { font-size: 1.6rem; font-weight: 800; color: var(--bk-text); line-height: 1; }
.bk-stat-l { font-size: .72rem; color: var(--bk-text-3); font-weight: 500; margin-top: 3px; }
.bk-stat.ok   .bk-stat-n { color: var(--bk-success); }
.bk-stat.bad  .bk-stat-n { color: var(--bk-danger); }
 
/* ══════════════════════════════
   FILTRES CATÉGORIES
══════════════════════════════ */
.bk-cats {
  display: flex; gap: 7px; flex-wrap: wrap; margin-bottom: 18px;
}
.bk-cat {
  padding: 6px 14px; border-radius: 20px;
  border: 1.5px solid var(--bk-border);
  background: var(--bk-surface); color: var(--bk-text-2);
  font-family: 'Inter', sans-serif; font-size: .78rem; font-weight: 500;
  cursor: pointer; transition: var(--bk-transition);
}
.bk-cat:hover { border-color: #93c5fd; background: var(--bk-primary-lt); }
.bk-cat.active {
  background: var(--bk-primary-lt); color: var(--bk-primary);
  border-color: #93c5fd; font-weight: 600;
}
 
/* ══════════════════════════════
   GRILLE LIVRES
══════════════════════════════ */
.bk-section-label {
  font-size: .78rem; font-weight: 600; color: var(--bk-text-2);
  margin-bottom: 12px; display: flex; align-items: center; gap: 6px;
}
.bk-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}
 
/* ── CARTE LIVRE ── */
.bk-card {
  background: var(--bk-surface); border: 1px solid var(--bk-border);
  border-radius: var(--bk-radius); overflow: hidden; cursor: pointer;
  display: flex; flex-direction: column;
  transition: transform var(--bk-transition), box-shadow var(--bk-transition), border-color var(--bk-transition);
}
.bk-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(15,23,42,.10);
  border-color: #93c5fd;
}
 
/* ── couverture locale (placeholder coloré) ── */
.bk-cover-local {
  height: 170px; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
.bk-cover-local.c1 { background: linear-gradient(145deg,#dbeafe,#bfdbfe); }
.bk-cover-local.c2 { background: linear-gradient(145deg,#dcfce7,#bbf7d0); }
.bk-cover-local.c3 { background: linear-gradient(145deg,#fef3c7,#fde68a); }
.bk-cover-local.c4 { background: linear-gradient(145deg,#fce7f3,#fbcfe8); }
.bk-cover-local.c5 { background: linear-gradient(145deg,#ede9fe,#ddd6fe); }
.bk-cover-local.c6 { background: linear-gradient(145deg,#ffedd5,#fed7aa); }
 
.bk-spine {
  position: absolute; left: 0; top: 0; bottom: 0; width: 6px;
}
.bk-cover-local.c1 .bk-spine { background: linear-gradient(180deg,#2563eb,#1e40af); }
.bk-cover-local.c2 .bk-spine { background: linear-gradient(180deg,#16a34a,#14532d); }
.bk-cover-local.c3 .bk-spine { background: linear-gradient(180deg,#d97706,#92400e); }
.bk-cover-local.c4 .bk-spine { background: linear-gradient(180deg,#db2777,#9d174d); }
.bk-cover-local.c5 .bk-spine { background: linear-gradient(180deg,#7c3aed,#4c1d95); }
.bk-cover-local.c6 .bk-spine { background: linear-gradient(180deg,#ea580c,#7c2d12); }
 
.bk-cover-ph {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 7px; padding: 0 16px; z-index: 1;
}
.bk-cover-ph-icon { font-size: 2.4rem; opacity: .35; }
.bk-cover-ph-title {
  font-size: .68rem; font-weight: 700; color: #475569;
  text-align: center; text-transform: uppercase; letter-spacing: .06em;
  line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
 
/* ── couverture en ligne (image réelle) ── */
.bk-cover-online {
  height: 170px; position: relative; overflow: hidden;
  background: #ede9fe;
}
.bk-cover-online img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform .4s ease;
}
.bk-card:hover .bk-cover-online img { transform: scale(1.06); }
.bk-cover-online .bk-cover-ph {
  position: absolute; inset: 0; width: 100%; height: 100%;
}
 
/* badges sur couverture */
.bk-badge-dispo {
  position: absolute; top: 8px; right: 8px; z-index: 2;
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 20px; font-size: .68rem; font-weight: 700;
  backdrop-filter: blur(6px);
}
.bk-badge-dispo.ok   { background: rgba(240,253,244,.92); color: #166534; border: 1px solid #a7f3d0; }
.bk-badge-dispo.no   { background: rgba(254,242,242,.92); color: #991b1b; border: 1px solid #fecaca; }
.bk-badge-free {
  position: absolute; top: 8px; left: 8px; z-index: 2;
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 9px; border-radius: 20px; font-size: .68rem; font-weight: 700;
  background: rgba(237,233,254,.92); color: #4c1d95; border: 1px solid #c4b5fd;
  backdrop-filter: blur(6px);
}
.bk-badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
 
.bk-code-tag {
  position: absolute; bottom: 8px; left: 8px; z-index: 2;
  background: rgba(15,23,42,.65); color: #fff;
  font-size: .62rem; font-weight: 700; font-family: 'Courier New', monospace;
  padding: 2px 8px; border-radius: 5px; backdrop-filter: blur(4px);
}
 
/* ── corps carte ── */
.bk-body { padding: 11px 13px 10px; flex: 1; display: flex; flex-direction: column; gap: 5px; }
.bk-card-genre {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--bk-primary-lt); color: var(--bk-primary);
  border: 1px solid #bfdbfe; border-radius: 20px;
  font-size: .65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .05em; padding: 2px 8px; align-self: flex-start;
}
.bk-card-title {
  font-family: 'Playfair Display', serif;
  font-size: .88rem; font-weight: 600; color: var(--bk-text);
  line-height: 1.3; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.bk-card-author {
  font-size: .75rem; color: var(--bk-text-2); margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.bk-card-meta {
  display: flex; align-items: center; gap: 8px;
  font-size: .7rem; color: var(--bk-text-3);
}
.bk-card-exemplaires {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 8px; border-radius: 7px; background: #f8fafc;
  border: 1px solid var(--bk-border); margin-top: 2px;
}
.bk-card-ex-label { font-size: .68rem; color: var(--bk-text-2); font-weight: 500; }
.bk-card-ex-val   { font-size: .75rem; font-weight: 700; color: var(--bk-text); }
 
/* ── action ── */
.bk-card-footer {
  border-top: 1px solid var(--bk-border); background: #fafbfc;
  padding: 8px 12px;
}
.bk-btn-details {
  display: block; width: 100%; padding: 7px;
  border-radius: 8px; border: none;
  background: var(--bk-primary); color: #fff;
  font-family: 'Inter', sans-serif; font-size: .75rem; font-weight: 600;
  cursor: pointer; text-align: center; text-decoration: none;
  transition: var(--bk-transition);
}
.bk-btn-details:hover { background: var(--bk-primary-dk); }
.bk-btn-online {
  display: block; width: 100%; padding: 7px;
  border-radius: 8px; border: none;
  background: var(--bk-purple-lt); color: var(--bk-purple);
  font-family: 'Inter', sans-serif; font-size: .75rem; font-weight: 600;
  cursor: pointer; text-align: center; text-decoration: none;
  transition: var(--bk-transition);
}
.bk-btn-online:hover { background: #ddd6fe; }
 
/* ── EMPTY / LOADING ── */
.bk-loading, .bk-empty {
  text-align: center; padding: 60px 20px; color: var(--bk-text-2);
}
.bk-spinner {
  width: 40px; height: 40px; margin: 0 auto 14px;
  border: 3px solid var(--bk-border); border-top-color: var(--bk-primary);
  border-radius: 50%; animation: bk-spin .7s linear infinite;
}
@keyframes bk-spin { to { transform: rotate(360deg); } }
.bk-empty-icon { font-size: 3.5rem; opacity: .35; margin-bottom: 12px; }
.bk-empty h3 { font-family: 'Playfair Display', serif; font-size: 1.1rem; margin: 0 0 6px; }
.bk-empty p  { font-size: .83rem; color: var(--bk-text-3); margin: 0; }
 
/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .bk-sidebar { display: none; }
  .bk-grid { grid-template-columns: repeat(auto-fill, minmax(140px,1fr)); gap: 12px; }
  .bk-stats { grid-template-columns: 1fr 1fr; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement('style');
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Couleur de couverture locale selon index ── */
const COLORS = ['c1','c2','c3','c4','c5','c6'];
function coverColor(idx) { return COLORS[idx % COLORS.length]; }
 
/* ── Initiales ── */
function initials(user) {
  if (!user) return '?';
  const n = (user.prenom || user.nom || user.username || '');
  return n.slice(0,2).toUpperCase() || '?';
}
 
/* ══════════════════════════════
   COMPOSANT COUVERTURE LOCALE
══════════════════════════════ */
function LocalCover({ book, idx }) {
  const cls = coverColor(idx);
  const avail = book.exemplaires_disponibles > 0;
  return (
    <div className={`bk-cover-local ${cls}`}>
      <div className="bk-spine"/>
      <div className="bk-cover-ph">
        <span className="bk-cover-ph-icon">📖</span>
        <span className="bk-cover-ph-title">{book.titre}</span>
      </div>
      <span className={`bk-badge-dispo ${avail ? 'ok' : 'no'}`}>
        <span className="bk-badge-dot"/>
        {avail ? `${book.exemplaires_disponibles}/${book.total_exemplaires}` : 'Indisponible'}
      </span>
      <span className="bk-code-tag">{book.code}</span>
    </div>
  );
}
 
/* ══════════════════════════════
   COMPOSANT COUVERTURE EN LIGNE (image OpenLibrary)
══════════════════════════════ */
function OnlineCover({ book }) {
  const [imgError, setImgError] = useState(false);
  const coverId = book.cover_i;
  const hasImg  = coverId && !imgError;
  const imgUrl  = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
 
  return (
    <div className="bk-cover-online">
      {hasImg ? (
        <img
          src={imgUrl}
          alt={`Couverture de ${book.title}`}
          onError={() => setImgError(true)}
          loading="lazy"
        />
      ) : (
        <div className="bk-cover-ph">
          <span className="bk-cover-ph-icon">📘</span>
          <span className="bk-cover-ph-title" style={{color:'#4c1d95'}}>{book.title}</span>
        </div>
      )}
      <span className="bk-badge-free">🎁 Gratuit</span>
    </div>
  );
}
 
/* ══════════════════════════════
   CARTE LIVRE LOCAL
══════════════════════════════ */
function LocalBookCard({ book, idx, onDetailsClick }) {
  return (
    <div className="bk-card" onClick={() => onDetailsClick(book)}>
      <LocalCover book={book} idx={idx}/>
      <div className="bk-body">
        {(book.genre || book.theme) && (
          <span className="bk-card-genre">🏷 {book.genre || book.theme}</span>
        )}
        <p className="bk-card-title">{book.titre}</p>
        <p className="bk-card-author">
          {book.auteur || <em style={{color:'#94a3b8'}}>Auteur inconnu</em>}
        </p>
        <div className="bk-card-meta">
          {book.annee_publication && <span>📅 {book.annee_publication}</span>}
          {book.emplacement        && <span>📍 {book.emplacement}</span>}
        </div>
        <div className="bk-card-exemplaires">
          <span className="bk-card-ex-label">📦 Exemplaires</span>
          <span className="bk-card-ex-val">
            {book.exemplaires_disponibles}/{book.total_exemplaires}
          </span>
        </div>
      </div>
      <div className="bk-card-footer">
        <button className="bk-btn-details" onClick={() => onDetailsClick(book)}>👁 Voir les détails</button>
      </div>
    </div>
  );
}
 
/* ══════════════════════════════
   CARTE LIVRE EN LIGNE
══════════════════════════════ */
function OnlineBookCard({ book }) {
  const authors  = book.author_name ? book.author_name.slice(0,2).join(', ') : 'Auteur inconnu';
  const subjects = book.subject     ? book.subject.slice(0,2).join(' · ')    : '';
  const olKey    = book.key         ? `https://openlibrary.org${book.key}`   : '#';
 
  return (
    <div className="bk-card">
      <OnlineCover book={book}/>
      <div className="bk-body">
        {subjects && (
          <span className="bk-card-genre" style={{background:'#ede9fe',color:'#6d28d9',borderColor:'#c4b5fd'}}>
            {subjects.split(' · ')[0]}
          </span>
        )}
        <p className="bk-card-title">{book.title}</p>
        <p className="bk-card-author">{authors}</p>
        <div className="bk-card-meta">
          {book.first_publish_year && <span>📅 {book.first_publish_year}</span>}
          {book.number_of_pages_median && (
            <span>📄 {book.number_of_pages_median} p.</span>
          )}
        </div>
        {book.ratings_average && (
          <div className="bk-card-meta">
            <span>⭐ {book.ratings_average.toFixed(1)} / 5</span>
          </div>
        )}
      </div>
      <div className="bk-card-footer">
        <a
          className="bk-btn-online"
          href={olKey}
          target="_blank"
          rel="noopener noreferrer"
        >
          🌐 Lire sur OpenLibrary
        </a>
      </div>
    </div>
  );
}
 
/* ══════════════════════════════
   COMPOSANT PRINCIPAL
══════════════════════════════ */
const CATEGORIES = [
  { key:'informatique', label:'💻 Informatique' },
  { key:'sante',        label:'🏥 Santé' },
  { key:'droit',        label:'⚖️ Droit' },
  { key:'education',    label:'🎓 Éducation' },
  { key:'roman',        label:'📖 Roman' },
  { key:'science',      label:'🔬 Science' },
  { key:'histoire',     label:'🏛 Histoire' },
  { key:'philosophie',  label:'💡 Philosophie' },
];
 
export default function Books() {
  const { t } = useTranslation();
 
  /* ── State ── */
  const [page,          setPage]          = useState('local');   // 'local' | 'online'
  const [localBooks,    setLocalBooks]    = useState([]);
  const [onlineBooks,   setOnlineBooks]   = useState([]);
  const [query,         setQuery]         = useState('');
  const [category,      setCategory]      = useState('informatique');
  const [loading,       setLoading]       = useState(false);
  const [onlineLoading, setOnlineLoading] = useState(false);
  const [user,          setUser]          = useState(null);
  const [selectedBook,  setSelectedBook]  = useState(null);
 
  injectCSS('bk-css', CSS);
 
  /* ── Chargement initial ── */
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(u);
    fetchLocal('');
  }, []);
 
  /* ── Livres locaux ── */
  async function fetchLocal(q) {
    setLoading(true);
    try {
      const res = await api.get('/books', { params: { q } });
      setLocalBooks(res.data || []);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  }
 
  /* ── Livres en ligne OpenLibrary ── */
  const fetchOnline = useCallback(async (subject) => {
    setOnlineLoading(true);
    setOnlineBooks([]);
    try {
      const term = encodeURIComponent(`subject:${subject}`);
      const url  = `https://openlibrary.org/search.json?q=${term}&has_fulltext=true&limit=24&fields=key,title,author_name,cover_i,first_publish_year,subject,number_of_pages_median,ratings_average`;
      const res  = await fetch(url);
      const data = await res.json();
      setOnlineBooks(data.docs || []);
    } catch (e) {
      console.error(e);
    } finally { setOnlineLoading(false); }
  }, []);
 
  /* ── Changement de catégorie ── */
  function selectCategory(cat) {
    setCategory(cat);
    fetchOnline(cat);
  }
 
  /* ── Passage en mode en ligne ── */
  function goOnline() {
    setPage('online');
    if (onlineBooks.length === 0) fetchOnline(category);
  }
 
  /* ── Recherche locale ── */
  function handleSearch(e) {
    e.preventDefault();
    fetchLocal(query);
  }
 
  /* ── Déconnexion ── */
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/';
  }
 
  const totalDispos   = localBooks.filter(b => (b.exemplaires_disponibles ?? 0) > 0).length;
  const totalIndispos = localBooks.filter(b => (b.exemplaires_disponibles ?? 0) === 0).length;
 
  /* ════════════ RENDER ════════════ */
  return (
    <div className="bk-layout">
 
      {/* ══ SIDEBAR ══ */}
      <aside className="bk-sidebar">
        <div className="bk-brand">
          <div className="bk-brand-icon">📚</div>
          <div>
            <div className="bk-brand-name">Biblio UAC</div>
            <div className="bk-brand-sub">Espace lecteur</div>
          </div>
        </div>
 
        <div className="bk-nav-section">{t('Catalogue')}</div>
 
        <button
          className={`bk-nav-item${page === 'local' ? ' active' : ''}`}
          onClick={() => setPage('local')}
        >
          <span className="bk-nav-icon">📚</span>
          {t('Livres locaux')}
          <span className="bk-nav-badge">{localBooks.length}</span>
        </button>
 
        <button
          className={`bk-nav-item${page === 'online' ? ' active' : ''}`}
          onClick={goOnline}
        >
          <span className="bk-nav-icon">🌐</span>
          {t('Livres en ligne')}
        </button>
 
        <div className="bk-sidebar-bottom">
          <div className="bk-user-row">
            <div className="bk-avatar-sm">{initials(user)}</div>
            <div>
              <div className="bk-user-name">{user?.nom || user?.username || 'Lecteur'}</div>
              <div className="bk-user-role">{t('Lecteur')}</div>
            </div>
          </div>
          <button className="bk-logout-btn" onClick={logout}>
            🚪 {t('Déconnexion')}
          </button>
        </div>
      </aside>
 
      {/* ══ CONTENU PRINCIPAL ══ */}
      <div className="bk-main">
 
        {/* Topbar */}
        <div className="bk-topbar">
          <h1>
            {page === 'local'  && t('Catalogue des ouvrages')}
            {page === 'online' && t('Livres gratuits en ligne')}
          </h1>
          {page === 'local' && (
            <form onSubmit={handleSearch} style={{display:'flex'}}>
              <div className="bk-search-box">
                <span className="bk-search-icon">🔍</span>
                <input
                  type="text"
                  placeholder={t('Titre, auteur, code...')}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
            </form>
          )}
          {page === 'online' && (
            <div className="bk-search-box" style={{opacity:.5,pointerEvents:'none'}}>
              <span className="bk-search-icon">🔍</span>
              <input type="text" placeholder={t('Filtrer par catégorie ci-dessous...')} readOnly/>
            </div>
          )}
        </div>
 
        <div className="bk-content">
 
          {/* ══ PAGE LIVRES LOCAUX ══ */}
          {page === 'local' && (
            <>
              {/* Stats */}
              <div className="bk-stats">
                <div className="bk-stat">
                  <div className="bk-stat-n">{localBooks.length}</div>
                  <div className="bk-stat-l">{t('ouvrages')}</div>
                </div>
                <div className="bk-stat ok">
                  <div className="bk-stat-n">{totalDispos}</div>
                  <div className="bk-stat-l">{t('disponibles')}</div>
                </div>
                <div className="bk-stat bad">
                  <div className="bk-stat-n">{totalIndispos}</div>
                  <div className="bk-stat-l">{t('indisponibles')}</div>
                </div>
              </div>
 
              {loading ? (
                <div className="bk-loading">
                  <div className="bk-spinner"/>
                  <p style={{margin:0, fontSize:'.85rem'}}>{t('Chargement...')}</p>
                </div>
              ) : localBooks.length === 0 ? (
                <div className="bk-empty">
                  <div className="bk-empty-icon">📭</div>
                  <h3>{t('Aucun ouvrage trouvé')}</h3>
                  <p>{t('Essayez une autre recherche ou consultez les livres en ligne')}</p>
                  <button
                    onClick={goOnline}
                    style={{marginTop:'14px', padding:'9px 20px', border:'none',
                      borderRadius:'10px', background:'#2563eb', color:'#fff',
                      fontSize:'.85rem', fontWeight:600, cursor:'pointer', fontFamily:'Inter,sans-serif'}}
                  >
                    🌐 {t('Voir les livres en ligne')}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bk-section-label">
                    📋 {localBooks.length} {t('ouvrages dans la bibliothèque')}
                  </div>
                  <div className="bk-grid">
                    {localBooks.map((book, idx) => (
                      <LocalBookCard key={book.id} book={book} idx={idx} onDetailsClick={setSelectedBook}/>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
 
          {/* ══ PAGE LIVRES EN LIGNE ══ */}
          {page === 'online' && (
            <>
              {/* Filtres catégories */}
              <div className="bk-cats">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    className={`bk-cat${category === cat.key ? ' active' : ''}`}
                    onClick={() => selectCategory(cat.key)}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
 
              {onlineLoading ? (
                <div className="bk-loading">
                  <div className="bk-spinner"/>
                  <p style={{margin:0, fontSize:'.85rem'}}>
                    {t('Chargement depuis OpenLibrary...')}
                  </p>
                </div>
              ) : onlineBooks.length === 0 ? (
                <div className="bk-empty">
                  <div className="bk-empty-icon">🌐</div>
                  <h3>{t('Aucun livre trouvé')}</h3>
                  <p>{t('Sélectionnez une catégorie ci-dessus')}</p>
                </div>
              ) : (
                <>
                  <div className="bk-section-label">
                    🌐 {onlineBooks.length} {t('livres gratuits')} · {
                      CATEGORIES.find(c => c.key === category)?.label || category
                    }
                  </div>
                  <div className="bk-grid">
                    {onlineBooks.map((book, idx) => (
                      <OnlineBookCard key={book.key || idx} book={book}/>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
 
        </div>
      </div>

      {/* MODAL DETAILS */}
      {selectedBook && (
        <BookDetailsPanel
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </div>
  );
}