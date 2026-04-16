const { Book, Loan, Consultation, Reader } = require('../models');
const { Op } = require('sequelize');

// livres sans exemplaires disponibles
exports.stockEmpty = async (req, res) => {
  try {
    const books = await Book.findAll({
      where: { exemplaires_disponibles: { [Op.lte]: 0 } },
      order: [['titre','ASC']]
    });
    res.json(books);
  } catch (err) {
    console.error('alertController.stockEmpty', err);
    res.status(500).json({ error: 'Impossible de récupérer le stock vide' });
  }
};

// emprunts en retard (non rendus et date prévue dépassée)
exports.loansOverdue = async (req, res) => {
  try {
    const today = new Date();
    // mettre à jour le statut des emprunts dépassés
    await Loan.update(
      { statut: 'en_retard' },
      {
        where: {
          statut: 'emprunte',
          date_retour_prevue: { [Op.lt]: today }
        }
      }
    );

    const loans = await Loan.findAll({
      where: {
        statut: { [Op.ne]: 'retourne' },
        date_retour_prevue: { [Op.lt]: today }
      },
      include: [
        { model: Reader, as: 'Reader', attributes: ['id','nom','prenom','matricule'] },
        { model: Book, as: 'Book', attributes: ['id','titre','code'] }
      ],
      order: [['date_retour_prevue','ASC']]
    });
    res.json(loans);
  } catch (err) {
    console.error('alertController.loansOverdue', err);
    res.status(500).json({ error: 'Impossible de récupérer les emprunts en retard' });
  }
};

// consultations ouvertes depuis plus de 2h
exports.consultsOverdue = async (req, res) => {
  try {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const consults = await Consultation.findAll({
      where: {
        heure_fin: null,
        heure_debut: { [Op.lt]: twoHoursAgo }
      },
      include: [
        { model: Reader, as: 'Reader', attributes: ['id','nom','prenom','matricule'] },
        { model: Book, as: 'Book', attributes: ['id','titre','code'] }
      ],
      order: [['heure_debut','ASC']]
    });
    res.json(consults);
  } catch (err) {
    console.error('alertController.consultsOverdue', err);
    res.status(500).json({ error: 'Impossible de récupérer les consultations en retard' });
  }
};
