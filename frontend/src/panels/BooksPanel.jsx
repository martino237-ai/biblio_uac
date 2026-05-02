import React, { useEffect, useState } from "react"; 
import { useTranslation } from 'react-i18next';
import api from "../api/axios";
import Modal from "../shared/Modal";
import SearchBar from "../shared/SearchBar";
import BookDetailsPanel from "./BookDetailsPanel";

export default function BooksPanel({ onChange }) {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [localQuery, setLocalQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const [form, setForm] = useState({
    code: "",
    titre: "",
    auteur: "",
    editeur: "",
    annee_publication: "",
    edition: "",
    langue: "",
    nombre_pages: "",
    resume: "",
    theme: "",
    mots_cles: "",
    genre: "",
    type_ouvrage: "livre",
    etat: "disponible",
    date_acquisition: "",
    total_exemplaires: "1",
    exemplaires_disponibles: "1",
    description: "",
    emplacement: ""
  });

  useEffect(() => {
    fetchBooks();
  }, [localQuery]);

  async function fetchBooks() {
    setLoading(true);
    try {
      const res = await api.get("/books", { params: { q: localQuery } });
      setBooks(res.data || []);
    } catch (err) {
      console.error(err);
      alert(t('Erreur chargement des ouvrages — regarde la console'));
    } finally {
      setLoading(false);
    }
  }

  function openNew() {
    setEditing(null);
    setForm({
      code: "",
      titre: "",
      auteur: "",
      editeur: "",
      annee_publication: "",
      edition: "",
      langue: "",
      nombre_pages: "",
      resume: "",
      theme: "",
      mots_cles: "",
      genre: "",
      type_ouvrage: "livre",
      etat: "disponible",
      date_acquisition: "",
      emplacement: "",
      total_exemplaires: "1",
      exemplaires_disponibles: "1",
      description: ""
    });
    setModal(true);
  }

  function openEdit(b) {
    setEditing(b);
    setForm({
      code: b.code || "",
      titre: b.titre || "",
      auteur: b.auteur || "",
      editeur: b.editeur || "",
      annee_publication: b.annee_publication || "",
      edition: b.edition || "",
      langue: b.langue || "",
      nombre_pages: b.nombre_pages || "",
      resume: b.resume || "",
      theme: b.theme || "",
      mots_cles: b.mots_cles || "",
      genre: b.genre || "",
      type_ouvrage: b.type_ouvrage || "livre",
      etat: b.etat || "disponible",
      date_acquisition: b.date_acquisition || "",
      emplacement: b.emplacement || "",
      description: b.description || "",
      total_exemplaires: String(b.total_exemplaires ?? 1),
      exemplaires_disponibles: String(
        b.exemplaires_disponibles ?? b.total_exemplaires ?? 1
      )
    });
    setModal(true);
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        annee_publication: form.annee_publication ? Number(form.annee_publication) : null,
        nombre_pages: form.nombre_pages ? Number(form.nombre_pages) : null,
        total_exemplaires: Number(form.total_exemplaires) || 1,
        exemplaires_disponibles:
          Number(form.exemplaires_disponibles) ||
          Number(form.total_exemplaires) ||
          1
      };

      if (editing) {
        await api.put(`/books/${editing.id}`, payload);
      } else {
        await api.post("/books", payload);
      }

      setModal(false);
      fetchBooks();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err.message;
      alert(t('Erreur sauvegarde :') + ' ' + msg);
    }
  }

  async function remove(id) {
    if (!window.confirm(t('Supprimer cet ouvrage ?'))) return;
    try {
      await api.delete(`/books/${id}`);
      fetchBooks();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t('Erreur suppression — regarde la console'));
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="panel-header flex justify-between items-center mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div>
            <h2 className="text-2xl font-bold">📚 {t('Gestion des ouvrages')}</h2>
            <p className="text-gray-600">
              {t('Clique n’importe où sur une ligne pour voir les détails de l’ouvrage')}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <SearchBar
              value={localQuery}
              onChange={setLocalQuery}
              placeholder={t("Rechercher titre / auteur / code...")}
            />
          </div>
        </div>

        <button
          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 transition"
          onClick={openNew}
        >
          ➕ {t('Nouvel ouvrage')}
        </button>
      </div>

      {/* TABLEAU */}
      <div className="card mt-8 bg-white rounded-lg shadow-lg p-6">
        {loading ? (
          <div className="loading text-center">{t('Chargement des ouvrages...')}</div>
        ) : books.length === 0 ? (
          <p className="empty text-center text-gray-500">
            {t('Aucun ouvrage trouvé')}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">{t('Code')}</th>
                  <th className="p-3 border">{t('Titre')}</th>
                  <th className="p-3 border">{t('Auteur')}</th>
                  <th className="p-3 border">{t('Thème')}</th>
                  <th className="p-3 border">{t('Emplacement')}</th>
                  <th className="p-3 border">{t('Disponibles')}</th>
                  <th className="p-3 border">{t('Actions')}</th>
                </tr>
              </thead>

              <tbody>
                {books.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedBook(b)}
                  >
                    <td className="p-3 border">{b.code}</td>
                    <td className="p-3 border">{b.titre}</td>
                    <td className="p-3 border">{b.auteur || "—"}</td>
                    <td className="p-3 border">{b.theme || "—"}</td>
                    <td className="p-3 border">
                      {b.emplacement || "—"}
                    </td>
                    <td className="p-3 border">
                      {b.exemplaires_disponibles}/{b.total_exemplaires}
                    </td>

                    <td
                      className="p-3 border flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="px-3 py-2 bg-blue-500 text-white rounded"
                        onClick={() => setSelectedBook(b)}
                      >
                        👁️ 
                      </button>

                      <button
                        className="px-3 py-2 bg-yellow-500 text-white rounded"
                        onClick={() => openEdit(b)}
                      >
                        ✏️ 
                      </button>

                      <button
                        className="px-3 py-2 bg-red-600 text-white rounded"
                        onClick={() => remove(b.id)}
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

      {/* =================== MODAL FORMULAIRE (SANS CROIX) =================== */}
      {modal && (
        <Modal
          title={
            editing
              ? t("Modifier l'ouvrage")
              : t("Ajouter un nouvel ouvrage")
          }
        >
          <form onSubmit={submit} className="grid grid-cols-2 gap-6 p-4">
            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                {t("Code de l'ouvrage *")}
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Ex: BK-001")}
                value={form.code}
                onChange={(e) =>
                  setForm({ ...form, code: e.target.value })
                }
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                {t("Titre de l'ouvrage *")}
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Titre de l'ouvrage")}
                value={form.titre}
                onChange={(e) =>
                  setForm({ ...form, titre: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                {t("Auteur")}
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Auteur")}
                value={form.auteur}
                onChange={(e) =>
                  setForm({ ...form, auteur: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                {t("Éditeur")}
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Éditeur")}
                value={form.editeur}
                onChange={(e) =>
                  setForm({ ...form, editeur: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                {t("Année de publication")}
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Ex: 2023")}
                value={form.annee_publication}
                onChange={(e) =>
                  setForm({ ...form, annee_publication: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                {t("Édition")}
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Ex: 1ère édition")}
                value={form.edition}
                onChange={(e) =>
                  setForm({ ...form, edition: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                {t("Langue")}
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Ex: Français")}
                value={form.langue}
                onChange={(e) =>
                  setForm({ ...form, langue: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                {t("Nombre de pages")}
              </label>
              <input
                type="number"
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Ex: 300")}
                value={form.nombre_pages}
                onChange={(e) =>
                  setForm({ ...form, nombre_pages: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                {t("Genre d'ouvrage")}
              </label>
              <input
                list="genre-options"
                className="w-full px-4 py-3 border rounded-lg"
                placeholder={t("Sélectionner ou saisir le genre")}
                value={form.genre}
                onChange={(e) =>
                  setForm({ ...form, genre: e.target.value })
                }
              />
              <datalist id="genre-options">
                <option value="Roman" />
                <option value="Essai" />
                <option value="Histoire" />
                <option value="Science" />
                <option value="BD" />
                <option value="Poésie" />
                <option value="Théâtre" />
                <option value="Manuel" />
                <option value="Autre" />
              </datalist>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Type d'ouvrage
              </label>
              <input
                list="type-ouvrage-options"
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Sélectionner ou saisir le type d'ouvrage"
                value={form.type_ouvrage}
                onChange={(e) =>
                  setForm({ ...form, type_ouvrage: e.target.value })
                }
              />
              <datalist id="type-ouvrage-options">
                <option value="Livre" />
                <option value="Revue" />
                <option value="Ouvrage de référence" />
                <option value="Document académique" />
                <option value="Mémoire" />
              </datalist>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                État
              </label>
              <select
                className="w-full px-4 py-3 border rounded-lg"
                value={form.etat}
                onChange={(e) =>
                  setForm({ ...form, etat: e.target.value })
                }
              >
                <option value="disponible">Disponible</option>
                <option value="reparation">En réparation</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Date d'acquisition
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 border rounded-lg"
                value={form.date_acquisition}
                onChange={(e) =>
                  setForm({ ...form, date_acquisition: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                Mots-clés
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Séparés par des virgules"
                value={form.mots_cles}
                onChange={(e) =>
                  setForm({ ...form, mots_cles: e.target.value })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                Résumé
              </label>
              <textarea
                className="w-full px-4 py-3 border rounded-lg"
                rows={3}
                placeholder="Résumé de l'ouvrage..."
                value={form.resume}
                onChange={(e) =>
                  setForm({
                    ...form,
                    resume: e.target.value
                  })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 border rounded-lg"
                rows={3}
                placeholder="Description détaillée de l'ouvrage..."
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                Emplacement
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Ex: Rayon A1, Étagère 3"
                value={form.emplacement}
                onChange={(e) =>
                  setForm({ ...form, emplacement: e.target.value })
                }
              />
            </div>

            <div className="col-span-2 flex gap-4 mt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg"
              >
                💾 Sauvegarder
              </button>

              <button
                type="button"
                className="flex-1 bg-gray-300 text-gray-800 font-bold py-3 rounded-lg"
                onClick={() => setModal(false)}
              >
                ❌ Annuler
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL DÉTAILS DE L'OUVRAGE */}
      {selectedBook && (
        <BookDetailsPanel
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}
    </>
  );
}
