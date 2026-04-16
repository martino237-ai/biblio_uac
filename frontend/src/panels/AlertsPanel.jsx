import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import ExportButton from '../shared/ExportButton';

export default function AlertsPanel() {
  const { t } = useTranslation();
  const [stock, setStock] = useState([]);
  const [overdueLoans, setOverdueLoans] = useState([]);
  const [overdueConsults, setOverdueConsults] = useState([]);

  useEffect(() => { fetch(); }, []);

  async function fetch() {
    try {
      const [s, l, c] = await Promise.all([
        api.get('/alerts/stock'),
        api.get('/alerts/loans'),
        api.get('/alerts/consultations')
      ]);
      setStock(s.data || []);
      setOverdueLoans(l.data || []);
      setOverdueConsults(c.data || []);
    } catch (err) {
      console.error('Erreur chargement alertes', err);
      alert('Erreur chargement alertes');
    }
  }

  return (
    <>
      {/* Stock vide */}
      <div className="card bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📦 {t('Stock vide')}</h2>
          <div className="flex gap-2">
            <button onClick={fetch} className="px-3 py-1 bg-blue-100 rounded">↻</button>
            <ExportButton endpoint="/alerts/stock" filename="stock_vide.pdf" label="PDF" format="pdf" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {stock.length === 0 ? (
            <p>{t('Aucun livre en rupture')}</p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Titre</th>
                  <th className="p-3 border">Code</th>
                </tr>
              </thead>
              <tbody>
                {stock.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{b.titre}</td>
                    <td className="p-3 border">{b.code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Emprunts en retard */}
      <div className="card bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">⏰ {t('Emprunts en retard')}</h2>
          <div className="flex gap-2">
            <button onClick={fetch} className="px-3 py-1 bg-blue-100 rounded">↻</button>
            <ExportButton endpoint="/alerts/loans" filename="emprunts_retards.pdf" label="PDF" format="pdf" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {overdueLoans.length === 0 ? (
            <p>{t('Aucun emprunt en retard')}</p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Lecteur</th>
                  <th className="p-3 border">Livre</th>
                  <th className="p-3 border">Retour prévu</th>
                </tr>
              </thead>
              <tbody>
                {overdueLoans.map(l => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{l.Reader ? `${l.Reader.nom} ${l.Reader.prenom}` : l.lecteur_id}</td>
                    <td className="p-3 border">{l.Book ? l.Book.titre : l.livre_id}</td>
                    <td className="p-3 border">{l.date_retour_prevue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Consultations >2h */}
      <div className="card bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">⚠️ {t('Consultations prolongées')}</h2>
          <div className="flex gap-2">
            <button onClick={fetch} className="px-3 py-1 bg-blue-100 rounded">↻</button>
            <ExportButton endpoint="/alerts/consultations" filename="consultations_retard.pdf" label="PDF" format="pdf" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {overdueConsults.length === 0 ? (
            <p>{t('Aucune consultation dépassée')}</p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Lecteur</th>
                  <th className="p-3 border">Livre</th>
                  <th className="p-3 border">Début</th>
                </tr>
              </thead>
              <tbody>
                {overdueConsults.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="p-3 border">{c.Reader ? `${c.Reader.nom} ${c.Reader.prenom}` : c.lecteur_id}</td>
                    <td className="p-3 border">{c.Book ? c.Book.titre : '-'}</td>
                    <td className="p-3 border">{(() => { const dt=new Date(c.heure_debut); return isNaN(dt) ? new Date().toLocaleString() : dt.toLocaleString(); })()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}