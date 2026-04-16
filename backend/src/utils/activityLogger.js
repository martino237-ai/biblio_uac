const { Activity } = require('../models');

/**
 * Enregistre une activité dans la base (sans bloquer la requête principale).
 * @param {number|null} userId - ID de l'utilisateur à lier (peut être null)
 * @param {string} action - Description courte de l'action
 * @param {object} [details] - Objet supplémentaire (sera JSON.stringify)
 * @returns {Promise<void>}
 */
async function logActivity(userId, action, details = {}) {
  try {
    await Activity.create({
      utilisateur_id: userId || null,
      action,
      details: JSON.stringify(details)
    });
  } catch (err) {
    console.error('⚠️ échec logActivity', err);
  }
}

module.exports = { logActivity };
