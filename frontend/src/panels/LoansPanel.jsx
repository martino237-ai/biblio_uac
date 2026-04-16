import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Modal from '../shared/Modal';
import { generateSimplePDF } from '../utils/pdfGenerator';

export default function LoansPanel({ query = '', onChange }) {
  const { t } = useTranslation();
  const [loans, setLoans] = useState([]);
  const [books, setBooks] = useState([]);
  const [readers, setReaders] = useState([]);
  const [modal, setModal] = useState(false);
  const [detailsLoan, setDetailsLoan] = useState(null); // <-- modal détails
  const [form, setForm] = useState({
    lecteur_id: '',
    livre_id: '',
    date_emprunt: '',
    date_retour_prevue: '',
    type_emprunt: 'normal'
  });
  const [readerQuery, setReaderQuery] = useState('');
  const [bookQuery, setBookQuery] = useState('');

  // filtering and exporting
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');


  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, startDate, endDate, statusFilter]);

  async function fetchAll() {
    try {
      const params = {};
      if (query) params.q = query;
      if (startDate && endDate) {
        params.start = startDate;
        params.end = endDate;
      }
      if (statusFilter) params.statut = statusFilter;
      const loansRes = await api.get('/loans', { params });
      setLoans(loansRes.data || []);
    } catch (err) {
      console.error(err);
      alert(t('Erreur chargement emprunts (voir console)'));
    }
  }

  // Recherche dynamique lecteurs
  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (!readerQuery) return setReaders([]);
      try {
        const res = await api.get('/readers/search', { params: { q: readerQuery } });
        setReaders(res.data || []);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(debounce);
  }, [readerQuery]);

  // Recherche dynamique livres
  useEffect(() => {
    const debounce = setTimeout(async () => {
      if (!bookQuery) return setBooks([]);
      try {
        const res = await api.get('/books/search', { params: { q: bookQuery } });
        setBooks(res.data || []);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(debounce);
  }, [bookQuery]);

  async function create(e) {
    e.preventDefault();
    if (new Date(form.date_retour_prevue) <= new Date(form.date_emprunt)) {
      alert(t('La date de retour prévue doit être après la date d\'emprunt'));
      return;
    }
    try {
      await api.post('/loans', {
        ...form,
        date_emprunt: form.date_emprunt || new Date().toISOString().slice(0, 10)
      });
      setModal(false);
      fetchAll();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t('Erreur création emprunt:') + ' ' + (err?.response?.data?.error || err.message));
    }
  }

  async function doReturn(id) {
    if (!window.confirm(t('Marquer comme rendu ?'))) return;
    try {
      await api.post(`/loans/${id}/return`);
      fetchAll();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t('Erreur restitution'));
    }
  }

  async function renewLoan(id) {
    if (!window.confirm(t('Prolonger cet emprunt de 7 jours ?'))) return;
    try {
      const res = await api.post(`/loans/${id}/renew`);
      fetchAll();
      onChange && onChange();
      alert(t('Date de retour prolongée') + ': ' + (res.data.date_retour_prevue || ''));
    } catch (err) {
      console.error(err);
      alert(t('Erreur prolongation :') + ' ' + (err?.response?.data?.error || err?.message));
    }
  }

  const exportToPDF = () => {
    if (loans.length === 0) {
      alert('Aucun emprunt a exporter');
      return;
    }
    // Transformer les données
    const data = loans.map(l => ({
      '#': l.id,
      'Lecteur': l.Reader ? `${l.Reader.nom} ${l.Reader.prenom}` : l.lecteur_id,
      'Faculté': l.Reader?.faculte || '-',
      'Filière': l.Reader?.filiere || '-',
      'Livre': l.Book ? l.Book.titre : l.livre_id,
      'Type': l.type_emprunt === 'prolonge' ? 'Prolongé' : l.type_emprunt === 'limite' ? 'Limité' : 'Normal',
      'Date debut': l.date_emprunt || '-',
      'Date retour': l.date_retour_prevue || '-',
      'Date retour effective': l.date_retour_effective || '-',
      'Statut': l.statut || '-'
    }));

    const title = startDate && endDate
      ? `Emprunts du ${startDate} au ${endDate}`
      : 'Emprunts';

    const filename = `emprunts_${startDate||'tous'}_${endDate||'tous'}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    generateSimplePDF(data, {
      filename,
      title,
      org: 'Bibliotheque UAC',
      address: 'Universite Adventiste Cosendai',
      columns: ['#', 'Lecteur', 'Faculté', 'Filière', 'Livre', 'Type', 'Date debut', 'Date retour', 'Date retour effective', 'Statut'],
      orientation: 'landscape'
    });
  };

  return (
    <>
      <div className="panel-header flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold">📚 {t('Emprunts')}</h2>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <label className="text-sm font-semibold">{t('Début')}:</label>
          <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <label className="text-sm font-semibold">{t('Fin')}:</label>
          <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <select
            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">{t('Tous statuts')}</option>
            <option value="emprunte">{t('Empruntés')}</option>
            <option value="en_retard">{t('En retard')}</option>
            <option value="retourne">{t('Retournés')}</option>
          </select>
          <button
            className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition"
            onClick={exportToPDF}
          >
            📄 PDF
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
            onClick={() => {
              setForm({
                lecteur_id: '',
                livre_id: '',
                date_emprunt: new Date().toISOString().slice(0, 10),
                date_retour_prevue: '',
                type_emprunt: 'normal'
              });
              setReaderQuery('');
              setBookQuery('');
              setModal(true);
            }}
          >
            + {t('Nouvel emprunt')}
          </button>
        </div>
      </div>

      {/* Tableau emprunts */}
      <div className="card bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 border">{t('Lecteur')}</th>
              <th className="p-3 border">{t('Livre')}</th>
              <th className="p-3 border">{t("Type d'emprunt")}</th>
              <th className="p-3 border">{t('Date emprunt')}</th>
              <th className="p-3 border">{t('Retour prévu')}</th>
              <th className="p-3 border">{t('Retour effectif')}</th>
              <th className="p-3 border">{t('Prolongations')}</th>
              <th className="p-3 border">{t('Statut')}</th>
              <th className="p-3 border">{t('Actions')}</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(l => (
              <tr key={l.id} className={`hover:bg-gray-50 transition cursor-pointer ${l.statut === 'en_retard' ? 'bg-red-50' : ''}`}>
                <td className="p-3 border" onClick={() => setDetailsLoan(l)}>
                  {l.Reader ? `${l.Reader.nom} ${l.Reader.prenom} (${l.Reader.matricule || l.Reader.id})` : l.lecteur_id}
                </td>
                <td className="p-3 border" onClick={() => setDetailsLoan(l)}>
                  {l.Reader?.faculte || '-'}
                </td>
                <td className="p-3 border" onClick={() => setDetailsLoan(l)}>
                  {l.Reader?.filiere || '-'}
                </td>
                <td className="p-3 border" onClick={() => setDetailsLoan(l)}>
                  {l.Book ? l.Book.titre : l.livre_id}
                </td>
                <td className="p-3 border">{l.type_emprunt === 'prolonge' ? t('Prolongé') : l.type_emprunt === 'limite' ? t('Limité') : t('Normal')}</td>
                <td className="p-3 border">{l.date_emprunt}</td>
                <td className="p-3 border">{l.date_retour_prevue}</td>
                <td className="p-3 border">{l.date_retour_effective || '-'}</td>
                <td className="p-3 border">{l.prolongations || 0}</td>
                <td className="p-3 border">{l.statut === 'en_retard' ? t('en retard') : t(l.statut)}</td>
                <td className="p-3 border flex gap-2">
                  {l.statut === 'emprunte' && (
                    <button
                      className="px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                      onClick={() => renewLoan(l.id)}
                    >
                      {t('Prolonger')}
                    </button>
                  )}
                  {l.statut !== 'retourne' && (
                    <button
                      className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={() => doReturn(l.id)}
                    >
                      {t('Rendre')}
                    </button>
                  )}
                  <button
                    className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    onClick={() => setDetailsLoan(l)}
                  >
                    {t('Détails')}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Formulaire */}
      {modal && (
        <Modal title={t('Nouvel emprunt')} onClose={() => setModal(false)}>
          <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
            
            {/* Lecteur */}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">{t('Lecteur')}</label>
              <input
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                placeholder={t('Rechercher par nom, prénom ou matricule')}
                value={readerQuery}
                onChange={e => setReaderQuery(e.target.value)}
              />
              <select
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.lecteur_id}
                onChange={e => setForm({ ...form, lecteur_id: e.target.value })}
                required
              >
                <option value="">-- choisir --</option>
                {readers.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.nom} {r.prenom} ({r.matricule || r.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Livre */}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">{t('Livre')}</label>
              <input
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
                placeholder={t('Rechercher par titre, code ou auteur')}
                value={bookQuery}
                onChange={e => setBookQuery(e.target.value)}
              />
              <select
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.livre_id}
                onChange={e => setForm({ ...form, livre_id: e.target.value })}
                required
              >
                <option value="">-- choisir --</option>
                {books
                  .filter(b => (b.exemplaires_disponibles ?? 0) > 0)
                  .map(b => (
                    <option key={b.id} value={b.id}>
                      {b.titre} ({b.exemplaires_disponibles}/{b.total_exemplaires})
                    </option>
                  ))}
              </select>
            </div>

            {/* Type d'emprunt */}
            <div className="md:col-span-2">
              <label className="block font-semibold mb-1">{t("Type d'emprunt")}</label>
              <select
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.type_emprunt}
                onChange={e => setForm({ ...form, type_emprunt: e.target.value })}
                required
              >
                <option value="normal">{t('Normal')}</option>
                <option value="prolonge">{t('Prolongé')}</option>
                <option value="limite">{t('Limité')}</option>
              </select>
            </div>

            {/* Dates */}
            <div>
              <label className="block font-semibold mb-1">{t('Date emprunt')}</label>
              <input
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="date"
                value={form.date_emprunt}
                onChange={e => setForm({ ...form, date_emprunt: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">{t('Date retour prévue')}</label>
              <input
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="date"
                value={form.date_retour_prevue}
                onChange={e => setForm({ ...form, date_retour_prevue: e.target.value })}
                required
              />
            </div>

            {/* Boutons */}
            <div className="md:col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
              >
                💾 {t('Enregistrer')}
              </button>
              <button
                type="button"
                className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition"
                onClick={() => setModal(false)}
              >
                ❌ {t('Annuler')}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Détails */}
{detailsLoan && (
  <Modal title={t("Détails de l'emprunt")} onClose={() => setDetailsLoan(null)}>
    <div className="p-6 space-y-6">

      {/* Lecteur */}
      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-blue-500">
        <h3 className="text-lg font-bold mb-3">👤 {t('Lecteur')}</h3>
        {detailsLoan.Reader ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div><span className="font-semibold">{t('Nom')} :</span> {detailsLoan.Reader.nom}</div>
            <div><span className="font-semibold">{t('Prénom')} :</span> {detailsLoan.Reader.prenom}</div>
            <div><span className="font-semibold">{t('Matricule')} :</span> {detailsLoan.Reader.matricule || '-'}</div>
            <div><span className="font-semibold">{t('Email')} :</span> {detailsLoan.Reader.email || '-'}</div>
            <div><span className="font-semibold">{t('Type')} :</span> {detailsLoan.Reader.type}</div>
            <div><span className="font-semibold">{t("Date d'inscription")} :</span> {detailsLoan.Reader.date_inscription ? new Date(detailsLoan.Reader.date_inscription).toLocaleDateString() : '-'}</div>
            <div><span className="font-semibold">Créé le :</span> {detailsLoan.Reader.createdAt ? new Date(detailsLoan.Reader.createdAt).toLocaleString() : '-'}</div>
            <div><span className="font-semibold">Mis à jour :</span> {detailsLoan.Reader.updatedAt ? new Date(detailsLoan.Reader.updatedAt).toLocaleString() : '-'}</div>
            <div><span className="font-semibold">{t('Faculté')} :</span> {detailsLoan.Reader.faculte || '-'}</div>
            <div><span className="font-semibold">{t('Filière')} :</span> {detailsLoan.Reader.filiere || '-'}</div>
            <div><span className="font-semibold">{t('Niveau')} :</span> {detailsLoan.Reader.niveau || '-'}</div>
            <div><span className="font-semibold">{t('Téléphone')} :</span> {detailsLoan.Reader.telephone || '-'}</div>
          </div>
        ) : (
          <p>-</p>
        )}
      </div>

      {/* Livre */}
      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-green-500">
        <h3 className="text-lg font-bold mb-3">📖 {t('Livre')}</h3>
        {detailsLoan.Book ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div><span className="font-semibold">Titre :</span> {detailsLoan.Book.titre}</div>
              <div><span className="font-semibold">Auteur :</span> {detailsLoan.Book.auteur || '-'}</div>
              <div><span className="font-semibold">Éditeur :</span> {detailsLoan.Book.editeur || '-'}</div>
              <div><span className="font-semibold">Code :</span> {detailsLoan.Book.code || '-'}</div>
              <div><span className="font-semibold">Type d'ouvrage :</span> {detailsLoan.Book.type_ouvrage || '-'}</div>
              <div><span className="font-semibold">Genre :</span> {detailsLoan.Book.genre || '-'}</div>
              <div><span className="font-semibold">Année :</span> {detailsLoan.Book.annee_publication || '-'}</div>
              <div><span className="font-semibold">Édition :</span> {detailsLoan.Book.edition || '-'}</div>
              <div><span className="font-semibold">Langue :</span> {detailsLoan.Book.langue || '-'}</div>
              <div><span className="font-semibold">Nombre pages :</span> {detailsLoan.Book.nombre_pages || '-'}</div>
              <div><span className="font-semibold">État :</span> {detailsLoan.Book.etat === 'disponible' ? 'Disponible' : detailsLoan.Book.etat === 'reparation' ? 'En réparation' : '-'}</div>
              <div><span className="font-semibold">Thème :</span> {detailsLoan.Book.theme || '-'}</div>
              <div><span className="font-semibold">Emplacement :</span> {detailsLoan.Book.emplacement || '-'}</div>
              <div><span className="font-semibold">Date acquisition :</span> {detailsLoan.Book.date_acquisition ? new Date(detailsLoan.Book.date_acquisition).toLocaleDateString() : '-'}</div>
              <div><span className="font-semibold">Exemplaires :</span> {detailsLoan.Book.exemplaires_disponibles}/{detailsLoan.Book.total_exemplaires}</div>
            </div>
            {(detailsLoan.Book.resume || detailsLoan.Book.mots_cles || detailsLoan.Book.description) && (
              <div className="mt-4 space-y-4">
                {detailsLoan.Book.mots_cles && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold">Mots-clés</h4>
                    <p>{detailsLoan.Book.mots_cles}</p>
                  </div>
                )}
                {detailsLoan.Book.resume && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold">Résumé</h4>
                    <p>{detailsLoan.Book.resume}</p>
                  </div>
                )}
                {detailsLoan.Book.description && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold">Description</h4>
                    <p>{detailsLoan.Book.description}</p>
                  </div>
                )}
              </div>
            )}
          </>
        ) : <p>-</p>}
      </div>

      {/* Emprunt */}
      <div className="bg-white shadow rounded-lg p-4 border-l-4 border-purple-500">
        <h3 className="text-lg font-bold mb-3">📅 {t('Emprunt')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div><span className="font-semibold">ID :</span> {detailsLoan.id}</div>
          <div><span className="font-semibold">Date emprunt :</span> {detailsLoan.date_emprunt}</div>
          <div><span className="font-semibold">Date retour prévue :</span> {detailsLoan.date_retour_prevue}</div>
          {detailsLoan.date_retour_effective && (
            <div><span className="font-semibold">Date retour effective :</span> {detailsLoan.date_retour_effective}</div>
          )}
          <div><span className="font-semibold">Créé le :</span> {detailsLoan.createdAt ? new Date(detailsLoan.createdAt).toLocaleString() : '-'}</div>
          <div><span className="font-semibold">Mis à jour :</span> {detailsLoan.updatedAt ? new Date(detailsLoan.updatedAt).toLocaleString() : '-'}</div>
          <div>
            <span className="font-semibold">Statut :</span>{' '}
            <span className={`px-2 py-1 rounded-full text-white font-semibold 
              ${detailsLoan.statut === 'retourne' ? 'bg-gray-500' : detailsLoan.statut === 'en_retard' ? 'bg-red-600' : 'bg-green-600'}`}>
              {detailsLoan.statut === 'en_retard' ? 'en retard' : t(detailsLoan.statut)}
            </span>
          </div>
          <div><span className="font-semibold">{t("Type d'emprunt")} :</span> {detailsLoan.type_emprunt === 'prolonge' ? t('Prolongé') : detailsLoan.type_emprunt === 'limite' ? t('Limité') : t('Normal')}</div>
          <div><span className="font-semibold">Prolongations :</span> {detailsLoan.prolongations || 0}</div>
        </div>
      </div>

    </div>
  </Modal>
)}

    </>
  );
}
