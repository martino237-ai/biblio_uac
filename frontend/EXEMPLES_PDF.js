/**
 * 🎯 EXEMPLES D'UTILISATION - Système d'Export PDF
 * 
 * Ce fichier montre comment utiliser le nouveau système d'export PDF
 * professionnel implémenté dans pdfGenerator.js
 */

// ============================================================================
// 📌 EXEMPLE 1: Export Simple avec ExportButton
// ============================================================================

import ExportButton from '../shared/ExportButton';

function AlertsPanel() {
  return (
    <div>
      <h2>📦 Stock Vide</h2>
      
      {/* Export PDF simple avec en-tête professionnel */}
      <ExportButton 
        endpoint="/alerts/stock"
        filename="stock_vide.pdf"
        label="PDF"
        format="pdf"
        title="Rapport Stock Vide"
        org="Bibliothèque UAC"
        address="Université d'Abomey-Calavi"
      />
      
      {/* Sortie: stock_vide.pdf avec en-tête + pied de page */}
    </div>
  );
}

// ============================================================================
// 📌 EXEMPLE 2: Export Consultations (Déjà Implémenté)
// ============================================================================

import { generateSimplePDF } from '../utils/pdfGenerator';

function ConsultationsPanel() {
  const [consults, setConsults] = useState([]);

  const exportToPDF = () => {
    const data = consults.map(c => ({
      '#': c.id,
      'Lecteur': c.Reader?.nom + ' ' + c.Reader?.prenom,
      'Livre': c.Book?.titre,
      'Début': formatDate(c.heure_debut),
      'Fin': formatDate(c.heure_fin)
    }));

    generateSimplePDF(data, {
      filename: `consultations_${new Date().toISOString().split('T')[0]}.pdf`,
      title: 'Rapport Consultations',
      org: 'Bibliothèque UAC',
      address: 'Université d\'Abomey-Calavi',
      columns: ['#', 'Lecteur', 'Livre', 'Début', 'Fin'],
      orientation: 'landscape'
    });
  };

  return (
    <button onClick={exportToPDF}>
      📄 Exporter en PDF
    </button>
  );
}

// ============================================================================
// 📌 EXEMPLE 3: Export Multi-Sections (Statistiques)
// ============================================================================

import { generateStatsPDF } from '../utils/pdfGenerator';

function StatsPanel() {
  const [summary, setSummary] = useState({});
  const [topBooks, setTopBooks] = useState([]);
  const [topReaders, setTopReaders] = useState([]);

  const exportToPDF = () => {
    // Définir les sections du PDF
    const sections = [
      {
        sectionTitle: '📊 Résumé Général',
        data: [
          { 'Métrique': 'Livres total', 'Valeur': summary.books },
          { 'Métrique': 'Lecteurs total', 'Valeur': summary.readers },
          { 'Métrique': 'Emprunts', 'Valeur': summary.loans }
        ],
        columns: ['Métrique', 'Valeur'],
        sectionColor: [59, 130, 246]  // Bleu
      },
      {
        sectionTitle: '📚 Top 10 Livres',
        data: topBooks.slice(0, 10).map((b, i) => ({
          'Rang': i + 1,
          'Titre': b.titre,
          'Auteur': b.auteur,
          'Utilisations': b.total
        })),
        columns: ['Rang', 'Titre', 'Auteur', 'Utilisations'],
        sectionColor: [16, 185, 129]  // Vert
      },
      {
        sectionTitle: '👥 Top 10 Lecteurs',
        data: topReaders.slice(0, 10).map((r, i) => ({
          'Rang': i + 1,
          'Nom': r.nom,
          'Emprunts': r.total
        })),
        columns: ['Rang', 'Nom', 'Emprunts'],
        sectionColor: [245, 158, 11],  // Amber
        startNewPage: true  // Nouvelle page pour cette section
      }
    ];

    generateStatsPDF(sections, {
      filename: `stats_${new Date().toISOString().split('T')[0]}.pdf`,
      title: '📊 Statistiques Bibliothèque',
      subtitle: '2024 - Rapport Complet',
      org: 'Bibliothèque UAC',
      address: 'Université d\'Abomey-Calavi'
    });
  };

  return (
    <button onClick={exportToPDF} className="btn primary">
      📊 Exporter en PDF
    </button>
  );
}

// ============================================================================
// 📌 EXEMPLE 4: Logo Personnalisé
// ============================================================================

import { loadLogoBase64, generateSimplePDF } from '../utils/pdfGenerator';

async function ExportWithLogo() {
  const data = [
    { 'Nom': 'Jean Dupont', 'Ville': 'Cotonou' },
    { 'Nom': 'Marie Martin', 'Ville': 'Porto-Novo' }
  ];

  // Charger le logo depuis les assets publics
  const logo = await loadLogoBase64('/images/logo.png');

  generateSimplePDF(data, {
    filename: 'rapport_avec_logo.pdf',
    title: 'Rapport Personnalisé',
    org: 'Bibliothèque UAC',
    logo: logo,  // ← Logo maintenant visible
    columns: ['Nom', 'Ville']
  });
}

// ============================================================================
// 📌 EXEMPLE 5: Personnaliser les Couleurs
// ============================================================================

import { addPDFHeader, addPDFFooter } from '../utils/pdfGenerator';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function CustomColoredPDF() {
  const exportWithCustomColors = () => {
    const doc = new jsPDF();
    
    // En-tête avec couleur personnalisée (rouge)
    addPDFHeader(doc, {
      title: 'Rapport d\'Alerte',
      org: 'Bibliothèque UAC',
      color: [220, 38, 38]  // Rouge personnalisé
    });

    // Contenu
    const data = [
      ['Alerte', 'Nombre'],
      ['Stock vide', 12],
      ['Emprunts retards', 8],
      ['Consultations >2h', 5]
    ];

    autoTable(doc, {
      startY: 40,
      head: [data[0]],
      body: data.slice(1),
      headStyles: { fillColor: [220, 38, 38] }  // Couleur personnalisée
    });

    // Pied de page avec couleur personnalisée
    addPDFFooter(doc, { color: [220, 38, 38] });

    doc.save('rapport_alerte.pdf');
  };

  return (
    <button onClick={exportWithCustomColors}>
      🚨 Exporter Rapports d'Alerte
    </button>
  );
}

// ============================================================================
// 📌 EXEMPLE 6: Combiner Données de Plusieurs Endpoints
// ============================================================================

import api from '../api/axios';

async function ExportCombined() {
  // Récupérer les données
  const response1 = await api.get('/stats/summary');
  const response2 = await api.get('/stats/top-books');
  const response3 = await api.get('/consultations');

  const sections = [
    {
      sectionTitle: '📊 Résumé',
      data: [
        { 'Métrique': 'Livres', 'Valeur': response1.data.books },
        { 'Métrique': 'Lecteurs', 'Valeur': response1.data.readers }
      ]
    },
    {
      sectionTitle: '📚 Top Livres',
      data: response2.data.topBooks.slice(0, 10)
    },
    {
      sectionTitle: '💻 Consultations Récentes',
      data: response3.data.slice(0, 20)
    }
  ];

  generateStatsPDF(sections, {
    filename: 'rapport_complet.pdf',
    title: 'Rapport Complet',
    org: 'Bibliothèque UAC'
  });
}

// ============================================================================
// 📌 EXEMPLE 7: Exports Automatiques Programmés
// ============================================================================

// Dans un cron job ou scheduling service
async function generateDailyReport() {
  const stats = await api.get('/stats/summary');
  const topBooks = await api.get('/stats/top-books');

  const sections = [
    {
      sectionTitle: '📊 Résumé du Jour',
      data: [
        { 'Métrique': 'Emprunts du jour', 'Valeur': stats.data.loans_today },
        { 'Métrique': 'Consultations du jour', 'Valeur': stats.data.consultations_today }
      ]
    },
    {
      sectionTitle: '📚 Top Livres Empruntés Aujourd\'hui',
      data: topBooks.data.topBooks.slice(0, 10)
    }
  ];

  generateStatsPDF(sections, {
    filename: `rapport_journal_${new Date().toISOString().split('T')[0]}.pdf`,
    title: '📋 Rapport Journal',
    subtitle: new Date().toLocaleDateString('fr-FR'),
    org: 'Bibliothèque UAC'
  });

  // Envoyer par email, archiver, etc.
}

// ============================================================================
// 📌 EXEMPLE 8: Erreur Handling
// ============================================================================

async function SafeExport(data) {
  try {
    // Vérifier les données
    if (!data || data.length === 0) {
      alert('Aucune donnée à exporter');
      return;
    }

    // Générer le PDF
    const success = generateSimplePDF(data, {
      filename: 'rapport.pdf',
      title: 'Mon Rapport'
    });

    if (success) {
      console.log('✅ PDF généré avec succès');
      // Optionnel: Envoyer à serveur
      // await api.post('/logs/export', { filename, date: new Date() });
    }
  } catch (error) {
    console.error('❌ Erreur export PDF:', error);
    alert('Erreur lors de la génération du PDF: ' + error.message);
  }
}

// ============================================================================
// 📌 EXEMPLE 9: Configuration Réutilisable
// ============================================================================

import { PDF_CONFIG } from '../utils/pdfGenerator';

// Utiliser la configuration globale
function useStandardColors() {
  return {
    primaryColor: PDF_CONFIG.primaryColor,      // [59, 130, 246]
    secondaryColor: PDF_CONFIG.secondaryColor,  // [16, 185, 129]
    margins: PDF_CONFIG.margins,                // { top: 25, ... }
    textDark: PDF_CONFIG.textDark,             // 33
  };
}

// ============================================================================
// 📌 EXEMPLE 10: Bouton Export avec State Loading
// ============================================================================

function ExportButtonWithLoading() {
  const [exporting, setExporting] = useState(false);
  const [data, setData] = useState([]);

  const handleExport = async () => {
    setExporting(true);
    try {
      generateSimplePDF(data, {
        filename: 'report.pdf',
        title: 'Mon Rapport'
      });
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button 
      onClick={handleExport} 
      disabled={exporting}
      className={exporting ? 'btn loading' : 'btn primary'}
    >
      {exporting ? '⏳ Génération...' : '📄 Exporter PDF'}
    </button>
  );
}

// ============================================================================
// 🎯 RÉSUMÉ DES UTILISATIONS
// ============================================================================

/*
EXPORT SIMPLE (1 tableau):
├── generateSimplePDF(data, options)
└── Utiliser pour: Alertes, Consultations, Emprunts simples

EXPORT MULTI-SECTIONS:
├── generateStatsPDF(sections, options)
└── Utiliser pour: Statistiques, Rapports complets

EN-TÊTE PROFESSIONNEL:
├── addPDFHeader(doc, options)
└── Configurer: Logo, organisation, titre, couleur

PIED DE PAGE:
├── addPDFFooter(doc, options)
└── Ajouter: Date d'export, numérotation pages

CHARGER LOGO:
├── loadLogoBase64(imagePath)
└── Convertir image PNG/JPG en Base64

CONFIGURATION GLOBALE:
├── PDF_CONFIG
└── Modifier pour personnaliser couleurs/marges
*/

export default {
  AlertsPanel,
  ConsultationsPanel,
  StatsPanel,
  ExportWithLogo,
  CustomColoredPDF,
  ExportCombined,
  generateDailyReport,
  SafeExport,
  ExportButtonWithLoading
};
