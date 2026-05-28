# 🖼️ Images Génériques - Documentation

## Vue d'ensemble

La page `Reader.jsx` utilise des images génériques (placeholders) qui s'affichent automatiquement quand:
- Une image réelle n'est pas disponible
- Le livre n'a pas d'URL de couverture
- L'image échoue à charger

## Types de Couvertures

### 1. **Couvertures Locales** (Livres de la bibliothèque)
Les couvertures locales utilisent des **dégradés de couleurs** professionnels et attrayants:

```
Couleur 1 (Bleu):      #0f4c75 → #3282b8
Couleur 2 (Vert):      #0d5c3f → #16a34a
Couleur 3 (Orange):    #8b4513 → #d97706
Couleur 4 (Rose):      #7d0d57 → #db2777
Couleur 5 (Violet):    #4c1d95 → #7c3aed
Couleur 6 (Rouge):     #7c2d12 → #ea580c
```

**Éléments affichés:**
- 📖 Icône emoji du livre (3.5rem)
- 📕 Titre du livre en blanc avec ombre
- 📍 Épine du livre (spine) sur le côté gauche
- 🏷️ Badge de disponibilité (vert/rouge)
- 📦 Code du livre

### 2. **Couvertures en Ligne** (OpenLibrary)
Les couvertures en ligne essaient d'abord de charger l'image réelle depuis OpenLibrary.

**Si l'image échoue:**
- 📘 Icône du livre utilisée comme placeholder
- 📕 Titre du livre en violet
- 🎁 Badge "Gratuit" en bleu

## Styles CSS Appliqués

### Couverture Locale
```css
.bk-cover-local {
  height: 170px (desktop) / 140px (tablet) / 130px (mobile)
  Gradient background + Spine styling
}

.bk-cover-ph-icon {
  font-size: 3.5rem (desktop) / 2rem (mobile)
  opacity: 0.7
  text-shadow: drop shadow pour visibilité
}

.bk-cover-ph-title {
  font-size: 0.82rem (desktop) / 0.55rem (mobile)
  color: white
  text-shadow: 0 2px 4px rgba(0,0,0,0.3)
  max-lines: 3
}
```

### Badges
```css
.bk-badge-dispo {
  Disponible (vert):    rgba(34, 197, 94, 0.95)
  Indisponible (rouge): rgba(239, 68, 68, 0.95)
}

.bk-badge-free {
  Gratuit (bleu):       rgba(99, 102, 241, 0.95)
}
```

## Responsive Design

### Points de rupture (Breakpoints):
- **1024px+**: Bureau (Desktop)
- **768-1024px**: Tablette (Tablet)
- **600-768px**: Téléphone moyen (Mobile)
- **420-600px**: Petit téléphone (Small mobile)
- **<420px**: Ultra-petit écran (Mini)

### Ajustements par écran:

| Élément | Desktop | Tablet | Mobile | Mini |
|---------|---------|--------|--------|------|
| Hauteur couverture | 170px | 140px | 130px | 110px |
| Icône | 3.5rem | 2rem | 2rem | 1.5rem |
| Titre | 0.82rem | 0.6rem | 0.55rem | 0.5rem |
| Badge | 0.7rem | 0.6rem | 0.6rem | 0.55rem |
| Espacement | 12px | 10px | 8px | 6px |

## Caractéristiques d'Accessibilité

✅ **Accessibilité complète:**
- Textes en contraste blanc sur dégradés sombres
- Text-shadow pour meilleure lisibilité
- Icons emoji visibles et compréhensibles
- Suffisant espace entre éléments
- Badges clairs avec couleurs distinctes

## Performance

✅ **Optimisations:**
- Pas de chargement d'images externes pour placeholders
- Dégradés CSS purs (pas d'images)
- Lazy loading des images OpenLibrary
- Fallback automatique en cas d'erreur
- Cache navigateur pour couvertures en ligne

## Utilisation dans le Code

### LocalCover Component
```jsx
function LocalCover({ book, idx }) {
  const cls = coverColor(idx);  // c1, c2, c3, c4, c5, c6
  const avail = book.exemplaires_disponibles > 0;
  
  return (
    <div className={`bk-cover-local ${cls}`}>
      {/* Affiche automatiquement le dégradé + icône + titre */}
    </div>
  );
}
```

### OnlineCover Component
```jsx
function OnlineCover({ book }) {
  const imgUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  
  // Essaye charger l'image
  // Si erreur → affiche placeholder
  
  return (
    <div className="bk-cover-online">
      {hasImg ? <img src={imgUrl} /> : <Placeholder />}
    </div>
  );
}
```

## Couleurs et Thème

Le système utilise des **CSS Variables** pour une gestion centralisée:

```css
:root {
  --bk-primary: #2563eb      (Bleu principal)
  --bk-success: #16a34a      (Vert succès)
  --bk-danger: #dc2626       (Rouge danger)
  --bk-purple: #7c3aed       (Violet)
  --bk-text: #0f172a         (Texte noir)
  --bk-bg: #f1f5f9           (Gris clair)
  --bk-surface: #ffffff      (Surface blanche)
}
```

## Personnalisation

Pour modifier les couleurs des couvertures:

1. **Éditer les dégradés dans la section CSS**:
```css
.bk-cover-local.c1 { 
  background: linear-gradient(135deg, COULEUR1 0%, COULEUR2 50%, COULEUR1 100%); 
}
```

2. **Ajouter une nouvelle couleur**:
```css
.bk-cover-local.c7 { background: linear-gradient(135deg, #nouveau1, #nouveau2); }
.bk-cover-local.c7 .bk-spine { background: linear-gradient(180deg, #spine1, #spine2); }
```

3. **Mettre à jour la palette dans COLORS[]**:
```js
const COLORS = ['c1','c2','c3','c4','c5','c6','c7'];
```

## Troubleshooting

### 🐛 Les images génériques ne s'affichent pas
- Vérifier que le CSS est bien injecté
- Vérifier la console pour les erreurs
- S'assurer que les classes CSS sont appliquées

### 🐛 Images floues sur mobile
- Vérifier les media queries
- S'assurer que `object-fit: cover` est appliqué
- Augmenter le `line-height` du texte si besoin

### 🐛 Badges non visibles
- Vérifier le `backdrop-filter` support du navigateur
- Augmenter l'opacité du fond
- Tester avec `background` au lieu de `backdrop-filter`

---

**Dernière mise à jour:** Mai 2026  
**Version:** 1.0.0
