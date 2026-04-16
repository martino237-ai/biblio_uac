const { Activity } = require('../models');

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.findAll({
      order: [['id', 'DESC']],
      limit: 100
    });
    res.json(activities);
  } catch (err) {
    console.error('getActivities error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.logActivity = async (req, res) => {
  try {
    const { utilisateur_id, action, details } = req.body;
    const activity = await Activity.create({
      utilisateur_id,
      action,
      details: JSON.stringify(details)
    });
    res.status(201).json(activity);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    await Activity.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Activity deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
