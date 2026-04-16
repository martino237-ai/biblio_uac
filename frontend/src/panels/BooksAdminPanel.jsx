import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function BooksAdminPanel() {
  const [books, setBooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    code: '',
    titre: '',
    auteur: '',
    categorie: 'Roman',
    disponible: true
  });
  const [categories] = useState(['Roman', 'Science-Fiction', 'Fantastique', 'Biographie', 'Historique', 'Policier', 'Jeunesse', 'Poésie', 'Théâtre', 'Essai']);

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      setLoading(true);
      const res = await api.get('/books');
      setBooks(res.data || []);
    } catch (err) {
      setError('❌ Erreur lors du chargement des livres');
      console.error('Erreur chargement livres', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setFormLoading(true);

    try {
      const res = await api.post('/books', formData);
      setSuccess('✅ Livre ajouté avec succès');
      setFormData({
        code: '',
        titre: '',
        auteur: '',
        categorie: 'Roman',
        disponible: true
      });
      setShowForm(false);
      await loadBooks();
    } catch (err) {
      setError('❌ ' + (err.response?.data?.message || err.message || 'Erreur lors de l\'ajout'));
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) return;

    try {
      await api.delete(`/books/${id}`);
      setSuccess('✅ Livre supprimé avec succès');
      await loadBooks();
    } catch (err) {
      setError('❌ Erreur lors de la suppression');
    }
  }

  async function toggleAvailability(id, currentStatus) {
    try {
      await api.patch(`/books/${id}`, { disponible: !currentStatus });
      setSuccess(`✅ Livre ${!currentStatus ? 'disponible' : 'indisponible'} mis à jour`);
      await loadBooks();
    } catch (err) {
      setError('❌ Erreur lors de la mise à jour');
    }
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header Section */}
      <div className="panel-header">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">📚 Gestion des Ouvrages</h2>
          <p className="text-gray-600">Gérez le catalogue des livres de la bibliothèque</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-lg transition duration-300 shadow-lg"
        >
          {showForm ? '✕ Fermer' : '➕ Nouveau Livre'}
        </button>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Ajouter un Nouveau Livre</h3>
          
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            {/* Code */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Code ISBN/Inventaire <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="Ex: 978-2-07-036822-8"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                disabled={formLoading}
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categorie}
                onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                disabled={formLoading}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Titre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="Titre complet du livre"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                disabled={formLoading}
              />
            </div>

            {/* Auteur */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">
                Auteur <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.auteur}
                onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
                placeholder="Nom de l'auteur"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition"
                disabled={formLoading}
              />
            </div>

            {/* Statut */}
            <div className="md:col-span-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.disponible}
                  onChange={(e) => setFormData({ ...formData, disponible: e.target.checked })}
                  className="h-5 w-5 text-blue-600 rounded"
                  disabled={formLoading}
                />
                <span className="text-gray-700 font-semibold">Disponible immédiatement</span>
              </label>
            </div>

            {/* Boutons */}
            <div className="md:col-span-2 flex gap-3 pt-4">
              <button
                type="submit"
                disabled={formLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold rounded-lg transition duration-300 disabled:opacity-60"
              >
                {formLoading ? '⏳ Ajout en cours...' : '✔️ Ajouter le Livre'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-lg transition duration-300"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Books List */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            Catalogue ({books.length} livres)
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Chargement des livres...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 text-lg">Aucun livre dans le catalogue</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Titre</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Auteur</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Catégorie</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700 font-semibold">{book.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="font-semibold text-gray-800">{book.titre}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{book.auteur}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                        {book.categorie}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full font-semibold ${
                        book.disponible 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {book.disponible ? '✅ Disponible' : '❌ Indisponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => toggleAvailability(book.id, book.disponible)}
                        className={`px-3 py-1 rounded-lg font-semibold transition ${
                          book.disponible
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
                            : 'bg-green-100 hover:bg-green-200 text-green-700'
                        }`}
                        title={book.disponible ? 'Marquer comme indisponible' : 'Marquer comme disponible'}
                      >
                        {book.disponible ? '⏸️ Indisponible' : '▶️ Disponible'}
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition"
                        title="Supprimer ce livre"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}