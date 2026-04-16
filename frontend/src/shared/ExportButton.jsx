import React from 'react';
import api from '../api/axios';
import { generateSimplePDF } from '../utils/pdfGenerator';

export default function ExportButton({
  endpoint,
  filename = 'export.csv',
  label = 'Exporter',
  format = 'csv',
  title = 'Rapport',
  org = 'Bibliotheque UAC',
  address = '',
  columns = null
}) {
  async function doExport() {
    try {
      const res = await api.get(endpoint);
      const data = res.data || [];
      
      if (!Array.isArray(data) || data.length === 0) {
        alert('Aucune donnee a exporter');
        return;
      }

      if (format === 'csv') {
        // Export CSV classique
        const keys = Object.keys(data[0]);
        const rows = [
          keys.join(','),
          ...data.map(r => keys.map(k => {
            let v = r[k];
            if (v && typeof v === 'object') {
              try { v = JSON.stringify(v); } catch(e){ v = String(v); }
            }
            return `"${String(v ?? '').replace(/"/g,'""')}"`;
          }).join(','))
        ].join('\n');
        const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename.endsWith('.csv') ? filename : filename + '.csv';
        link.click();
      } else if (format === 'pdf') {
        // Export PDF professionnel
        generateSimplePDF(data, {
          filename,
          title,
          org,
          address,
          columns: columns || [],
          orientation: 'landscape'
        });
      } else {
        alert('Format inconnu');
      }
    } catch (err) {
      console.error('Export error', err);
      alert('Erreur lors de l\'export: ' + err.message);
    }
  }

  return (
    <button
      className="btn outline btn-enhanced"
      onClick={doExport}
      title={`Exporter au format ${format.toUpperCase()}`}
    >
      {label}
    </button>
  );
}
