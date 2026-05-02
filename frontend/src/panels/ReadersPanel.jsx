import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import api from "../api/axios";
import Modal from "../shared/Modal";
import SearchBar from "../shared/SearchBar";
import ReaderDetailsPanel from "./ReaderDetailsPanel";

import { FACULTY_OPTIONS, getFiliereOptions } from "../utils/faculties";

export default function ReadersPanel({ onChange }) {
  const { t } = useTranslation();
  const [readers, setReaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedReader, setSelectedReader] = useState(null);

  const [form, setForm] = useState({
    matricule: "",
    nom: "",
    prenom: "",
    type: "etudiant",
    faculte: "",
    filiere: "",
    niveau: "",
    email: "",
    telephone: ""
  });

  const filiereOptions = getFiliereOptions(form.faculte);

  useEffect(() => {
    setForm(f => ({ ...f, filiere: '' }));
  }, [form.faculte]);

  useEffect(() => {
    fetchReaders();
  }, [localQuery]);

  async function fetchReaders() {
    setLoading(true);
    try {
      const res = await api.get("/readers", { params: { q: localQuery } });
      setReaders(res.data || []);
    } catch (err) {
      console.error(err);
      alert(t("Erreur chargement des lecteurs"));
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm({
      matricule: "",
      nom: "",
      prenom: "",
      type: "etudiant",
      faculte: "",
      filiere: "",
      niveau: "",
      email: "",
      telephone: ""
    });
    setModal(true);
  }

  function openEdit(r) {
    setEditing(r);
    setForm({ ...r });
    setModal(true);
  }

  async function submit(e) {
    e.preventDefault();

    if (!form.nom || !form.prenom) {
      return alert("Nom et prénom sont obligatoires");
    }

    try {
      if (editing) {
        await api.put(`/readers/${editing.id}`, form);
      } else {
        await api.post("/readers", form);
      }

      setModal(false);
      fetchReaders();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert("Erreur sauvegarde");
    }
  }

  async function remove(id) {
    if (!window.confirm(t("Supprimer ce lecteur ?"))) return;

    try {
      await api.delete(`/readers/${id}`);
      fetchReaders();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t("Erreur suppression"));
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="panel-header flex justify-between items-center mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">👥 {t('Gestion des lecteurs')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('Cliquez sur une ligne pour voir les détails')}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <SearchBar
              value={localQuery}
              onChange={setLocalQuery}
              placeholder={t("Rechercher nom / matricule...")}
            />
          </div>
        </div>

        <button
          className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          onClick={openNew}
        >
          ➕ {t('Nouveau lecteur')}
        </button>
      </div>

      {/* TABLEAU */}
      <div className="card mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 dark:text-white">
        {loading ? (
          <div className="text-center dark:text-gray-300">{t('Chargement des lecteurs...')}</div>
        ) : readers.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">{t('Aucun lecteur trouvé')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Matricule')}</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Nom')}</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Prénom')}</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Type')}</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Faculté')}</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Filière')}</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Niveau')}</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Téléphone')}</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">{t('Actions')}</th>
                </tr>
              </thead>

              <tbody>
                {readers.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedReader(r)}
                  >
                    <td className="p-3 border dark:border-gray-600">{r.matricule || "—"}</td>
                    <td className="p-3 border dark:border-gray-600">{r.nom}</td>
                    <td className="p-3 border dark:border-gray-600">{r.prenom}</td>
                    <td className="p-3 border dark:border-gray-600">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded">
                        {r.type}
                      </span>
                    </td>
                    <td className="p-3 border dark:border-gray-600">{r.faculte || "—"}</td>
                    <td className="p-3 border dark:border-gray-600">{r.filiere || "—"}</td>
                    <td className="p-3 border dark:border-gray-600">{r.niveau || "—"}</td>
                    <td className="p-3 border dark:border-gray-600">{r.telephone || "—"}</td>

                    <td
                      className="p-3 border dark:border-gray-600 flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="px-3 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded dark:hover:bg-blue-700"
                        onClick={() => setSelectedReader(r)}
                      >
                        👁️
                      </button>

                      <button
                        className="px-3 py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded dark:hover:bg-yellow-700"
                        onClick={() => openEdit(r)}
                      >
                        ✏️
                      </button>

                      <button
                        className="px-3 py-2 bg-red-600 dark:bg-red-700 text-white rounded dark:hover:bg-red-800"
                        onClick={() => remove(r.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
  <Modal
    title={editing ? "✏️ {t('Modifier lecteur')}" : "👥 {t('Ajouter lecteur')}"}
    onClose={() => setModal(false)}
  >
    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 dark:text-white">
      {/* Type */}
      <div>
        <label className="block font-semibold mb-1 dark:text-gray-300">Type</label>
        <select
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="etudiant">Étudiant</option>
          <option value="enseignant">Enseignant</option>
          <option value="personnel">Personnel</option>
          <option value="autre">Autre</option>
        </select>
      </div>

      {/* Nom */}
      <div>
        <label className="block font-semibold mb-1 dark:text-gray-300">Nom *</label>
        <input
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={form.nom}
          onChange={e => setForm({ ...form, nom: e.target.value })}
          required
        />
      </div>

      {/* Prénom */}
      <div>
        <label className="block font-semibold mb-1 dark:text-gray-300">Prénom *</label>
        <input
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={form.prenom}
          onChange={e => setForm({ ...form, prenom: e.target.value })}
          required
        />
      </div>

      {/* Étudiant : Matricule, Faculté, Filière, Niveau */}
      {form.type === "etudiant" && (
        <>
          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">Matricule</label>
            <input
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.matricule}
              onChange={e => setForm({ ...form, matricule: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">Faculté</label>
            <select
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.faculte}
              onChange={e => setForm({ ...form, faculte: e.target.value, filiere: '' })}
              required
            >
              <option value="">Sélectionner une faculté</option>
              {FACULTY_OPTIONS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">Filière</label>
            <select
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.filiere}
              onChange={e => setForm({ ...form, filiere: e.target.value })}
              required
              disabled={filiereOptions.length === 0}
            >
              <option value="">Sélectionner une filière</option>
              {filiereOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1 dark:text-gray-300">Niveau</label>
            <input
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={form.niveau}
              onChange={e => setForm({ ...form, niveau: e.target.value })}
              required
            />
          </div>
        </>
      )}

      {/* Téléphone */}
      <div className="md:col-span-2">
        <label className="block font-semibold mb-1 dark:text-gray-300">Téléphone</label>
        <input
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          value={form.telephone}
          onChange={e => setForm({ ...form, telephone: e.target.value })}
        />
      </div>

      {/* Boutons */}
      <div className="md:col-span-2 flex gap-4 mt-4">
        <button
          type="submit"
          className="flex-1 bg-green-600 dark:bg-green-700 text-white font-bold py-3 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition"
        >
          💾 Sauvegarder
        </button>

        <button
          type="button"
          className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-700 transition"
          onClick={() => setModal(false)}
        >
          ❌ Annuler
        </button>
      </div>
    </form>
  </Modal>
)}

      {/* DÉTAILS */}
      {selectedReader && (
        <ReaderDetailsPanel
          reader={selectedReader}
          onClose={() => setSelectedReader(null)}
        />
      )}
    </>
  );
}
