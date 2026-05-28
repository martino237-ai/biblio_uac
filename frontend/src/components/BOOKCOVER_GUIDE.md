# 📖 Utilisation du Composant BookCover Réutilisable

## Vue d'ensemble

Nous avons créé un composant réutilisable `BookCover` qui affiche des images génériques professionnelles pour les livres. Ce composant est maintenant utilisé dans:
- ✅ Reader.jsx (Espace lecteur)
- ✅ BookDetailsPanel.jsx (Détails des livres)
- ✅ Peut être utilisé ailleurs dans l'application

## 📁 Architecture des Fichiers

```
frontend/src/
├── components/
│   └── BookCover.jsx          ← Nouveau composant réutilisable
├── pages/
│   └── Reader.jsx             ← Utilisé pour les cartes de livres
├── panels/
│   └── BookDetailsPanel.jsx   ← À mettre à jour pour utiliser le composant
```

## 🎯 Utilisation du Composant

### Import
```jsx
import { GenericBookCover, OnlineBookCover } from '../components/BookCover';
```

### Couverture Générique (Livres locaux)
```jsx
<GenericBookCover 
  book={book}           // Objet livre
  index={0}            // Index pour la couleur
  size="normal"        // 'small' | 'normal' | 'large'
  showSpine={true}     // Affiche l'épine du livre
  showCode={true}      // Affiche le code du livre
/>
```

### Couverture en Ligne (OpenLibrary)
```jsx
<OnlineBookCover 
  book={book}          // Objet livre
  size="normal"        // 'small' | 'normal' | 'large'
/>
```

### Couverture Automatique (Sélection)
```jsx
import { BookCover } from '../components/BookCover';

<BookCover 
  book={book}
  index={idx}
  size="normal"
  isOnline={false}     // true pour OpenLibrary, false pour génériques
/>
```

## 🎨 Caractéristiques

### Tailles Disponibles

| Taille | Hauteur | Icône | Titre | Usage |
|--------|---------|-------|-------|-------|
| small | 120px | 2rem | 0.6rem | Listings compacts |
| normal | 170px | 3.5rem | 0.82rem | Grille par défaut |
| large | 230px | 4rem | 1rem | Détails/Modals |

### Couleurs Dégradées

Le composant utilise 6 dégradés de couleurs automatiquement basé sur l'index:

```
Index 0 → Bleu (Informatique)
Index 1 → Vert (Sciences)
Index 2 → Orange (Histoire)
Index 3 → Rose (Littérature)
Index 4 → Violet (Philosophie)
Index 5 → Rouge (Droit)
```

Les couleurs se répètent cycliquement: `index % 6`

### Badges Intelligents

**Couverture Générique:**
- ✅ Badge de disponibilité (Vert/Rouge)
- ✅ Nombre d'exemplaires
- ✅ Code du livre

**Couverture en Ligne:**
- 🎁 Badge "Gratuit" (Bleu)
- Placeholder si image manquante

## 📝 Structure des Données

### Livre Local
```js
{
  id: 1,
  titre: "Introduction à l'Informatique",
  auteur: "Jean Dupont",
  code: "INF-001",
  genre: "Informatique",
  annee_publication: 2020,
  emplacement: "Rayon A1",
  exemplaires_disponibles: 3,
  total_exemplaires: 5
}
```

### Livre OpenLibrary
```js
{
  key: "/works/OL1W",
  title: "Harry Potter",
  author_name: ["J. K. Rowling"],
  cover_i: 5445735,
  first_publish_year: 1997,
  subject: ["Fiction", "Magic"],
  number_of_pages_median: 309,
  ratings_average: 4.5
}
```

## 🔄 Migration depuis Ancien Code

### Avant (Inline CSS)
```jsx
function LocalCover({ book, idx }) {
  const cls = coverColor(idx);
  return (
    <div className={`bk-cover-local ${cls}`}>
      {/* Ancien HTML */}
    </div>
  );
}
```

### Après (Composant Réutilisable)
```jsx
<GenericBookCover book={book} index={idx} />
```

## 🎯 Avantages

✅ **Réutilisabilité:** Utilisable partout dans l'app
✅ **Maintenabilité:** Code centralisé, facile à modifier
✅ **Performance:** Styles inline (pas de CSS global)
✅ **Flexibilité:** Tailles et options configurables
✅ **Accessibilité:** Contrastes et textes clairs
✅ **Responsive:** S'adapte aux écrans

## 📚 Exemples d'Utilisation

### Exemple 1: Grille de Livres
```jsx
{books.map((book, idx) => (
  <div key={book.id} className="book-card">
    <GenericBookCover book={book} index={idx} />
    <h3>{book.titre}</h3>
    <p>{book.auteur}</p>
  </div>
))}
```

### Exemple 2: Détail Livre
```jsx
<div className="book-details">
  <GenericBookCover book={book} size="large" />
  <div className="info">
    <h1>{book.titre}</h1>
    <p>{book.description}</p>
  </div>
</div>
```

### Exemple 3: Mini Vue
```jsx
<GenericBookCover book={book} size="small" showCode={false} />
```

## 🐛 Dépannage

### L'image ne s'affiche pas
→ Vérifier que `book.titre` ou `book.title` existe
→ Vérifier le prop `index`

### Couleur non souhaitée
→ Utiliser un `index` différent
→ Ou modifier les couleurs dans BookCover.jsx

### Badge non visible
→ Vérifier que `book.exemplaires_disponibles` est défini
→ Ajouter le prop `showBadge={true}`

## 🚀 Prochaines Étapes

1. **Mettre à jour BookDetailsPanel.jsx** pour utiliser `GenericBookCover` à la place du CSS inline
2. **Ajouter des options** (thème personnalisé, badges custom)
3. **Créer des stories** pour Storybook
4. **Ajouter des animations** (hover, chargement)
5. **Supporter les images externes** (URLs personnalisées)

## 📞 Support

Pour toute question ou modification:
- Voir le code: `frontend/src/components/BookCover.jsx`
- Voir l'usage: `frontend/src/pages/Reader.jsx`
- Voir les détails: `frontend/src/panels/BookDetailsPanel.jsx`

---

**Version:** 1.0.0  
**Date:** Mai 2026  
**Auteur:** Composant BookCover réutilisable
