import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Modal from '../shared/Modal';
import { generateSimplePDF } from '../utils/pdfGenerator';

export default function ConsultationsPanel({ query = '', onChange }) {
  const { t } = useTranslation();
  const [consults, setConsults] = useState([]);
  const [readers, setReaders] = useState([]);
  const [books, setBooks] = useState([]);
  const [modal, setModal] = useState(false);
  const [detailsConsult, setDetailsConsult] = useState(null);
  const [form, setForm] = useState({ lecteur_id: '', livre_id: '' });
  const [readerQuery, setReaderQuery] = useState('');
  const [bookQuery, setBookQuery] = useState('');
  const [itemType, setItemType] = useState('livre');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchAll = useCallback(async () => {
    try {
      const params = {};
      if (query) params.q = query;
      // only include period if both dates look like YYYY-MM-DD
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (startDate && endDate && dateRegex.test(startDate) && dateRegex.test(endDate)) {
        // ensure range is not inverted; backend will handle swap but we warn user
        if (startDate > endDate) {
          console.warn('start date is after end date, swapping locally');
          params.start = endDate;
          params.end = startDate;
        } else {
          params.start = startDate;
          params.end = endDate;
        }
      } else if ((startDate && !dateRegex.test(startDate)) || (endDate && !dateRegex.test(endDate))) {
        console.warn('skipping invalid date params', startDate, endDate);
      }
      const res = await api.get('/consultations', { params });
      setConsults(res.data || []);
    } catch (err) {
      console.error('fetchAll consultations failed', err);
      const msg = err?.response?.data?.error || err.message || 'Erreur chargement consultations';
      alert(msg);
    }
  }, [query, startDate, endDate]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // Recherche dynamique lecteurs
  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (!readerQuery) return setReaders([]);
      try {
        const res = await api.get('/readers/search', { params: { q: readerQuery } });
        setReaders(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [readerQuery]);

  // Recherche dynamique livres / périodiques
  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (!bookQuery) return setBooks([]);
      try {
        const res = await api.get('/books/search', { params: { q: bookQuery, type: itemType } });
        setBooks(res.data || []);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [bookQuery, itemType]);

  async function create(e) {
    e.preventDefault();
    try {
      await api.post('/consultations', form);
      setModal(false);
      fetchAll();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert('Erreur création consultation: ' + (err?.response?.data?.error || err.message));
    }
  }

  async function endConsultation(id) {
    try {
      await api.post(`/consultations/${id}/end`);
      fetchAll();
    } catch (err) {
      console.error(err);
      alert('Erreur');
    }
  }


  const exportToPDF = () => {
    if(consults.length === 0) {
      alert('Aucune consultation a exporter');
      return;
    }
    // Transformer les données
    const data = consults.map(c => ({
      '#': c.id,
      'Lecteur': c.Reader ? `${c.Reader.nom} ${c.Reader.prenom}` : c.lecteur_id,
      'Faculté': c.Reader?.faculte || '-',
      'Filière': c.Reader?.filiere || '-',
      'Livre': c.Book ? c.Book.titre : '-',
      'Debut': c.heure_debut ? new Date(c.heure_debut).toLocaleString('fr-FR') : '-',
      'Fin': c.heure_fin ? new Date(c.heure_fin).toLocaleString('fr-FR') : '-'
    }));

    const title = startDate && endDate 
      ? `Consultations du ${startDate} au ${endDate}`
      : 'Consultations';

    const filename = `consultations_${startDate||'tous'}_${endDate||'tous'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    generateSimplePDF(data, {
      filename,
      title,
      org: 'Bibliotheque UAC',
      address: 'Universite Adventiste Cosendai',
      columns: ['#', 'Lecteur', 'Faculté', 'Filière', 'Livre', 'Debut', 'Fin'],
      orientation: 'landscape'
    });
  };

  return (
    <>
      {/* Header */}
      <div className="panel-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">💻 {t('Consultations')}</h2>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm">{t('Début')}:</label>
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="border px-2 py-1 rounded" />
          <label className="text-sm">{t('Fin')}:</label>
          <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="border px-2 py-1 rounded" />
          <button
            className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition"
            onClick={exportToPDF}
          >📄 {t('Exporter en PDF')}
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => {
              setForm({ lecteur_id: '', livre_id: '' });
              setReaderQuery('');
              setBookQuery('');
              setItemType('livre');
              setBooks([]);
              setModal(true);
            }}
          >
            + Nouvelle consultation
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="card bg-white rounded-lg shadow-lg p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Lecteur</th>
                <th className="p-3 border">Faculté</th>
                <th className="p-3 border">Filière</th>
                <th className="p-3 border">Livre</th>
                <th className="p-3 border">Début</th>
                <th className="p-3 border">Fin</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {consults.map(c => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setDetailsConsult(c)}
                >
                  <td className="p-3 border">
                    {c.Reader ? `${c.Reader.nom} ${c.Reader.prenom}` : c.lecteur_id}
                  </td>
                  <td className="p-3 border">{c.Reader?.faculte || '-'}</td>
                  <td className="p-3 border">{c.Reader?.filiere || '-'}</td>
                  <td className="p-3 border">{c.Book ? c.Book.titre : '-'}</td>
                  <td className="p-3 border">{(() => { const dt=new Date(c.heure_debut); return isNaN(dt) ? new Date().toLocaleString() : dt.toLocaleString(); })()}</td>
                  <td className="p-3 border">{c.heure_fin ? (() => { const dt=new Date(c.heure_fin); return isNaN(dt) ? new Date().toLocaleString() : dt.toLocaleString(); })() : '-'}</td>
                  <td className="p-3 border">
                    {!c.heure_fin ? (
                      <button
                        className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        onClick={e => { e.stopPropagation(); endConsultation(c.id); }}
                      >
                        Terminer
                      </button>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Formulaire */}
      {modal && (
        <Modal title="Nouvelle consultation" onClose={() => setModal(false)}>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4" onSubmit={create}>
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">Lecteur</label>
              <input
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 mb-2"
                placeholder="Rechercher par nom, prénom ou matricule"
                value={readerQuery}
                onChange={e => setReaderQuery(e.target.value)}
              />
              <select
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                value={form.lecteur_id}
                onChange={e => setForm({ ...form, lecteur_id: e.target.value })}
                required
              >
                <option value="">-- choisir --</option>
                {readers.map(r => (
                  <option key={r.id} value={r.id}>{r.nom} {r.prenom} ({r.matricule || '-'})</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 gap-4">
              <div>
                <label className="block font-semibold mb-1">Type de document</label>
                <select
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={itemType}
                  onChange={e => {
                    setItemType(e.target.value);
                    setBookQuery('');
                    setBooks([]);
                    setForm({ ...form, livre_id: '' });
                  }}
                >
                  <option value="livre">Ouvrage</option>
                  <option value="périodique">Périodique</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">{itemType === 'périodique' ? 'Périodique' : 'Ouvrage'}</label>
                <input
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 mb-2"
                  placeholder={itemType === 'périodique' ? 'Rechercher par titre, ISSN ou auteur' : 'Rechercher par titre, code ou auteur'}
                  value={bookQuery}
                  onChange={e => setBookQuery(e.target.value)}
                />
                <select
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={form.livre_id}
                  onChange={e => setForm({ ...form, livre_id: e.target.value })}
                  required
                >
                  <option value="">-- choisir --</option>
                  {books
                    .filter(b => (b.exemplaires_disponibles ?? 0) > 0)
                    .map(b => (
                      <option key={b.id} value={b.id}>
                        {b.titre} {itemType === 'périodique' && b.issn ? `(ISSN ${b.issn})` : ''}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
              >
                💾 Démarrer
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setModal(false)}
              >
                ❌ Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Détails */}
      {detailsConsult && (
        <Modal title="Détails de la consultation" onClose={() => setDetailsConsult(null)}>
          <div className="p-6 space-y-6">
            {/* Lecteur */}
            <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
              <h3 className="text-lg font-bold mb-3">👤 Lecteur</h3>
              {detailsConsult.Reader ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><span className="font-semibold">Nom :</span> {detailsConsult.Reader.nom}</div>
                  <div><span className="font-semibold">Prénom :</span> {detailsConsult.Reader.prenom}</div>
                  <div><span className="font-semibold">Matricule :</span> {detailsConsult.Reader.matricule || '-'}</div>
                  <div><span className="font-semibold">Email :</span> {detailsConsult.Reader.email || '-'}</div>
                  <div><span className="font-semibold">Type :</span> {detailsConsult.Reader.type}</div>
                  <div><span className="font-semibold">Date inscription :</span> {detailsConsult.Reader.date_inscription ? new Date(detailsConsult.Reader.date_inscription).toLocaleDateString() : '-'}</div>
                  <div><span className="font-semibold">Faculté :</span> {detailsConsult.Reader.faculte || '-'}</div>
                  <div><span className="font-semibold">Filière :</span> {detailsConsult.Reader.filiere || '-'}</div>
                  <div><span className="font-semibold">Niveau :</span> {detailsConsult.Reader.niveau || '-'}</div>
                  <div><span className="font-semibold">Téléphone :</span> {detailsConsult.Reader.telephone || '-'}</div>
                  <div><span className="font-semibold">Créé le :</span> {detailsConsult.Reader.createdAt ? new Date(detailsConsult.Reader.createdAt).toLocaleString() : '-'}</div>
                  <div><span className="font-semibold">Mis à jour :</span> {detailsConsult.Reader.updatedAt ? new Date(detailsConsult.Reader.updatedAt).toLocaleString() : '-'}</div>
                </div>
              ) : <p>-</p>}
            </div>

            {/* Livre */}
            {detailsConsult.Book && (
              <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="text-lg font-bold mb-3">📖 Livre</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div><span className="font-semibold">Titre :</span> {detailsConsult.Book.titre}</div>
                  <div><span className="font-semibold">Auteur :</span> {detailsConsult.Book.auteur || '-'}</div>
                  <div><span className="font-semibold">Éditeur :</span> {detailsConsult.Book.editeur || '-'}</div>
                  <div><span className="font-semibold">Code :</span> {detailsConsult.Book.code || '-'}</div>
                  <div><span className="font-semibold">Type d'ouvrage :</span> {detailsConsult.Book.type_ouvrage || '-'}</div>
                  <div><span className="font-semibold">Genre :</span> {detailsConsult.Book.genre || '-'}</div>
                  <div><span className="font-semibold">Année :</span> {detailsConsult.Book.annee_publication || '-'}</div>
                  <div><span className="font-semibold">Édition :</span> {detailsConsult.Book.edition || '-'}</div>
                  <div><span className="font-semibold">Langue :</span> {detailsConsult.Book.langue || '-'}</div>
                  <div><span className="font-semibold">Nombre pages :</span> {detailsConsult.Book.nombre_pages || '-'}</div>
                  <div><span className="font-semibold">État :</span> {detailsConsult.Book.etat === 'disponible' ? 'Disponible' : detailsConsult.Book.etat === 'reparation' ? 'En réparation' : '-'}</div>
                  <div><span className="font-semibold">Date acquisition :</span> {detailsConsult.Book.date_acquisition ? new Date(detailsConsult.Book.date_acquisition).toLocaleDateString() : '-'}</div>
                  <div><span className="font-semibold">Thème :</span> {detailsConsult.Book.theme || '-'}</div>
                  <div><span className="font-semibold">Emplacement :</span> {detailsConsult.Book.emplacement || '-'}</div>
                  <div><span className="font-semibold">Exemplaires :</span> {detailsConsult.Book.exemplaires_disponibles}/{detailsConsult.Book.total_exemplaires}</div>
                </div>
                {(detailsConsult.Book.resume || detailsConsult.Book.mots_cles || detailsConsult.Book.description) && (
                  <div className="mt-4 space-y-4">
                    {detailsConsult.Book.mots_cles && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold">Mots-clés</h4>
                        <p>{detailsConsult.Book.mots_cles}</p>
                      </div>
                    )}
                    {detailsConsult.Book.resume && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold">Résumé</h4>
                        <p>{detailsConsult.Book.resume}</p>
                      </div>
                    )}
                    {detailsConsult.Book.description && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-semibold">Description</h4>
                        <p>{detailsConsult.Book.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Consultation */}
            <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-500">
              <h3 className="text-lg font-bold mb-3">📅 Consultation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div><span className="font-semibold">ID :</span> {detailsConsult.id}</div>
                <div><span className="font-semibold">Créé le :</span> {detailsConsult.createdAt ? new Date(detailsConsult.createdAt).toLocaleString() : '-'}</div>
                <div><span className="font-semibold">Début :</span> {new Date(detailsConsult.heure_debut).toLocaleString()}</div>
                <div><span className="font-semibold">Fin :</span> {detailsConsult.heure_fin ? new Date(detailsConsult.heure_fin).toLocaleString() : '-'}</div>
                <div><span className="font-semibold">Durée :</span> {detailsConsult.heure_fin ? `${Math.round((new Date(detailsConsult.heure_fin) - new Date(detailsConsult.heure_debut)) / 60000)} min` : '-'}</div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
