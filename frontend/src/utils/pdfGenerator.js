import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Nettoie un texte pour PDF - enlève les emojis et normalise les accents
 * @param {string} text - Texte à nettoyer
 * @returns {string} Texte nettoyé
 */
function cleanTextForPDF(text) {
  if (!text) return '';
  
  // Enlever emojis
  let cleaned = text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '');
  
  // Map d'accents français pour éviter les problèmes UTF-8
  const accentMap = {
    'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
    'á': 'a', 'à': 'a', 'â': 'a', 'ä': 'a',
    'ó': 'o', 'ò': 'o', 'ô': 'o', 'ö': 'o',
    'ú': 'u', 'ù': 'u', 'û': 'u', 'ü': 'u',
    'í': 'i', 'ì': 'i', 'î': 'i', 'ï': 'i',
    'ç': 'c', 'Ç': 'C',
    'ñ': 'n', 'Ñ': 'N'
  };
  
  // Remplacer les accents
  cleaned = cleaned.split('').map(char => accentMap[char] || char).join('');
  
  return cleaned.trim();
}

/**
 * Configuration globale pour les PDFs
 */
const PDF_CONFIG = {
  primaryColor: [59, 130, 246], // Bleu
  secondaryColor: [16, 185, 129], // Vert
  accentColor: [245, 158, 11], // Amber
  warningColor: [236, 72, 100], // Rose
  textDark: 33,
  textLight: 255,
  pageFormat: 'A4',
  margins: { top: 25, right: 14, bottom: 25, left: 14 },
  headerHeight: 40,
  footerHeight: 15
};

/**
 * Ajoute un en-tête professionnel au PDF
 * @param {jsPDF} doc - Document jsPDF
 * @param {Object} options - Options personnalisées
 */
export function addPDFHeader(doc, options = {}) {
  const {
    title = 'Rapport',
    subtitle = '',
    logo = null,
    org = 'Bibliotheque UAC',
    address = '',
    color = PDF_CONFIG.primaryColor
  } = options;

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = PDF_CONFIG.margins.left;

  let yPos = 8;

  // Ligne de séparation supérieure
  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 3;

  // Logo (si fourni) - à gauche
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', margin, yPos, 15, 15);
    } catch (e) {
      console.warn('Impossible d\'ajouter le logo:', e);
    }
  }

  // Texte centré
  const centerX = pageWidth / 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(33); // Noir
  if (title) {
    doc.text(cleanTextForPDF(title), centerX, yPos + 8, { align: 'center' });
    yPos += 8;
  }

  if (subtitle) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(100); // Gris
    doc.text(cleanTextForPDF(subtitle), centerX, yPos + 12, { align: 'center' });
    yPos += 6;
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100); // Gris
  doc.text(cleanTextForPDF(org), centerX, yPos + 10, { align: 'center' });

  if (address) {
    doc.text(cleanTextForPDF(address), centerX, yPos + 16, { align: 'center' });
  }

  // Ligne de séparation
  yPos += 15;
  doc.setDrawColor(150, 150, 150); // Gris
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, pageWidth - margin, yPos);

  return yPos + 10;
}

/**
 * Ajoute un pied de page avec numérotation
 * @param {jsPDF} doc - Document jsPDF
 * @param {Object} options - Options personnalisées
 */
export function addPDFFooter(doc, options = {}) {
  const {
    color = PDF_CONFIG.primaryColor,
    showDate = true,
    dateFormat = 'fr-FR'
  } = options;

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = PDF_CONFIG.margins.left;
  const pages = doc.internal.pages.length - 1;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100);

  // Ligne de séparation
  doc.setDrawColor(...color);
  doc.setLineWidth(0.5);
  doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);

  if (showDate) {
    const date = new Date().toLocaleDateString(dateFormat, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Généré le: ${date}`, margin, pageHeight - 7);
  }

  // Numérotation des pages
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(
      `Page ${i} / ${pages}`,
      pageWidth - margin,
      pageHeight - 7,
      { align: 'right' }
    );
  }
}

/**
 * Génère un PDF avec titre et tableau
 * @param {Array} data - Données du tableau
 * @param {Object} options - Configuration
 */
export function generateSimplePDF(data, options = {}) {
  const {
    filename = 'export.pdf',
    title = 'Rapport',
    subtitle = '',
    org = 'Bibliotheque UAC',
    address = '',
    columns = [],
    logo = null,
    orientation = 'landscape',
    color = PDF_CONFIG.primaryColor,
    isEmpty = false
  } = options;

  if (isEmpty || !data || data.length === 0) {
    alert('Aucune donnee a exporter');
    return;
  }

  try {
    const doc = new jsPDF({ orientation, format: 'a4' });
    const margin = PDF_CONFIG.margins.left;

    // En-tête
    let startY = addPDFHeader(doc, { title, subtitle, logo, org, address, color });
    startY += 5;

    // Déterminer les colonnes
    let cols = columns;
    if (!cols || cols.length === 0) {
      cols = data.length > 0 ? Object.keys(data[0]) : [];
    }

    // Format des données
    const bodyRows = data.map(row =>
      cols.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') {
          try {
            return cleanTextForPDF(JSON.stringify(val).substring(0, 50));
          } catch {
            return cleanTextForPDF(String(val).substring(0, 50));
          }
        }
        return cleanTextForPDF(String(val).substring(0, 100));
      })
    );

    // Tableau
    autoTable(doc, {
      startY,
      margin: { left: margin, right: margin },
      head: [cols.map(c => cleanTextForPDF(c))],
      body: bodyRows,
      styles: {
        fontSize: 9,
        cellPadding: 4,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: color,
        textColor: PDF_CONFIG.textLight,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: PDF_CONFIG.textDark,
        rowPageBreak: 'avoid'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      theme: 'grid',
      didDrawPage: (data) => {
        // Ajouter les pieds de page à chaque page
        doc.setDrawColor(200);
        doc.setLineWidth(0.3);
      }
    });

    // Pied de page
    addPDFFooter(doc, { color });

    // Télécharger
    doc.save(filename.endsWith('.pdf') ? filename : filename + '.pdf');
    return true;
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    alert('Erreur lors de la génération du PDF');
    return false;
  }
}

/**
 * Génère un PDF statistiques complet (multi-sections)
 */
export function generateStatsPDF(sections, options = {}) {
  console.log('🟢 DEBUG: generateStatsPDF called with', sections.length, 'sections');
  
  const {
    filename = 'stats.pdf',
    title = 'Statistiques',
    subtitle = '',
    org = 'Bibliothèque UAC',
    address = '',
    logo = null,
    color = [59, 130, 246] // Bleu foncé unique
  } = options;

  try {
    console.log('🟢 DEBUG: Creating PDF document');
    const doc = new jsPDF({ orientation: 'landscape', format: 'a4' });
    const margin = PDF_CONFIG.margins.left;

    // En-tête (première page)
    console.log('🟢 DEBUG: Adding header');
    let startY = addPDFHeader(doc, { title, subtitle, logo, org, address, color });
    startY += 5;

    // Couleur unique pour tous les titres de section
    const sectionTitleColor = [59, 130, 246]; // Bleu foncé

    // Traiter chaque section
    sections.forEach((section, sectionIdx) => {
      console.log(`🟢 DEBUG: Processing section ${sectionIdx + 1}/${sections.length}: ${section.sectionTitle}`);
      
      const {
        sectionTitle = '',
        data = [],
        columns = []
      } = section;

      // Nouvelle page pour chaque section (sauf la première)
      if (sectionIdx > 0) {
        doc.addPage();
        startY = addPDFHeader(doc, { title, subtitle, logo, org, address, color });
        startY += 5;
      }

      // Espace avant le titre de section
      startY += 10;

      // Titre de section
      if (sectionTitle) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(...sectionTitleColor);
        doc.text(cleanTextForPDF(sectionTitle), margin, startY);
        startY += 8;
      }

      if (!data || data.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Aucune donnée disponible', margin, startY);
        startY += 10;
        return;
      }

      // Tableau amélioré
      const cols = columns.length > 0 ? columns : Object.keys(data[0]);
      const bodyRows = data.map(row =>
        cols.map(col => {
          const val = row[col];
          if (val === null || val === undefined) return '';
          if (typeof val === 'object') {
            try {
              return cleanTextForPDF(JSON.stringify(val).substring(0, 50));
            } catch {
              return cleanTextForPDF(String(val).substring(0, 50));
            }
          }
          return cleanTextForPDF(String(val).substring(0, 100));
        })
      );

      autoTable(doc, {
        startY,
        margin: { left: margin, right: margin },
        head: [cols.map(c => cleanTextForPDF(c))],
        body: bodyRows,
        pageBreak: 'avoid',
        styles: {
          fontSize: 10, // Augmenté pour lisibilité
          cellPadding: 4, // Plus d'espace
          overflow: 'linebreak',
          lineWidth: 0.1, // Bordures fines
          lineColor: [200, 200, 200] // Gris léger
        },
        headStyles: {
          fillColor: [240, 240, 240], // Gris très léger
          textColor: 33, // Noir
          fontStyle: 'bold',
          halign: 'center',
          valign: 'middle'
        },
        bodyStyles: {
          textColor: 33, // Noir
          valign: 'middle'
        },
        alternateRowStyles: {
          fillColor: [250, 250, 250] // Gris très très léger
        },
        theme: 'grid'
      });

      // Mettre à jour startY après le tableau avec espace supplémentaire
      startY = (doc.previousAutoTable && doc.previousAutoTable.finalY) ? doc.previousAutoTable.finalY + 15 : startY + 40;
    });

    // Pied de page
    console.log('🟢 DEBUG: Adding footer');
    addPDFFooter(doc, { color });

    console.log('🟢 DEBUG: Saving PDF file:', filename);
    doc.save(filename.endsWith('.pdf') ? filename : filename + '.pdf');
    console.log('✅ PDF generated successfully!');
    return true;
  } catch (error) {
    console.error('❌ Erreur génération PDF statistiques:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    alert('Erreur lors de la génération du PDF:\n' + error.message);
    return false;
  }
}

/**
 * Export en PDF avec logo base64 (utility pour charger depuis assets)
 */
export async function loadLogoBase64(imagePath) {
  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn('Impossible de charger le logo:', error);
    return null;
  }
}

const pdfGenerator = {
  PDF_CONFIG,
  addPDFHeader,
  addPDFFooter,
  generateSimplePDF,
  generateStatsPDF,
  loadLogoBase64,
  cleanTextForPDF
};

export default pdfGenerator;
