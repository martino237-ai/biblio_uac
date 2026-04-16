import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';

export default function Books(){
  const { t } = useTranslation();
  const [books,setBooks]=useState([]);
  const [onlineBooks,setOnlineBooks]=useState([]);
  const [query,setQuery]=useState('');
  const [mode,setMode]=useState('local'); // 'local' or 'online'
  const [category,setCategory]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [user, setUser] = useState(null);

  const categories = [
    'informatique',
    'santé',
    'droit',
    'education',
    'roman',
    'théologie'
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
    setUser(storedUser);

    async function load() {
      setLoading(true);
      try {
        if (mode === 'local') {
          const res = await api.get('/books', { params: { q: query } });
          setBooks(res.data || []);
        } else {
          // for online mode we can add subject: prefix to help filter by category
          let term = query || 'ebook';
          if (category) {
            // openlibrary search syntax: subject:category
            term = `subject:${category}`;
          }
          term = encodeURIComponent(term);
          const res = await fetch(`https://openlibrary.org/search.json?q=${term}&has_fulltext=true`);
          const data = await res.json();
          setOnlineBooks(data.docs || []);
        }
      } catch (e) {
        setError(mode === 'local' ? t('Erreur chargement livres') : t('Erreur chargement livres en ligne'));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [query, mode, t]);

  async function fetchBooks(){
    setLoading(true);
    try{
      const res = await api.get('/books', { params: { q: query } });
      setBooks(res.data || []);
    }catch(e){
      setError(t('Erreur chargement livres'));
    }finally{
      setLoading(false);
    }
  }

  async function fetchOnlineBooks(){
    setLoading(true);
    try{
      // using OpenLibrary search with fulltext filter (free ebooks)
      let term = query || 'ebook';
      if (category) {
        term = `subject:${category}`;
      }
      term = encodeURIComponent(term);
      const url = `https://openlibrary.org/search.json?q=${term}&has_fulltext=true`;
      console.debug('[Books.jsx] fetchOnlineBooks url', url);
      const res = await fetch(url);
      const data = await res.json();
      // keep top 50 results
      setOnlineBooks(data.docs || []);
    }catch(e){
      setError(t('Erreur chargement livres en ligne'));
    }finally{
      setLoading(false);
    }
  }

  function searchOnline(){
    const term = encodeURIComponent(query || 'livres');
    window.open(`https://www.google.com/search?q=${term}`, '_blank');
  }

  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location = '/';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Profile */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="text-2xl">📚</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('Bibliothèque UAC')}</h1>
                <p className="text-sm text-gray-600">{t('Catalogue des livres')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.nom}</p>
                  <p className="text-xs text-gray-500">{t('Lecteur')}</p>
                </div>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
              >
                {t('Déconnexion')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">{t('Rechercher des livres')}</h2>
          {/* mode switch */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={()=>{
                setMode('local');
                setCategory('');
                setQuery('');
              }}
              className={`px-4 py-2 rounded-lg font-medium ${mode==='local' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {t('Livres locaux')}
            </button>
            <button
              onClick={()=>{
                setMode('online');
                setCategory('');
                setQuery('');
              }}
              className={`px-4 py-2 rounded-lg font-medium ${mode==='online' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {t('Livres gratuits en ligne')}
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {mode === 'online' && (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setQuery(cat);
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${category === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
                {category && (
                  <button
                    onClick={() => {
                      setCategory('');
                      setQuery('');
                    }}
                    className="px-3 py-1 rounded-full text-sm bg-red-200 text-red-700 hover:bg-red-300"
                  >
                    {t('Clear')}
                  </button>
                )}
              </div>
            )}

            <form
            className="flex gap-4"
            onSubmit={e => {
              e.preventDefault();
              if (mode === 'local') fetchBooks();
              else fetchOnlineBooks();
            }}
          >
            <input
              type="text"
              placeholder={t('Rechercher titre / auteur / code...')}
              value={query}
              onChange={e=>{
                setQuery(e.target.value);
                setCategory('');
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              {t('Rechercher')}
            </button>
          </form>
          </div>
          {mode === 'local' && (
            <div className="mt-4 flex gap-4">
              <button
                onClick={searchOnline}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
              >
                🔍 {t('Rechercher en ligne')}
              </button>
            </div>
          )}
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('Chargement...')}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          // display according to mode
          mode === 'local' ? (
            books.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('Aucun livre trouvé')}</h3>
                <p className="text-gray-600 mb-6">{t('Essayez une autre recherche ou consultez en ligne')}</p>
                <button
                  onClick={searchOnline}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  {t('Rechercher en ligne')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map(book => (
                  <div key={book.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{book.titre}</h3>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {book.code}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{t('Auteur')}: {book.auteur || t('Inconnu')}</p>
                      <p className="text-sm text-gray-600 mb-1">{t('Thème')}: {book.theme || t('Non spécifié')}</p>
                      <p className="text-sm text-gray-600 mb-3">{t('Emplacement')}: {book.emplacement || t('Non spécifié')}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${book.exemplaires_disponibles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {book.exemplaires_disponibles > 0
                            ? `${book.exemplaires_disponibles}/${book.total_exemplaires} ${t('disponibles')}`
                            : t('Indisponible')
                          }
                        </span>
                      
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // online mode
            onlineBooks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('Aucun livre en ligne trouvé')}</h3>
                <p className="text-gray-600 mb-6">{t('Essayez une autre recherche')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {onlineBooks.map((book, idx) => (
                  <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{t('Auteur')}: {book.author_name ? book.author_name.join(', ') : t('Inconnu')}</p>
                      <p className="text-sm text-gray-600 mb-1">{t('Année')}: {book.first_publish_year || t('N/A')}</p>
                      <div className="mt-4">
                        {book.key && (
                          <a
                            href={`https://openlibrary.org${book.key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition"
                          >
                            {t('Voir en ligne')}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )
        )}
      </main>
    </div>
  );
}
