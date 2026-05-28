import React, { useState } from 'react';

/**
 * Composant réutilisable pour afficher une carte de livre
 * Utilise les mêmes images génériques que Reader.jsx
 */

/* ── Couleurs de couverture ── */
const COLORS = ['c1','c2','c3','c4','c5','c6'];
const coverColor = (idx) => COLORS[idx % COLORS.length];

const CSS = `
.book-card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.book-card-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.book-card-cover:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}

/* Couverture réelle (image) */
.book-cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Couverture générique */
.book-cover-generic {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  overflow: hidden;
}

.cover-c1 { background: linear-gradient(135deg, #0f4c75 0%, #3282b8 50%, #0f4c75 100%); }
.cover-c2 { background: linear-gradient(135deg, #0d5c3f 0%, #16a34a 50%, #0d5c3f 100%); }
.cover-c3 { background: linear-gradient(135deg, #8b4513 0%, #d97706 50%, #8b4513 100%); }
.cover-c4 { background: linear-gradient(135deg, #7d0d57 0%, #db2777 50%, #7d0d57 100%); }
.cover-c5 { background: linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #4c1d95 100%); }
.cover-c6 { background: linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #7c2d12 100%); }

.cover-spine {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
}

.cover-c1 .cover-spine { background: linear-gradient(180deg, #1e40af, #0c3c7a); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.cover-c2 .cover-spine { background: linear-gradient(180deg, #15803d, #0a3e2a); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.cover-c3 .cover-spine { background: linear-gradient(180deg, #c84400, #6b3410); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.cover-c4 .cover-spine { background: linear-gradient(180deg, #be185d, #6b0f47); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.cover-c5 .cover-spine { background: linear-gradient(180deg, #6d28d9, #371d5e); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }
.cover-c6 .cover-spine { background: linear-gradient(180deg, #d97706, #8b2b0d); box-shadow: 2px 0 8px rgba(0,0,0,0.3); }

.cover-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 1;
  text-align: center;
  padding: 16px;
}

.cover-icon {
  font-size: 3rem;
  opacity: 0.8;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.cover-title {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Badge de disponibilité */
.book-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 5px 10px;
  border-radius: 16px;
  font-size: 0.65rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.badge-available {
  background: rgba(34, 197, 94, 0.95);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}

.badge-unavailable {
  background: rgba(239, 68, 68, 0.95);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.book-card-info {
  padding: 8px 0;
}

.book-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.3;
}

.book-card-author {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-card-meta {
  font-size: 0.7rem;
  color: #94a3b8;
  margin: 4px 0 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 768px) {
  .cover-icon { font-size: 2.5rem; }
  .cover-title { font-size: 0.75rem; }
  .book-card-title { font-size: 0.8rem; }
  .book-card-author { font-size: 0.7rem; }
}

@media (max-width: 480px) {
  .cover-icon { font-size: 2rem; }
  .cover-title { font-size: 0.65rem; }
  .book-card-title { font-size: 0.75rem; }
}
`;

function injectCSS(id, css) {
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }
}

export default function BookCard({ book, index = 0, onClick = null }) {
  const [imgError, setImgError] = useState(false);
  const availableCount = book.exemplaires_disponibles || 0;
  const totalCount = book.total_exemplaires || 0;
  const isAvailable = availableCount > 0;
  const hasImage = book.image_url && !imgError;
  
  const cls = coverColor(index);

  injectCSS('book-card-css', CSS);

  const coverElement = hasImage ? (
    <img
      src={book.image_url}
      alt={`Couverture de ${book.titre}`}
      className="book-cover-image"
      onError={() => setImgError(true)}
    />
  ) : (
    <div className={`book-cover-generic cover-${cls}`}>
      <div className="cover-spine"/>
      <div className="cover-content">
        <span className="cover-icon">📖</span>
        <span className="cover-title">{book.titre}</span>
      </div>
    </div>
  );

  return (
    <div className="book-card-container" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="book-card-cover">
        {coverElement}
        <span className={`book-badge ${isAvailable ? 'badge-available' : 'badge-unavailable'}`}>
          <span className="badge-dot"/>
          {isAvailable ? `${availableCount}/${totalCount}` : 'Indisponible'}
        </span>
      </div>
      <div className="book-card-info">
        <h3 className="book-card-title">{book.titre}</h3>
        <p className="book-card-author">{book.auteur || 'Auteur inconnu'}</p>
        <div className="book-card-meta">
          {book.annee_publication && <span>📅 {book.annee_publication}</span>}
          {book.genre && <span>🏷 {book.genre}</span>}
        </div>
      </div>
    </div>
  );
}
