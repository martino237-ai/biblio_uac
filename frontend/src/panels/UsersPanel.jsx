import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import Modal from '../shared/Modal';
import SearchBar from '../shared/SearchBar';
import { FACULTY_OPTIONS, getFiliereOptions } from '../utils/faculties';

export default function UsersPanel({ onChange }) {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/users', { params: { q: localQuery } });
      setUsers(res.data || []);
    } catch (err) {
      console.warn('Erreur chargement utilisateurs', err);
    } finally {
      setLoading(false);
    }
  }, [localQuery]);

  const [form, setForm] = useState({
    username: '',
    password: '',
    nom: '',
    role: 'bibliothecaire',
    // reader-specific fields
    type: 'etudiant',
    faculte: '',
    filiere: '',
    niveau: '',
    telephone: '',
    matricule: '',
    email: ''
  });

  const filiereOptions = getFiliereOptions(form.faculte);

  useEffect(() => {
    setForm(f => ({ ...f, filiere: '' }));
  }, [form.faculte]);

  useEffect(() => {
    fetchUsers();
  }, [localQuery, fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [localQuery, fetchUsers]);

  function openNew() {
    setEditing(null);
    setForm({
      username: '',
      password: '',
      nom: '',
      role: 'bibliothecaire',
      type: 'etudiant',
      faculte: '',
      filiere: '',
      niveau: '',
      telephone: '',
      matricule: '',
      email: ''
    });
    setModal(true);
  }

  function openEdit(u) {
    setEditing(u);
    setForm({
      username: u.username || '',
      password: '', // don't show password
      nom: u.nom || '',
      role: u.role || 'bibliothecaire',
      type: u.type || 'etudiant',
      faculte: u.faculte || '',
      filiere: u.filiere || '',
      niveau: u.niveau || '',
      telephone: u.telephone || '',
      matricule: u.matricule || '',
      email: u.email || ''
    });
    setModal(true);
  }

  async function submit(e) {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!editing && !form.password) {
        alert('Mot de passe requis pour un nouvel utilisateur');
        return;
      }

      if (editing) {
        // For updates, don't send password if empty
        if (!payload.password) delete payload.password;
        await api.put(`/auth/users/${editing.id}`, payload);
      } else {
        if (form.role === 'lecteur') {
          await api.post('/auth/register-reader', payload);
        } else {
          await api.post('/auth/register', payload);
        }
      }

      setModal(false);
      fetchUsers();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.error || err.message;
      alert(t('Erreur sauvegarde :') + ' ' + msg);
    }
  }

  async function remove(id) {
    if (!window.confirm(t('Supprimer cet utilisateur ?'))) return;
    try {
      await api.delete(`/auth/users/${id}`);
      fetchUsers();
      onChange && onChange();
    } catch (err) {
      console.error(err);
      alert(t('Erreur suppression'));
    }
  }

  return (
    <>
      {/* HEADER */}
      <div className="panel-header flex justify-between items-center mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:gap-4">
          <div>
            <h2 className="text-2xl font-bold dark:text-white">👥 {t('Gestion des utilisateurs')}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('Cliquez sur une ligne pour voir les détails')}
            </p>
          </div>
          <div className="mt-2 md:mt-0">
            <SearchBar
              value={localQuery}
              onChange={setLocalQuery}
              placeholder="Rechercher nom / rôle..."
            />
          </div>
        </div>

        <button
          className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          onClick={openNew}
        >
          ➕ Nouvel utilisateur
        </button>
      </div>

      {/* TABLEAU */}
      <div className="card mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 dark:text-white">
        {loading ? (
          <div className="text-center dark:text-gray-300">Chargement des utilisateurs...</div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Aucun utilisateur trouvé</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">Nom d'utilisateur</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">Nom</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">Rôle</th>
                  <th className="p-3 border dark:border-gray-600 dark:text-white">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setSelectedUser(u)}
                  >
                    <td className="p-3 border dark:border-gray-600">{u.username}</td>
                    <td className="p-3 border dark:border-gray-600">{u.nom}</td>
                    <td className="p-3 border dark:border-gray-600">
                      {u.role === 'directeur' ? '👔 Administrateur' :
                       u.role === 'bibliothecaire' ? '📚 Bibliothécaire' :
                       u.role === 'lecteur' ? '👤 Lecteur' : u.role}
                    </td>

                    <td
                      className="p-3 border dark:border-gray-600 flex gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="px-3 py-2 bg-blue-500 text-white rounded"
                        onClick={() => setSelectedUser(u)}
                      >
                        👁️
                      </button>

                      <button
                        className="px-3 py-2 bg-yellow-500 text-white rounded"
                        onClick={() => openEdit(u)}
                      >
                        ✏️
                      </button>

                      <button
                        className="px-3 py-2 bg-red-600 text-white rounded"
                        onClick={() => remove(u.id)}
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

      {/* MODAL FORMULAIRE */}
      {modal && (
        <Modal
          title={
            editing
              ? "✏️ Modifier l'utilisateur"
              : "👥 {t('Ajouter un nouvel utilisateur')}"
          }
        >
          <form onSubmit={submit} className="grid grid-cols-2 gap-6 p-4">
            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                Nom d'utilisateur *
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Nom d'utilisateur"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                Nom complet *
              </label>
              <input
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Nom complet"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block font-semibold mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {!editing && (
              <div>
                <label className="block font-semibold mb-1">
                  Mot de passe *
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required={!editing}
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">
                Rôle *
              </label>
              <select
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                required
              >
                <option value="bibliothecaire">📚 Bibliothécaire</option>
                <option value="directeur">👔 Administrateur</option>
                <option value="lecteur">👤 Lecteur</option>
              </select>
            </div>

            {form.role === 'lecteur' && (
              <>
                <div>
                  <label className="block font-semibold mb-1">
                    Matricule *
                  </label>
                  <input
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Matricule"
                    value={form.matricule}
                    onChange={(e) => setForm({ ...form, matricule: e.target.value })}
                    required={form.role === 'lecteur'}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required={form.role === 'lecteur'}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Téléphone
                  </label>
                  <input
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    placeholder="Téléphone"
                    value={form.telephone}
                    onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Type
                  </label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  >
                    <option value="etudiant">Étudiant</option>
                    <option value="enseignant">Enseignant</option>
                    <option value="personnel">Personnel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Faculté
                  </label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    value={form.faculte}
                    onChange={(e) => setForm({ ...form, faculte: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    {FACULTY_OPTIONS.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Filière
                  </label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    value={form.filiere}
                    onChange={(e) => setForm({ ...form, filiere: e.target.value })}
                    disabled={!form.faculte}
                  >
                    <option value="">Sélectionner</option>
                    {filiereOptions.map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Niveau
                  </label>
                  <select
                    className="w-full px-4 py-3 border rounded-lg dark:bg-gray-700 dark:text-white"
                    value={form.niveau}
                    onChange={(e) => setForm({ ...form, niveau: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    <option value="L1">Licence 1</option>
                    <option value="L2">Licence 2</option>
                    <option value="L3">Licence 3</option>
                    <option value="M1">Master 1</option>
                    <option value="M2">Master 2</option>
                    <option value="D">Doctorat</option>
                  </select>
                </div>
              </>
            )}

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

      {/* MODAL DÉTAILS UTILISATEUR */}
      {selectedUser && (
        <Modal
          title="👤 Détails de l'utilisateur"
          onClose={() => setSelectedUser(null)}
        >
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Nom d'utilisateur:</strong> {selectedUser.username}
              </div>
              <div>
                <strong>Nom:</strong> {selectedUser.nom}
              </div>
              <div>
                <strong>Rôle:</strong> {
                  selectedUser.role === 'directeur' ? 'Administrateur' :
                  selectedUser.role === 'bibliothecaire' ? 'Bibliothécaire' :
                  selectedUser.role === 'lecteur' ? 'Lecteur' : selectedUser.role
                }
              </div>
              {selectedUser.role === 'lecteur' && (
                <>
                  <div>
                    <strong>Matricule:</strong> {selectedUser.matricule}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div>
                    <strong>Téléphone:</strong> {selectedUser.telephone || 'N/A'}
                  </div>
                  <div>
                    <strong>Type:</strong> {selectedUser.type}
                  </div>
                  <div>
                    <strong>Faculté:</strong> {selectedUser.faculte}
                  </div>
                  <div>
                    <strong>Filière:</strong> {selectedUser.filiere}
                  </div>
                  <div>
                    <strong>Niveau:</strong> {selectedUser.niveau}
                  </div>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
