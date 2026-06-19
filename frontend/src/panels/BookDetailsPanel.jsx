// frontend/src/panels/BookDetailsPanel.jsx
import React from "react";
import { useTranslation } from 'react-i18next';
import Modal from "../shared/Modal";
import { getBookCoverCandidates, BookCoverImage } from "../components/BookCover";
// Note: details.css remplacé par styles intégrés ci-dessous (plus maintenable)
 
/* ═══════════════════════════════════════════════════════════
   STYLES — injectés une seule fois dans <head>
═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
 
:root {
  --bd-primary:    #2563eb;
  --bd-primary-dk: #1d4ed8;
  --bd-primary-lt: #eff6ff;
  --bd-success:    #16a34a;
  --bd-danger:     #dc2626;
  --bd-warning:    #d97706;
  --bd-text:       #0f172a;
  --bd-text-2:     #475569;
  --bd-text-3:     #94a3b8;
  --bd-border:     #e2e8f0;
  --bd-surface:    #ffffff;
  --bd-bg:         #f8fafc;
  --bd-radius:     14px;
  --bd-shadow:     0 2px 12px rgba(15,23,42,.07);
  --bd-shadow-lg:  0 8px 32px rgba(15,23,42,.12);
  --bd-transition: .2s cubic-bezier(.4,0,.2,1);
}
 
/* ── Wrapper principal ── */
.bd-wrapper {
  font-family: 'Inter', sans-serif;
  color: var(--bd-text);
  max-width: 900px;
}
 
/* ══════════════════════════════
   HERO — image + infos + action
══════════════════════════════ */
.bd-hero {
  display: grid;
  grid-template-columns: 180px 1fr 200px;
  gap: 28px;
  align-items: flex-start;
  padding: 24px 0 28px;
  border-bottom: 1px solid var(--bd-border);
  margin-bottom: 28px;
}
 
/* ── Couverture ── */
.bd-cover-col { display: flex; flex-direction: column; align-items: center; gap: 12px; }
 
.bd-cover-frame {
  position: relative;
  width: 160px; height: 230px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(15,23,42,.18), 4px 4px 0 0 rgba(15,23,42,.08);
}
.bd-cover-frame img {
  width: 100%; height: 100%; object-fit: cover;
  transition: transform .4s ease;
}
.bd-cover-frame:hover img { transform: scale(1.04); }
.bd-cover-spine {
  position: absolute; left: 0; top: 0; bottom: 0; width: 6px;
  background: linear-gradient(180deg, var(--bd-primary), var(--bd-primary-dk));
}
 
/* Placeholder couverture */
.bd-cover-placeholder {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 10px;
  background: linear-gradient(145deg, #dbeafe, #bfdbfe);
  color: var(--bd-text-2);
}
.bd-cover-placeholder .cp-icon { font-size: 3rem; opacity: .5; }
.bd-cover-placeholder .cp-title {
  font-size: .68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .06em; text-align: center; padding: 0 10px;
  display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
}
 
.bd-code-pill {
  background: rgba(15,23,42,.07); color: var(--bd-text-2);
  font-size: .7rem; font-weight: 700; font-family: 'Courier New', monospace;
  padding: 4px 12px; border-radius: 20px; border: 1px solid var(--bd-border);
  letter-spacing: .05em;
}
 
/* ── Infos principales ── */
.bd-info-col {}
 
.bd-type-chip {
  display: inline-flex; align-items: center; gap: 5px;
  background: var(--bd-primary-lt); color: var(--bd-primary);
  border: 1px solid #bfdbfe; border-radius: 20px;
  font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .06em;
  padding: 3px 12px; margin-bottom: 12px;
}
 
.bd-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.65rem; font-weight: 700; line-height: 1.3;
  color: var(--bd-text); margin: 0 0 8px;
}
 
.bd-byline {
  font-size: .9rem; color: var(--bd-text-2); margin: 0 0 16px;
  display: flex; align-items: center; gap: 6px;
}
.bd-byline strong { color: var(--bd-primary); font-weight: 600; }
 
/* Rating */
.bd-rating {
  display: flex; align-items: center; gap: 8px; margin-bottom: 16px;
}
.bd-stars { color: #f59e0b; font-size: .9rem; letter-spacing: 2px; }
.bd-rating-num { font-size: .85rem; font-weight: 700; color: var(--bd-text); }
.bd-rating-count { font-size: .78rem; color: var(--bd-text-3); }
 
/* Quick summary pills */
.bd-quick-grid {
  display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px;
}
.bd-quick-item {
  display: flex; align-items: center; gap: 6px;
  background: var(--bd-bg); border: 1px solid var(--bd-border);
  border-radius: 8px; padding: 7px 12px; font-size: .8rem;
}
.bd-quick-label { color: var(--bd-text-3); font-weight: 500; }
.bd-quick-val   { color: var(--bd-text); font-weight: 700; }
 
/* Tags mots-clés */
.bd-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.bd-tag {
  background: #f1f5f9; color: var(--bd-text-2);
  border: 1px solid var(--bd-border); border-radius: 20px;
  font-size: .72rem; font-weight: 500; padding: 3px 10px;
  transition: var(--bd-transition);
}
.bd-tag:hover { background: var(--bd-primary-lt); color: var(--bd-primary); border-color: #bfdbfe; }
 
/* ── Colonne action (côté droit) ── */
.bd-action-col {
  background: var(--bd-surface);
  border: 1px solid var(--bd-border);
  border-radius: var(--bd-radius);
  padding: 20px;
  box-shadow: var(--bd-shadow-lg);
  display: flex; flex-direction: column; gap: 14px;
}
 
.bd-status-badge {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  padding: 8px 16px; border-radius: 8px; font-size: .82rem; font-weight: 700;
  width: 100%; box-sizing: border-box;
}
.bd-status-badge.ok   { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
.bd-status-badge.none { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
.bd-status-dot { width: 8px; height: 8px; border-radius: 50%; }
.bd-status-badge.ok   .bd-status-dot { background: var(--bd-success); }
.bd-status-badge.none .bd-status-dot { background: var(--bd-danger); }
 
.bd-exemplaires-display {
  text-align: center; padding: 12px;
  background: var(--bd-bg); border-radius: 10px;
  border: 1px solid var(--bd-border);
}
.bd-exemplaires-display .ex-num {
  font-size: 2rem; font-weight: 800; color: var(--bd-text); line-height: 1;
}
.bd-exemplaires-display .ex-label {
  font-size: .75rem; color: var(--bd-text-3); font-weight: 500; margin-top: 3px;
}
 
.bd-action-note {
  font-size: .75rem; color: var(--bd-text-3); text-align: center; line-height: 1.5;
  background: #fffbeb; border: 1px solid #fde68a;
  border-radius: 8px; padding: 8px 10px; color: #92400e;
}
 
.bd-free-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 100%; padding: 7px; border-radius: 8px;
  background: #f0fdf4; color: #166534; border: 1px solid #a7f3d0;
  font-size: .78rem; font-weight: 700;
}
 
/* ══════════════════════════════
   CORPS — description + specs
══════════════════════════════ */
.bd-body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  margin-bottom: 28px;
}
 
/* Section titre */
.bd-section-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem; font-weight: 600; color: var(--bd-text);
  margin: 0 0 14px; padding-bottom: 8px;
  border-bottom: 2px solid var(--bd-primary-lt);
  display: flex; align-items: center; gap: 8px;
}
 
/* Description */
.bd-desc-card {
  background: var(--bd-surface); border: 1px solid var(--bd-border);
  border-radius: var(--bd-radius); padding: 22px;
  box-shadow: var(--bd-shadow);
}
.bd-desc-text {
  font-size: .875rem; color: var(--bd-text-2); line-height: 1.75;
  margin: 0 0 16px;
}
.bd-desc-text:last-child { margin-bottom: 0; }
 
.bd-resume-block {
  background: var(--bd-primary-lt); border-left: 4px solid var(--bd-primary);
  border-radius: 0 10px 10px 0; padding: 14px 16px; margin-bottom: 16px;
}
.bd-resume-block p { font-size: .875rem; color: var(--bd-text-2); line-height: 1.7; margin: 0; }
 
/* Specs */
.bd-spec-card {
  background: var(--bd-surface); border: 1px solid var(--bd-border);
  border-radius: var(--bd-radius); padding: 22px;
  box-shadow: var(--bd-shadow); height: fit-content;
}
.bd-spec-list { display: flex; flex-direction: column; gap: 0; }
.bd-spec-row {
  display: flex; align-items: baseline; justify-content: space-between; gap: 8px;
  padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-size: .82rem;
}
.bd-spec-row:last-child { border-bottom: none; }
.bd-spec-dt { color: var(--bd-text-3); font-weight: 500; flex-shrink: 0; }
.bd-spec-dd { color: var(--bd-text); font-weight: 600; text-align: right; }
 
/* ══════════════════════════════
   AVIS
══════════════════════════════ */
.bd-reviews-card {
  background: var(--bd-surface); border: 1px solid var(--bd-border);
  border-radius: var(--bd-radius); padding: 22px;
  box-shadow: var(--bd-shadow); margin-bottom: 28px;
}
.bd-review-body { font-size: .875rem; color: var(--bd-text-2); line-height: 1.75; }
.bd-review-body p { margin: 0 0 10px; }
.bd-review-body p:last-child { margin: 0; }
 
/* ══════════════════════════════
   FOOTER
══════════════════════════════ */
.bd-footer {
  display: flex; justify-content: flex-end; padding-top: 4px;
}
.bd-btn-close {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 28px; border-radius: 10px;
  border: 1.5px solid var(--bd-border);
  background: var(--bd-bg); color: var(--bd-text-2);
  font-family: 'Inter', sans-serif; font-size: .875rem; font-weight: 600;
  cursor: pointer; transition: var(--bd-transition);
}
.bd-btn-close:hover { background: #f1f5f9; color: var(--bd-text); border-color: #cbd5e1; }
 
/* ── Responsive ── */
@media (max-width: 768px) {
  .bd-hero  { grid-template-columns: 1fr; }
  .bd-body  { grid-template-columns: 1fr; }
  .bd-cover-frame { width: 130px; height: 190px; }
  .bd-title { font-size: 1.3rem; }
  .bd-action-col { width: 100%; box-sizing: border-box; }
}
`;
 
function injectCSS(id, css) {
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id; s.textContent = css;
  document.head.appendChild(s);
}
 
/* ── Étoiles ── */
function Stars({ rating }) {
  if (!rating) return null;
  const full = Math.round(Number(rating));
  return (
    <div className="bd-rating">
      <span className="bd-stars">{"★".repeat(full)}{"☆".repeat(5 - full)}</span>
      <span className="bd-rating-num">{rating}</span>
      <span className="bd-rating-count">/ 5</span>
    </div>
  );
}
 
/* ══════════════════════════════════════════
   COMPOSANT PRINCIPAL — logique 100 % intacte
══════════════════════════════════════════ */
export default function BookDetailsPanel({ book, onClose }) {
  const { t } = useTranslation();
  injectCSS("bd-css", CSS);
 
  if (!book) return null;
 
  const disponible = book.exemplaires_disponibles > 0;
  const coverUrls  = getBookCoverCandidates(book);

  const detailItems = [
    { label: t('Auteur'),        value: book.auteur },
    { label: t('Éditeur'),       value: book.editeur },
    { label: t('Année'),         value: book.annee_publication },
    { label: t('Édition'),       value: book.edition },
    { label: t('Langue'),        value: book.langue },
    { label: t('Pages'),         value: book.nombre_pages },
    { label: t('Genre'),         value: book.genre },
    { label: t('Type'),          value: book.type_ouvrage },
    { label: t('Emplacement'),   value: book.emplacement },
    { label: t('Thème'),         value: book.theme },
    { label: t('Disponibilité'), value: disponible ? t('Disponible') : t('Indisponible') },
  ];
 
  const isPeriodique = book.type_ouvrage === 'périodique';
  const modalTitle   = isPeriodique
    ? `📰 ${t('Fiche détaillée du périodique')}`
    : `📚 ${t('Fiche détaillée du livre')}`;
 
  return (
    <Modal title={modalTitle} onClose={onClose}>
      <div className="bd-wrapper">
 
        {/* ════ HERO ════ */}
        <section className="bd-hero">
 
          {/* Colonne couverture */}
          <div className="bd-cover-col">
            <div className="bd-cover-frame">
              <div className="bd-cover-spine"/>
              {coverUrls.length ? (
                <BookCoverImage book={book} className="bd-cover-img" />
              ) : (
                <div className="bd-cover-placeholder">
                  <span className="cp-icon">📖</span>
                  <span className="cp-title">{book.titre}</span>
                </div>
              )}
            </div>
            <span className="bd-code-pill">{book.code}</span>
          </div>
 
          {/* Colonne informations */}
          <div className="bd-info-col">
            <span className="bd-type-chip">
              {isPeriodique ? "📰" : "📚"} {book.type_ouvrage ? t(book.type_ouvrage) : t('Livre')}
            </span>
 
            <h1 className="bd-title">{book.titre}</h1>
 
            <p className="bd-byline">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              de <strong>{book.auteur || t('Auteur inconnu')}</strong>
            </p>
 
            {book.amazon_rating && <Stars rating={book.amazon_rating}/>}
 
            {/* Quick summary */}
            <div className="bd-quick-grid">
              <div className="bd-quick-item">
                <span className="bd-quick-label">{t('Code')}</span>
                <span className="bd-quick-val"
                  style={{fontFamily:"'Courier New',monospace",fontSize:'.78rem'}}>
                  {book.code}
                </span>
              </div>
              <div className="bd-quick-item">
                <span className="bd-quick-label">{t('Exemplaires')}</span>
                <span className="bd-quick-val">
                  {book.exemplaires_disponibles}/{book.total_exemplaires}
                </span>
              </div>
              {book.annee_publication && (
                <div className="bd-quick-item">
                  <span className="bd-quick-label">{t('Année')}</span>
                  <span className="bd-quick-val">{book.annee_publication}</span>
                </div>
              )}
              {book.langue && (
                <div className="bd-quick-item">
                  <span className="bd-quick-label">{t('Langue')}</span>
                  <span className="bd-quick-val">{book.langue}</span>
                </div>
              )}
              {book.nombre_pages && (
                <div className="bd-quick-item">
                  <span className="bd-quick-label">{t('Pages')}</span>
                  <span className="bd-quick-val">{book.nombre_pages}</span>
                </div>
              )}
            </div>
 
            {/* Mots-clés */}
            {book.mots_cles && (
              <div className="bd-tags">
                {book.mots_cles.split(',').map((tag, i) => (
                  <span key={i} className="bd-tag">{tag.trim()}</span>
                ))}
              </div>
            )}
          </div>
 
          {/* Colonne action */}
          <div className="bd-action-col">
            <span className={`bd-status-badge ${disponible ? 'ok' : 'none'}`}>
              <span className="bd-status-dot"/>
              {disponible ? t('Disponible') : t('Indisponible')}
            </span>
 
            <div className="bd-exemplaires-display">
              <div className="ex-num">{book.exemplaires_disponibles}</div>
              <div className="ex-label">
                {t('sur')} {book.total_exemplaires} {t('Disponibles')}
              </div>
            </div>
 
            {book.gratuit && (
              <div className="bd-free-badge">🎁 {t('Accès gratuit')}</div>
            )}
 
            <div className="bd-action-note">
              {t('Rendez-vous à la bibliothèque pour effectuer un emprunt ou une consultation.')}
            </div>
          </div>
        </section>
 
        {/* ════ CORPS ════ */}
        <div className="bd-body">
 
          {/* Description / Résumé */}
          <div className="bd-desc-card">
            <h2 className="bd-section-title">📖 {t('À propos de ce livre')}</h2>
 
            {book.resume && (
              <div className="bd-resume-block">
                <p>{book.resume}</p>
              </div>
            )}
 
            <p className="bd-desc-text">
              {book.description || t('Aucune description disponible pour cet ouvrage.')}
            </p>
          </div>
 
          {/* Fiche technique */}
          <div className="bd-spec-card">
            <h2 className="bd-section-title">🔍 {t('Détails')}</h2>
            <div className="bd-spec-list">
              {detailItems.map(item => item.value ? (
                <div key={item.label} className="bd-spec-row">
                  <dt className="bd-spec-dt">{item.label}</dt>
                  <dd className="bd-spec-dd">{item.value}</dd>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
 
        {/* ════ AVIS ════ */}
        {book.amazon_reviews && (
          <div className="bd-reviews-card">
            <h2 className="bd-section-title">💬 {t('Avis et commentaires')}</h2>
            <div className="bd-review-body">
              {book.amazon_reviews.split('\n').map((line, i) =>
                line.trim()
                  ? <p key={i}>{line}</p>
                  : <br key={i}/>
              )}
            </div>
          </div>
        )}
 
        {/* ════ FOOTER ════ */}
        <div className="bd-footer">
          <button className="bd-btn-close" onClick={onClose}>
            ✕ {t('Fermer')}
          </button>
        </div>
 
      </div>
    </Modal>
  );
}