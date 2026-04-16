import React from "react";
import Modal from "../shared/Modal";

export default function ReaderDetailsPanel({ reader, onClose }) {
  if (!reader) return null;

  return (
    <Modal title="👤 Détails du lecteur" onClose={onClose}>
      <div className="p-4 space-y-4">

        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-600">
          <h2 className="text-xl font-bold text-blue-900">
            {reader.nom} {reader.prenom}
          </h2>
          <p className="text-gray-600">
            Matricule : <strong>{reader.matricule || "—"}</strong>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
          <p><strong>Type :</strong> {reader.type}</p>
          <p><strong>Email :</strong> {reader.email || "—"}</p>
          <p><strong>Filière :</strong> {reader.filiere || "—"}</p>
          <p><strong>Date d'inscription :</strong> {reader.date_inscription ? new Date(reader.date_inscription).toLocaleDateString() : "—"}</p>
          <p><strong>Niveau :</strong> {reader.niveau || "—"}</p>
          <p><strong>Téléphone :</strong> {reader.telephone || "—"}</p>
          <p><strong>Créé le :</strong> {reader.createdAt ? new Date(reader.createdAt).toLocaleString() : "—"}</p>
          <p><strong>Mise à jour :</strong> {reader.updatedAt ? new Date(reader.updatedAt).toLocaleString() : "—"}</p>
        </div>

        <div className="text-right mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded-lg"
            onClick={onClose}
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}
