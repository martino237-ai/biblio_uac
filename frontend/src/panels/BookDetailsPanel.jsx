// frontend/src/panels/BookDetailsPanel.jsx
import React from "react";
import { useTranslation } from 'react-i18next';
import Modal from "../shared/Modal";
import "../styles/details.css";

export default function BookDetailsPanel({ book, onClose }) {
  const { t } = useTranslation();
  if (!book) return null;

  const disponible = book.exemplaires_disponibles > 0;

  return (
    <Modal title={book.type_ouvrage === 'périodique' ? "📰 Fiche détaillée du périodique" : "📚 Fiche détaillée du livre"} onClose={onClose}>
      <div className="book-details-wrapper">

        {/* ===== EN-TÊTE DE LA NOTICE ===== */}
        <div className="book-top-banner">
          <div>
            <h2 className="book-title">{book.titre}</h2>
            <p className="book-subtitle">Code : <strong>{book.code}</strong></p>
          </div>

          <span className={`status-badge ${disponible ? "ok" : "no"}`}>
            {disponible ? t('Disponible') : t('Indisponible')}
          </span>
        </div>

        {/* ===== INFORMATIONS PRINCIPALES ===== */}
        <div className="book-info-grid">

          <div className="book-card">
            <h4>👤 Auteur</h4>
            <p>{book.auteur || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>🏷️ Éditeur</h4>
            <p>{book.editeur || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>📅 Année de publication</h4>
            <p>{book.annee_publication || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>📘 Édition</h4>
            <p>{book.edition || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>🌐 Langue</h4>
            <p>{book.langue || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>📖 Nombre de pages</h4>
            <p>{book.nombre_pages || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>🏷️ Genre</h4>
            <p>{book.genre || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>📋 Type d'ouvrage</h4>
            <p>{book.type_ouvrage || "Non renseigné"}</p>
          </div>

          {book.type_ouvrage === 'périodique' && (
            <>
              <div className="book-card col-span-2">
                <h4 className="section-title">📰 Notice bibliographique</h4>
              </div>

              <div className="book-card">
                <h4>🆔 ISSN</h4>
                <p>{book.issn || "Non renseigné"}</p>
              </div>

              <div className="book-card">
                <h4>⏰ Fréquence</h4>
                <p>{book.frequency || "Non renseigné"}</p>
              </div>

              <div className="book-card col-span-2">
                <h4 className="section-title">📦 Numéro reçu</h4>
              </div>

              <div className="book-card">
                <h4>📚 Volume</h4>
                <p>{book.volume_number || "Non renseigné"}</p>
              </div>

              <div className="book-card">
                <h4>📄 Numéro</h4>
                <p>{book.issue_number || "Non renseigné"}</p>
              </div>

              <div className="book-card">
                <h4>📅 Date de publication</h4>
                <p>{book.issue_date || "Non renseigné"}</p>
              </div>
            </>
          )}

          <div className="book-card">
            <h4>🔧 État</h4>
            <p>{book.etat === 'disponible' ? 'Disponible' : book.etat === 'reparation' ? 'En réparation' : "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>🏷️ Thème</h4>
            <p>{book.theme || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>🔖 Date de création</h4>
            <p>{book.createdAt ? new Date(book.createdAt).toLocaleString() : "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>🛠️ Dernière mise à jour</h4>
            <p>{book.updatedAt ? new Date(book.updatedAt).toLocaleString() : "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>📍 Emplacement</h4>
            <p>{book.emplacement || "Non renseigné"}</p>
          </div>

          <div className="book-card">
            <h4>📅 Date d'acquisition</h4>
            <p>{book.date_acquisition || "Non renseigné"}</p>
          </div>

          <div className="book-card highlight">
            <h4>📚 Exemplaires</h4>
            <p className="ex-count">
              {book.exemplaires_disponibles} / {book.total_exemplaires}
            </p>
          </div>

        </div>

        {/* ===== MOTS-CLÉS ===== */}
        {book.mots_cles && (
          <div className="book-description-section">
            <h4>🔑 Mots-clés</h4>
            <div className="book-desc-box">
              {book.mots_cles}
            </div>
          </div>
        )}

        {/* ===== RÉSUMÉ ===== */}
        {book.resume && (
          <div className="book-description-section">
            <h4>📝 Résumé</h4>
            <div className="book-desc-box">
              {book.resume}
            </div>
          </div>
        )}

        {/* ===== DESCRIPTION ===== */}
        <div className="book-description-section">
          <h4>📝 Description</h4>
          <div className="book-desc-box">
            {book.description || (book.type_ouvrage === 'périodique' ? "Aucune description disponible pour ce périodique." : "Aucune description disponible pour ce livre.")}
          </div>
        </div>

        {/* ===== ACTION ===== */}
        <div className="book-footer">
          <button className="btn outline" onClick={onClose}>
            Fermer
          </button>
        </div>

      </div>
    </Modal>
  );
}
