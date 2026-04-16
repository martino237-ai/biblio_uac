// list of faculties and their corresponding filieres (majors) used throughout the app

export const FACULTIES = {
  "ISSS": [
    "Sciences infirmières",
    "Maïeutique (sage-femme)",
    "Biologie clinique"
  ],
  "Gestion et Informatique": [
    "Comptabilité et Finance",
    "Management",
    "Monnaie-Banque-Finance",
    "Gestion des Ressources Humaines",
    "Génie logiciel",
    "Système d'information",
    "Réseaux"
  ],
  "Sciences de l'Éducation": [
    "Didactique - Français",
    "Didactique - Anglais",
    "Didactique - Espagnol",
    "Didactique - Mathématiques",
    "Didactique - Biologie",
    "Didactique - Physique-Chimie",
    "Didactique - Histoire-géographie",
    "Psychopédagogie",
    "Administration et Planification éducative"
  ],
  "Théologie": [
    "Licence en théologie",
    "Master en théologie"
  ],
  "Droit": [
    "Capacité en Droit"
  ]
};

export const FACULTY_OPTIONS = Object.keys(FACULTIES);

export function getFiliereOptions(faculty) {
  return FACULTIES[faculty] || [];
}
