import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import api from "../api/axios";
import ExportButton from '../shared/ExportButton';

export default function ActivitiesPanel() {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState({});
  // maps for converting ids -> names; start with empty objects so functions can run even before data loads
  const [references, setReferences] = useState({ readers: {}, books: {}, users: {} });

  useEffect(() => {
    fetchLogs();
    fetchReferences();

    // poll for new activities every 15 seconds
    const interval = setInterval(fetchLogs, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchLogs() {
    try {
      const res = await api.get("/activities");
      console.debug('[ActivitiesPanel] fetched logs', res.data);
      setLogs(res.data || []);
    } catch (err) {
      console.error("Erreur activités", err);
    }
  }

  async function fetchReferences() {
    try {
      // Récupérer lecteurs, livres et utilisateurs pour transformer les IDs en noms
      const [readers, books, users] = await Promise.all([
        api.get("/readers").catch(() => ({ data: [] })),
        api.get("/books").catch(() => ({ data: [] })),
        api.get("/auth/users").catch(() => ({ data: [] }))
      ]);

      setReferences({
        readers: readers.data.reduce((acc, r) => ({ ...acc, [r.id]: r.nom || r.name || r.prenom + ' ' + r.nom }), {}),
        books: books.data.reduce((acc, b) => ({ ...acc, [b.id]: b.titre || b.title || b.nom }), {}),
        users: users.data.reduce((acc, u) => ({ ...acc, [u.id]: u.nom || u.username || u.email || u.name }), {})
      });
    } catch (err) {
      console.error("Erreur chargement références", err);
    }
  }

  const toggleRow = (index) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const displayed = logs.filter(l =>
    filter === '' ||
    l.action.toLowerCase().includes(filter.toLowerCase()) ||
    (l.details && JSON.stringify(l.details).toLowerCase().includes(filter.toLowerCase()))
  );

  const formatDate = (raw) => {
    const dt = new Date(raw);
    if (isNaN(dt)) return raw ? String(raw) : '-';
    return dt.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Fonction améliorée pour convertir les IDs en noms
  const replaceIdsWithNames = (value) => {
    if (!value) return value;
    
    // Si c'est une chaîne, on la retourne telle quelle
    if (typeof value === 'string') return value;
    
    // Si c'est un nombre, on le retourne (pourrait être un ID mais on ne peut pas le remplacer sans contexte)
    if (typeof value === 'number') return value;

    // Si ce n'est pas un objet, on le retourne
    if (typeof value !== 'object') return value;

    const patterns = [
      { 
        keys: ['lecteur_id', 'reader_id', 'id_lecteur', 'lecteurId', 'readerId'], 
        map: references.readers || {}, 
        label: 'lecteur',
        nameFields: ['nom_lecteur', 'lecteur_nom', 'reader_name']
      },
      { 
        keys: ['livre_id', 'book_id', 'id_livre', 'livreId', 'bookId', 'exemplaire_id'], 
        map: references.books || {}, 
        label: 'livre',
        nameFields: ['titre_livre', 'livre_titre', 'book_title']
      },
      { 
        keys: ['user_id', 'userId', 'id_user', 'utilisateur_id', 'created_by', 'updated_by', 'cree_par'], 
        map: references.users || {}, 
        label: 'utilisateur',
        nameFields: ['nom_utilisateur', 'user_name']
      }
    ];

    // Traitement pour les tableaux
    if (Array.isArray(value)) {
      return value.map(item => replaceIdsWithNames(item));
    }

    // Traitement pour les objets
    const newValue = { ...value };
    
    // Chercher d'abord les patterns d'ID
    Object.keys(newValue).forEach(key => {
      const val = newValue[key];
      
      // Chercher si cette clé correspond à un pattern d'ID
      const pattern = patterns.find(p => p.keys.includes(key));
      
      if (pattern && val && (typeof val === 'number' || typeof val === 'string')) {
        // Remplacer l'ID par le nom correspondant
        const name = pattern.map[val];
        if (name) {
          // Utiliser un nom de champ plus explicite
          const newKey = pattern.nameFields[0] || `${pattern.label}_nom`;
          newValue[newKey] = name;
          delete newValue[key];
        }
      }
    });

    // Traitement récursif pour les objets imbriqués
    Object.keys(newValue).forEach(key => {
      if (newValue[key] && typeof newValue[key] === 'object') {
        newValue[key] = replaceIdsWithNames(newValue[key]);
      }
    });

    return newValue;
  };

  // convert a details value (string or object) to a JS value
  const parseDetails = (details) => {
    if (details === null || details === undefined) return details;
    
    // Si c'est déjà un objet, on le retourne après conversion
    if (typeof details === 'object') {
      return replaceIdsWithNames(details);
    }
    
    // Si c'est une chaîne, on tente de la parser
    if (typeof details === 'string') {
      // Ignorer les chaînes vides
      if (details.trim() === '') return null;
      
      try { 
        const parsed = JSON.parse(details);
        return replaceIdsWithNames(parsed);
      } catch (e) {
        // Si ce n'est pas du JSON valide, on retourne la chaîne
        return details;
      }
    }
    
    return details;
  };

  // Fonction pour obtenir une couleur de badge selon le type de valeur
  const getValueTypeColor = (value) => {
    if (value === null || value === undefined) return 'bg-gray-100 text-gray-600';
    if (typeof value === 'boolean') return 'bg-purple-100 text-purple-700';
    if (typeof value === 'number') return 'bg-green-100 text-green-700';
    if (typeof value === 'string') return 'bg-blue-100 text-blue-700';
    if (Array.isArray(value)) return 'bg-yellow-100 text-yellow-700';
    if (typeof value === 'object') return 'bg-indigo-100 text-indigo-700';
    return 'bg-gray-100 text-gray-600';
  };

  // Fonction pour formater les clés de manière lisible
  const formatKey = (key) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .replace(/^[a-z]/, (c) => c.toUpperCase());
  };

  // render arbitrary value nicely in JSX (for details column)
  const renderDetails = (val, depth = 0) => {
    // Gestion des valeurs null/undefined
    if (val === null || val === undefined) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-gray-500 italic text-xs">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          {t('Non renseigné')}
        </span>
      );
    }

    // Gestion des booléens
    if (typeof val === 'boolean') {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${val ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-green-500' : 'bg-red-500'}`} />
          {val ? t('Oui') : t('Non')}
        </span>
      );
    }

    // Gestion des nombres
    if (typeof val === 'number') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-mono">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          {val}
        </span>
      );
    }

    // Gestion des chaînes de caractères
    if (typeof val === 'string') {
      // Ignorer les chaînes vides
      if (val.trim() === '') {
        return (
          <span className="text-gray-400 italic text-xs">{t('Chaîne vide')}</span>
        );
      }

      // Détecter si c'est une date ISO
      const isDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(val);
      if (isDate) {
        try {
          const date = new Date(val);
          return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {date.toLocaleString('fr-FR')}
            </span>
          );
        } catch {
          return <span className="text-gray-700 text-xs">{val}</span>;
        }
      }
      
      // Détecter si c'est une URL
      if (val.startsWith('http://') || val.startsWith('https://')) {
        return (
          <a href={val} target="_blank" rel="noopener noreferrer" 
             className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs hover:bg-blue-100 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {val.length > 30 ? val.substring(0, 30) + '...' : val}
          </a>
        );
      }

      // Détection des noms (mots avec espaces ou accents)
      const hasLetters = /[a-zA-ZÀ-ÿ]/.test(val);
      const hasSpaces = val.includes(' ');
      
      if (hasLetters && (hasSpaces || val.length > 3)) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {val}
          </span>
        );
      }

      return <span className="text-gray-700 text-xs">{val}</span>;
    }

    // Gestion des tableaux
    if (Array.isArray(val)) {
      if (val.length === 0) {
        return (
          <span className="text-gray-400 italic text-xs">{t('Tableau vide')}</span>
        );
      }

      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-500">Tableau ({val.length} élément{val.length > 1 ? 's' : ''})</span>
          </div>
          <div className="space-y-2">
            {val.map((v, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-2">
                <div className="text-xs text-gray-400 mb-1">Élément #{i + 1}</div>
                {renderDetails(v, depth + 1)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Gestion des objets
    if (typeof val === 'object') {
      const entries = Object.entries(val);
      
      if (entries.length === 0) {
        return (
          <span className="text-gray-400 italic text-xs">{t('Objet vide')}</span>
        );
      }

      // Détecter si c'est une entité avec un nom
      const nameKeys = ['nom_lecteur', 'lecteur_nom', 'titre_livre', 'livre_titre', 'nom_utilisateur', 'user_name', 'nom', 'name', 'titre', 'title'];
      const hasName = entries.some(([k]) => nameKeys.includes(k));

      return (
        <div className="space-y-2">
          {hasName && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-green-600">{t('Détails')}</span>
            </div>
          )}
          <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-hidden">
            {entries.map(([k, v]) => {
              // Ignorer certains champs techniques
              if (k === 'id' || k.endsWith('_id') || k.includes('Id')) return null;
              
              return (
                <div key={k} className="flex hover:bg-gray-50 transition-colors">
                  <div className="w-1/3 px-3 py-2 bg-gray-50 text-xs font-medium text-gray-600 border-r border-gray-200">
                    {formatKey(k)}
                  </div>
                  <div className="w-2/3 px-3 py-2 text-xs">
                    {renderDetails(v, depth + 1)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return <span className="text-gray-700 text-xs">{String(val)}</span>;
  };

  return (
    <div className="card w-full bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden">
      {/* En-tête avec dégradé */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl filter drop-shadow-lg">📊</span>
            <span className="tracking-tight">Journal d'activités</span>
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full ml-2">
              {displayed.length} entrée{displayed.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={fetchLogs}
              className="ml-2 text-white hover:text-gray-200 transition-colors"
              title="Rafraîchir"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582M20 20v-5h-.581M5.64 5.64a9 9 0 0112.72 0M18.36 18.36a9 9 0 01-12.72 0" />
              </svg>
            </button>
          </h2>

          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Rechercher une action, un détail..."
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/95 border-0 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400 text-gray-900"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {filter && (
                <button
                  onClick={() => setFilter('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <ExportButton 
                endpoint="/activities" 
                filename="activites.pdf" 
                label="PDF" 
                format="pdf"
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              />
              <ExportButton 
                endpoint="/activities" 
                filename="activites.csv" 
                label="CSV" 
                format="csv"
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tableau responsive */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Date
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Action
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Détails
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displayed.map((l, i) => {
              const parsedDetails = parseDetails(l.details);
              const hasDetails = parsedDetails !== null && parsedDetails !== undefined && 
                                !(typeof parsedDetails === 'string' && parsedDetails.trim() === '') &&
                                !(typeof parsedDetails === 'object' && Object.keys(parsedDetails).length === 0);
              const isExpanded = expandedRows[i];

              return (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatDate(l.createdAt || l.created_at || l.date || l.updatedAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {l.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {hasDetails ? (
                      <div className="max-w-md">
                        {/* Aperçu compact */}
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-1 rounded-md ${getValueTypeColor(parsedDetails)}`}>
                            {Array.isArray(parsedDetails) ? `Tableau (${parsedDetails.length})` : 
                             typeof parsedDetails === 'object' ? `Détails (${Object.keys(parsedDetails).length})` :
                             typeof parsedDetails === 'string' ? parsedDetails.substring(0, 30) + (parsedDetails.length > 30 ? '...' : '') :
                             typeof parsedDetails}
                          </span>
                          <button
                            onClick={() => toggleRow(i)}
                            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                          >
                            {isExpanded ? (
                              <>{t('Masquer')} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg></>
                            ) : (
                              <>{t('Voir détails')} <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></>
                            )}
                          </button>
                        </div>
                        
                        {/* Détails complets avec noms */}
                        {isExpanded && (
                          <div className="mt-2 bg-gray-50 rounded-lg p-3 border border-gray-200">
                            <div className="max-h-96 overflow-y-auto">
                              {renderDetails(parsedDetails)}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-400 italic">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        Aucun détail
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {displayed.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg font-medium">{t('Aucune activité trouvée')}</p>
                    <p className="text-sm">{t('Les nouvelles activités apparaîtront ici')}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pied de tableau optionnel */}
      {displayed.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Affichage de {displayed.length} activité{displayed.length !== 1 ? 's' : ''}
            {filter && ` (filtré${displayed.length !== 1 ? 'es' : ''})`}
          </p>
        </div>
      )}
    </div>
  );
}