import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../api/axios';
import Modal from './Modal';

/**
 * Bouton générique d'import Excel : télécharge un modèle (colonnes avec libellés
 * français) puis envoie les lignes du fichier réimporté (JSON) à `endpoint`.
 * Le backend fait l'upsert (création ou mise à jour) et renvoie
 * { created, updated, errors: [{ row, message }] }.
 *
 * columns: [{ key, label, example? }]
 */
export default function ImportExcelButton({
  endpoint,
  columns,
  templateFilename = 'modele.xlsx',
  label = '📥 Importer Excel',
  title = 'Import Excel',
  note = '',
  onImported
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');
  const fileRef = useRef(null);

  function downloadTemplate() {
    const headers = columns.map(c => c.label);
    const example = columns.map(c => c.example ?? '');
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([headers, example]), 'Modèle');
    XLSX.writeFile(wb, templateFilename);
  }

  async function handleFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setError('');
    setReport(null);
    setBusy(true);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array' });
      const sheet = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

      if (raw.length === 0) {
        setError('Le fichier ne contient aucune ligne de données.');
        return;
      }

      const labelToKey = {};
      columns.forEach(c => { labelToKey[c.label] = c.key; });

      const rows = raw.map(r => {
        const mapped = {};
        Object.entries(r).forEach(([label, value]) => {
          const key = labelToKey[label] || label;
          mapped[key] = typeof value === 'string' ? value.trim() : value;
        });
        return mapped;
      });

      const res = await api.post(endpoint, { rows });
      setReport(res.data);
      if (onImported) onImported();
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || err.message || "Erreur lors de l'import");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <>
      <button type="button" className="btn outline btn-enhanced" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <Modal title={title} onClose={() => { setOpen(false); setReport(null); setError(''); }}>
          <p style={{ marginBottom: 12 }}>
            Téléchargez le modèle, remplissez-le, puis réimportez le fichier. Les lignes déjà
            existantes seront mises à jour ; les nouvelles seront créées.
          </p>
          {note && <p style={{ fontSize: '.8rem', color: '#64748b', marginBottom: 12 }}>{note}</p>}

          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <button type="button" className="btn outline" onClick={downloadTemplate}>
              📄 Télécharger le modèle
            </button>
            <label className="btn" style={{ cursor: 'pointer' }}>
              📤 Choisir un fichier
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFile}
                disabled={busy}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {busy && <p>⏳ Import en cours...</p>}
          {error && (
            <div style={{ color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', marginBottom: 12 }}>
              ⚠️ {error}
            </div>
          )}
          {report && (
            <div>
              <p style={{ fontWeight: 600 }}>
                ✅ {report.created || 0} créé(s) · 🔄 {report.updated || 0} mis à jour · ⚠️ {(report.errors || []).length} erreur(s)
              </p>
              {report.errors && report.errors.length > 0 && (
                <ul style={{ maxHeight: 200, overflowY: 'auto', fontSize: '.8rem', color: '#dc2626', paddingLeft: 18 }}>
                  {report.errors.map((e, i) => (
                    <li key={i}>Ligne {e.row} : {e.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Modal>
      )}
    </>
  );
}
