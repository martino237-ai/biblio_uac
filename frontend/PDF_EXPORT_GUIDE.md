# 📄 Guide Amélioration du Système d'Export PDF

## ✅ Améliorations Réalisées

### 1. **Utilitaire PDF Professionnel** 
Fichier: `frontend/src/utils/pdfGenerator.js`

Fonctionnalités:
- ✅ **En-tête professionnel** avec logo, organisation et adresse
- ✅ **Pied de page** avec date d'export et numérotation des pages
- ✅ **Design cohérent** avec couleurs normalisées (bleu primaire, vert secondaire, etc.)
- ✅ **Mise en page structurée** avec marges équilibrées (25mm)
- ✅ **Support de multiples sections** avec pagination automatique

### 2. **Composant Réutilisable `ExportButton`**
Fichier: `frontend/src/shared/ExportButton.jsx`

Améliorations:
- ✅ Intégration du nouveau système PDF professionnel
- ✅ Support du titre et de l'organisation personnalisée
- ✅ Gestion des erreurs améliorée
- ✅ Messages utilisateur clairs

### 3. **Statistiques - PDF Complet**
Fichier: `frontend/src/panels/StatsPanel.jsx`

Enhancements:
- ✅ En-tête professionnel avec logo de l'établissement
- ✅ Sous-titre avec période de filtrage
- ✅ Numérotation des pages automatique
- ✅ Sections colorées (6-8 tableaux)
- ✅ Gestion des ruptures de page intelligente
- ✅ Date d'export visible

### 4. **Consultations - PDF Amélioré**
Fichier: `frontend/src/panels/ConsultationsPanel.jsx`

Améliorations:
- ✅ En-tête professionnel
- ✅ Dates formatées correctement
- ✅ Design cohérent
- ✅ Pied de page avec date et numérotation

### 5. **Emprunts - PDF Amélioré**  
Fichier: `frontend/src/panels/LoansPanel.jsx`

Améliorations:
- ✅ En-tête professionnel
- ✅ Statut d'emprunt visible
- ✅ Design cohérent avec le resto du système

---

## 🎨 Caractéristiques Techniques

### Configuration PDF
```javascript
// Marges
top: 25px, right: 14px, bottom: 25px, left: 14px

// Couleurs Standard
- Primaire: Bleu [59, 130, 246]
- Secondaire: Vert [16, 185, 129]
- Accent: Amber [245, 158, 11]
- Alerte: Rose [236, 72, 100]

// Format/Orientation
- Format: A4 (standard)
- Portrait/Paysage: Configurable
- Police: Helvetica (standard)

// Éléments Automatiques
- En-tête professionnel ✓
- Pied de page avec date ✓
- Numérotation Page N/Total ✓
- Alternance couleur lignes ✓
```

---

## 🚀 Comment Utiliser

### Exporter les Statistiques
```javascript
// Clic sur bouton "PDF" → StatsPanel génère PDF avec:
// - En-tête professionnel
// - 8 sections (Résumé, Top Livres, Top Lecteurs, etc.)
// - Pagination automatique
// - Pied de page
```

### Exporter Consultations/Emprunts
```javascript
// Clic bouton "📄 Exporter en PDF" → Document professionnel avec:
// - En-tête (Organisation + Logo)
// - Tableau filtrées avec dates
// - Pied de page avec date d'export
```

### Utiliser le Composant ExportButton
```jsx
<ExportButton 
  endpoint="/alerts/stock"
  filename="stock_vide.pdf"
  label="PDF"
  format="pdf"
  title="Rapport Stock Vide"
  org="Bibliothèque UAC"
/>
```

### Créer un Export Personnalisé
```javascript
import { generateSimplePDF, generateStatsPDF } from '../utils/pdfGenerator';

// Export simple
generateSimplePDF(data, {
  filename: 'mon_rapport.pdf',
  title: 'Mon Rapport',
  org: 'Bibliothèque',
  columns: ['Col1', 'Col2', 'Col3'],
  orientation: 'landscape'
});

// Export multi-sections
generateStatsPDF(sections, {
  filename: 'stats.pdf',
  title: 'Statistiques',
  org: 'Bibliothèque UAC'
});
```

---

## 📝 Configuration du Logo

### Ajouter un Logo (Base64)
```javascript
import { generateSimplePDF } from '../utils/pdfGenerator';

// 1. Charger l'image en Base64
const logoBase64 = await fetch('/images/logo.png')
  .then(r => r.blob())
  .then(blob => new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  }));

// 2. Passer au générateur
generateSimplePDF(data, {
  filename: 'export.pdf',
  logo: logoBase64  // ← Ajouter le logo
});
```

### Ajouter le Fichier Logo
1. Placer l'image dans: `frontend/public/images/logo.png` (PNG ou JPG)
2. Importer et charger en Base64
3. Passer à la fonction de génération

---

## ✨ Personnalisation

### Changer les Couleurs
Modifier `PDF_CONFIG` dans `pdfGenerator.js`:
```javascript
const PDF_CONFIG = {
  primaryColor: [59, 130, 246],    // Bleu → À modifier
  secondaryColor: [16, 185, 129],  // Vert → À modifier
  // ...
};
```

### Personnaliser l'En-tête
Passer des options à `addPDFHeader()`:
```javascript
addPDFHeader(doc, {
  title: 'Mon Titre',
  subtitle: 'Sous-titre personnalisé',
  org: 'Mon Organisation',
  address: 'Mon Adresse',
  color: [255, 0, 0],  // Couleur personnalisée
  logo: base64Image
});
```

---

## 🖨️ Impression et Qualité

### Recommandations
- **Format**: A4 (210 x 297mm)
- **Marges**: Minimales 15mm
- **Résolution**: 96DPI (écran) / 300DPI (impression)
- **Police**: Helvetica (standard)
- **Couleurs**: Mode couleur / Noir & Blanc (tous deux supportés)

### Vérification
1. Génération du PDF ✓
2. Ouverture dans lecteur PDF (Adobe, Navigateur)
3. Vérifier:
   - ✅ En-tête visible et bien placé
   - ✅ Données complètes (aucune coupure)
   - ✅ Tableaux bien alignés
   - ✅ Pied de page avec date
   - ✅ Numérotation correcte
   - ✅ Impression: marges correctes, texte lisible

---

## 🔧 Architecture

### Structure des Fichiers
```
frontend/
├── src/
│   ├── utils/
│   │   └── pdfGenerator.js          ← Utilitaire principal
│   ├── shared/
│   │   └── ExportButton.jsx         ← Composant réutilisable
│   └── panels/
│       ├── StatsPanel.jsx           ← Statistiques (multi-sections)
│       ├── ConsultationsPanel.jsx   ← Consultations
│       └── LoansPanel.jsx           ← Emprunts
```

### Fonctions Principales
- `generateSimplePDF()` - PDF simple (1 tableau)
- `generateStatsPDF()` - PDF multi-sections (statistiques)
- `addPDFHeader()` - En-tête professionnel
- `addPDFFooter()` - Pied de page
- `loadLogoBase64()` - Charger logo depuis assets

---

## 🧪 Tests à Effectuer

### Tests PDF
- [ ] Export Statistiques - Vérifier toutes les sections
- [ ] Export Consultations - Vérifier dates formatées
- [ ] Export Emprunts - Vérifier statut visible
- [ ] Export Alertes (Stock) - Via ExportButton
- [ ] Format paysage - Tableaux à droite/gauche
- [ ] Pagination - Rupture logique entre sections
- [ ] En-tête - Logo visible, texte lisible
- [ ] Pied de page - Date, numéro page visible

### Tests Impression
- [ ] Imprimer en A4
- [ ] Vérifier marges
- [ ] Vérifier qualité texte/tableaux
- [ ] Mode couleur / N&B

### Tests Compatibilité
- [ ] Adobe Reader ✓
- [ ] Navigateur Chrome ✓
- [ ] Navigateur Firefox ✓
- [ ] Visualiseur PDF Windows
- [ ] Mobile (aperçu)

---

## 📞 Support

### Problèmes Courants

**Q: Logo ne s'affiche pas**  
R: Vérifier chemin du fichier, convertir en Base64

**Q: Données coupées**  
R: Vérifier orientation (paysage), augmenter marges

**Q: Pages blanches**  
R: Réduire taille police (fontSize: 8-10), sections plus petites

**Q: Mauvaise numérotation**  
R: Vérifier que `addPDFFooter()` est appelé après tout contenu

---

## 📌 Prochaines Étapes (Optionnelles)

1. Ajouter graphiques (charts) en tant qu'images dans PDF
2. Signature numérique
3. Code QR avec lien au rapport
4. Exportation Word/Excel avancée
5. Templates PDF personnalisés

---

**Version**: 1.0  
**Dernière mise à jour**: 23 Mars 2026  
**Licence**: UAC
