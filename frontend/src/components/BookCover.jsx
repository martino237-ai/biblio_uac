import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

/* ════════════════════════════════════════════════════════════
   COMPOSANT RÉUTILISABLE: COUVERTURE DE LIVRE GÉNÉRIQUE
════════════════════════════════════════════════════════════ */

/**
 * Couleurs de dégradé par index
 * Chaque livre reçoit une couleur différente selon son index
 */
const COVER_COLORS = [
  { bg: 'linear-gradient(135deg, #0f4c75 0%, #3282b8 50%, #0f4c75 100%)', spine: 'linear-gradient(180deg,#1e40af,#0c3c7a)' },
  { bg: 'linear-gradient(135deg, #0d5c3f 0%, #16a34a 50%, #0d5c3f 100%)', spine: 'linear-gradient(180deg,#15803d,#0a3e2a)' },
  { bg: 'linear-gradient(135deg, #8b4513 0%, #d97706 50%, #8b4513 100%)', spine: 'linear-gradient(180deg,#c84400,#6b3410)' },
  { bg: 'linear-gradient(135deg, #7d0d57 0%, #db2777 50%, #7d0d57 100%)', spine: 'linear-gradient(180deg,#be185d,#6b0f47)' },
  { bg: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #4c1d95 100%)', spine: 'linear-gradient(180deg,#6d28d9,#371d5e)' },
  { bg: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #7c2d12 100%)', spine: 'linear-gradient(180deg,#d97706,#8b2b0d)' },
];

/**
 * Récupère les couleurs basées sur l'index
 */
function getCoverColor(index) {
  return COVER_COLORS[index % COVER_COLORS.length];
}

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

function normalizeBookImageUrl(value) {
  if (!value) return null;
  const src = String(value).trim();
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith('/')) return src;
  return `/${src.replace(/^public\//, '').replace(/^\/+/, '')}`;
}

function sanitizeBookFileName(str) {
  return String(str || '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[\s\\\/]+/g, '_')
    .replace(/[^\w.-]/g, '')
    .toLowerCase();
}

function buildImageUrlsFromBase(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed) return [];

  if (/^https?:\/\//i.test(trimmed)) {
    return [trimmed];
  }

  const base = trimmed.replace(/^public\//, '').replace(/^\/+/, '');
  if (IMAGE_EXTENSIONS.some((ext) => base.toLowerCase().endsWith(ext))) {
    return [`/${base}`];
  }

  return IMAGE_EXTENSIONS.map((ext) => `/${base}${ext}`);
}

export function getBookCoverCandidates(book) {
  if (!book) return [];
  const urls = [];

  if (book.image_url) {
    urls.push(...buildImageUrlsFromBase(book.image_url));
  }

  const candidates = [book.code, book.titre, book.title, book.isbn]
    .filter(Boolean)
    .map(sanitizeBookFileName)
    .filter(Boolean);

  for (const candidate of candidates) {
    for (const ext of IMAGE_EXTENSIONS) {
      urls.push(`/images_livres/${candidate}${ext}`);
    }
  }

  return [...new Set(urls)];
}

export function getBookCoverUrl(book) {
  const candidates = getBookCoverCandidates(book);
  return candidates.length > 0 ? candidates[0] : null;
}

/* ════════════════════════════════════════════════════════════
   COUVERTURE GÉNÉRIQUE - VERSION SIMPLE
════════════════════════════════════════════════════════════ */
export function GenericBookCover({ 
  book, 
  index = 0, 
  size = 'normal', // 'small' | 'normal' | 'large'
  showSpine = true,
  showCode = true
}) {
  const { t } = useTranslation();
  const colors = getCoverColor(index);
  
  // Dimensions selon la taille
  const sizeConfig = {
    small: { height: '120px', iconSize: '2rem', titleSize: '0.6rem', spineWidth: '5px' },
    normal: { height: '170px', iconSize: '3.5rem', titleSize: '0.82rem', spineWidth: '8px' },
    large: { height: '230px', iconSize: '4rem', titleSize: '1rem', spineWidth: '10px' },
  };
  
  const config = sizeConfig[size] || sizeConfig.normal;
  
  return (
    <div
      style={{
        height: config.height,
        background: colors.bg,
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      {/* Épine du livre */}
      {showSpine && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: config.spineWidth,
            background: colors.spine,
            boxShadow: '2px 0 8px rgba(0,0,0,0.3)',
          }}
        />
      )}

      {/* Contenu */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '20px',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: config.iconSize, opacity: 0.8 }}>📖</div>
        <div
          style={{
            fontSize: config.titleSize,
            fontWeight: 800,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            lineHeight: 1.4,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: '100%',
          }}
        >
          {book.titre || book.title || t('Sans titre')}
        </div>
      </div>

      {/* Badge disponibilité */}
      {book.exemplaires_disponibles !== undefined && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            zIndex: 2,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 10px',
            borderRadius: '20px',
            fontSize: '0.7rem',
            fontWeight: 700,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            background: book.exemplaires_disponibles > 0 
              ? 'rgba(34, 197, 94, 0.95)' 
              : 'rgba(239, 68, 68, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
          {book.exemplaires_disponibles > 0 
            ? `${book.exemplaires_disponibles}/${book.total_exemplaires}`
            : t('Indisponible')
          }
        </div>
      )}

      {/* Code du livre */}
      {showCode && book.code && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            zIndex: 2,
            background: 'rgba(15,23,42,.85)',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700,
            fontFamily: "'Courier New', monospace",
            padding: '3px 8px',
            borderRadius: '5px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {book.code}
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   COUVERTURE EN LIGNE (OpenLibrary)
════════════════════════════════════════════════════════════ */
export function OnlineBookCover({ book, size = 'normal' }) {
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  const coverId = book.cover_i;
  const hasImg = coverId && !imgError;
  const imgUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

  const sizeConfig = {
    small: { height: '120px', iconSize: '2rem', titleSize: '0.6rem' },
    normal: { height: '170px', iconSize: '3rem', titleSize: '0.82rem' },
    large: { height: '230px', iconSize: '3.5rem', titleSize: '1rem' },
  };

  const config = sizeConfig[size] || sizeConfig.normal;

  return (
    <div
      style={{
        height: config.height,
        position: 'relative',
        overflow: 'hidden',
        background: '#ede9fe',
        borderRadius: '10px',
      }}
    >
      {hasImg ? (
        <img
          src={imgUrl}
          alt={t('Couverture de {{title}}', { title: book.title || t('Sans titre') })}
          onError={() => setImgError(true)}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            transition: 'transform 0.4s ease',
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: config.iconSize, opacity: 0.7 }}>📘</div>
          <div
            style={{
              fontSize: config.titleSize,
              fontWeight: 700,
              color: '#6d28d9',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {book.title}
          </div>
        </div>
      )}

      {/* Badge Gratuit */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '5px 10px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: 700,
          background: 'rgba(99, 102, 241, 0.95)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        🎁 {t('Gratuit')}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   COUVERTURE PAR DÉFAUT (Sélectionne automatique)
════════════════════════════════════════════════════════════ */
function LocalBookCover({ book, imageUrls = [], index = 0, size = 'normal' }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const validUrls = Array.isArray(imageUrls) ? imageUrls.filter(Boolean) : [];
  const src = validUrls[currentIndex] || null;

  const sizeConfig = {
    small: { height: '120px' },
    normal: { height: '170px' },
    large: { height: '230px' },
  };
  const config = sizeConfig[size] || sizeConfig.normal;

  const hasImage = Boolean(src);

  const { t } = useTranslation();
  const coverTitle = book.titre || book.title || t('Sans titre');

  return (
    <div
      style={{
        height: config.height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '10px',
        background: hasImage ? '#f3f4f6' : 'transparent',
      }}
    >
      {hasImage ? (
        <img
          src={src}
          alt={t('Couverture de {{title}}', { title: coverTitle })}
          onError={() => {
            if (currentIndex + 1 < validUrls.length) {
              setCurrentIndex(currentIndex + 1);
            }
          }}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      ) : (
        <GenericBookCover book={book} index={index} size={size} />
      )}
    </div>
  );
}

export function BookCover({ book, index = 0, size = 'normal', isOnline = false }) {
  if (isOnline) {
    return <OnlineBookCover book={book} size={size} />;
  }
  const imageUrls = getBookCoverCandidates(book);
  if (imageUrls.length) {
    return <LocalBookCover book={book} imageUrls={imageUrls} index={index} size={size} />;
  }
  return <GenericBookCover book={book} index={index} size={size} />;
}

export function BookCoverImage({ book, alt, className, style }) {
  const { t } = useTranslation();
  const imageUrls = getBookCoverCandidates(book);
  const [currentIndex, setCurrentIndex] = useState(0);
  const src = imageUrls[currentIndex] || null;
  const coverTitle = book.titre || book.title || t('Sans titre');

  if (!src) return null;

  return (
    <img
      src={src}
      alt={alt || t('Couverture de {{title}}', { title: coverTitle })}
      className={className}
      style={style}
      onError={() => {
        if (currentIndex + 1 < imageUrls.length) {
          setCurrentIndex(currentIndex + 1);
        }
      }}
    />
  );
}

export default BookCover;
