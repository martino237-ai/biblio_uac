const { Sequelize, Op } = require('sequelize');
const { Book, Loan, Consultation, Reader, sequelize } = require('../models');

const safe = (v) => (v == null ? 0 : Number(v));

/* =========================================================
   1️⃣ RÉSUMÉ GLOBAL (CE QUE TU UTILISES DÉJÀ)
========================================================= */
const summary = async (req, res) => {
  try {
    const start = req.query.start;
    const end = req.query.end;
    const loanWhere = {};
    const consultWhere = {};

    console.log('[stats.summary] query', { start, end, params: req.query });

    if (start && end) {
      loanWhere.date_emprunt = { [Op.between]: [new Date(start), new Date(end)] };
      consultWhere.heure_debut = { [Op.between]: [new Date(start), new Date(end)] };
    }

    const [booksCount, readersCount, loansCount, consultationsCount] =
      await Promise.all([
        Book.count(),
        Reader.count(),
        Loan.count({ where: loanWhere }),
        Consultation.count({ where: consultWhere }),
      ]);

    console.log('[stats.summary] counts', { booksCount, readersCount, loansCount, consultationsCount });

    // compute number of distinct readers/books that had activity
    // the `loanWhere`/`consultWhere` objects already include dates if provided
    let activeReadersCount = 0;
    let activeBooksCount = 0;

    const loanIds = await Loan.findAll({
      attributes: ['lecteur_id','livre_id'],
      where: loanWhere,
      raw: true,
    });
    const consultIds = await Consultation.findAll({
      attributes: ['lecteur_id','livre_id'],
      where: consultWhere,
      raw: true,
    });
    const readerSet = new Set();
    const bookSet = new Set();
    loanIds.forEach(r => {
      if (r.lecteur_id) readerSet.add(r.lecteur_id);
      if (r.livre_id) bookSet.add(r.livre_id);
    });
    consultIds.forEach(r => {
      if (r.lecteur_id) readerSet.add(r.lecteur_id);
      if (r.livre_id) bookSet.add(r.livre_id);
    });
    activeReadersCount = readerSet.size;
    activeBooksCount = bookSet.size;

    const whereSql = start && end ?
      ` AND heure_debut BETWEEN :start AND :end` : '';

    const totalConsultSeconds = await sequelize.query(
      `SELECT COALESCE(SUM(TIMESTAMPDIFF(SECOND, heure_debut, heure_fin)),0) AS secs 
       FROM consultations WHERE heure_fin IS NOT NULL ${whereSql}`,
      { type: Sequelize.QueryTypes.SELECT,
        replacements: start && end ? { start, end } : {} }
    );

    const secs = safe(totalConsultSeconds[0].secs);
    const hours = +(secs / 3600).toFixed(2);

    const lateCount = await Loan.count({ where: { ...loanWhere, statut: "en_retard" } });
    
    const prolongedLoansCount = await Loan.count({ 
      where: { ...loanWhere, prolongations: { [Op.gt]: 0 } } 
    });

    res.json({
      books: booksCount,
      readers: readersCount,
      loans: loansCount,
      consultations: consultationsCount,
      consultation_hours: hours,
      late: lateCount,
      prolonged_loans: prolongedLoansCount,
      // make sure we always send numeric values
      active_readers: activeReadersCount || 0,
      active_books: activeBooksCount || 0
    });
  } catch (err) {
    console.error("❌ stats.summary", err);
    res.status(500).json({ error: "Erreur statistiques - summary" });
  }
};

/* =========================================================
   2️⃣ TOP LIVRES (déjà chez toi — conservé)
========================================================= */
const topBooks = async (req, res) => {
  try {
    const start = req.query.start;
    const end = req.query.end;
    const loanWhere = {};
    const consultWhere = {};
    if (start && end) {
      loanWhere.date_emprunt = { [Op.between]: [new Date(start), new Date(end)] };
      consultWhere.heure_debut = { [Op.between]: [new Date(start), new Date(end)] };
    }

    const topLoans = await Loan.findAll({
      attributes: [
        "livre_id",
        [Sequelize.fn("COUNT", Sequelize.col("livre_id")), "cnt"],
      ],
      where: loanWhere,
      group: ["livre_id"],
      order: [[Sequelize.literal("cnt"), "DESC"]],
      limit: 10,
      raw: true,
    });

    const topConsults = await Consultation.findAll({
      attributes: [
        "livre_id",
        [Sequelize.fn("COUNT", Sequelize.col("livre_id")), "cnt"],
      ],
      where: consultWhere,
      group: ["livre_id"],
      order: [[Sequelize.literal("cnt"), "DESC"]],
      limit: 10,
      raw: true,
    });

    const map = new Map();

    topLoans.forEach((t) =>
      map.set(
        String(t.livre_id),
        (map.get(String(t.livre_id)) || 0) + Number(t.cnt || 0)
      )
    );

    topConsults.forEach((t) =>
      map.set(
        String(t.livre_id),
        (map.get(String(t.livre_id)) || 0) + Number(t.cnt || 0)
      )
    );

    const combined = Array.from(map.entries())
      .map(([livre_id, total]) => ({
        livre_id: Number(livre_id),
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const bookIds = combined.map((x) => x.livre_id);
    const books = await Book.findAll({ where: { id: bookIds } });

    const bookById = {};
    books.forEach((b) => (bookById[b.id] = b));

    const result = combined.map((c) => ({
      livre_id: c.livre_id,
      titre: bookById[c.livre_id]?.titre || null,
      code: bookById[c.livre_id]?.code || null,
      total: c.total,
    }));

    res.json({ topLoans, topConsults, topCombined: result });
  } catch (err) {
    console.error("❌ stats.topBooks", err);
    res.status(500).json({ error: "Erreur statistiques - top-books" });
  }
};

/* =========================================================
   3️⃣ TOP LECTEURS (déjà chez toi — conservé)
========================================================= */
const topReaders = async (req, res) => {
  try {
    const start = req.query.start;
    const end = req.query.end;
    const loanWhere = {};
    const consultWhere = {};
    if (start && end) {
      loanWhere.date_emprunt = { [Op.between]: [new Date(start), new Date(end)] };
      consultWhere.heure_debut = { [Op.between]: [new Date(start), new Date(end)] };
    }

    const loansByReader = await Loan.findAll({
      attributes: [
        "lecteur_id",
        [Sequelize.fn("COUNT", Sequelize.col("lecteur_id")), "cnt"],
      ],
      where: loanWhere,
      group: ["lecteur_id"],
      raw: true,
    });

    const consultsByReader = await Consultation.findAll({
      attributes: [
        "lecteur_id",
        [Sequelize.fn("COUNT", Sequelize.col("lecteur_id")), "cnt"],
      ],
      where: consultWhere,
      group: ["lecteur_id"],
      raw: true,
    });

    const map = new Map();

    loansByReader.forEach((r) => {
      if (r.lecteur_id)
        map.set(
          String(r.lecteur_id),
          (map.get(String(r.lecteur_id)) || 0) + Number(r.cnt || 0)
        );
    });

    consultsByReader.forEach((r) => {
      if (r.lecteur_id)
        map.set(
          String(r.lecteur_id),
          (map.get(String(r.lecteur_id)) || 0) + Number(r.cnt || 0)
        );
    });

    const combined = Array.from(map.entries())
      .map(([lecteur_id, total]) => ({
        lecteur_id: Number(lecteur_id),
        total,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    const ids = combined.map((c) => c.lecteur_id);
    const readers = await Reader.findAll({ where: { id: ids } });

    const readerById = {};
    readers.forEach((r) => (readerById[r.id] = r));

    const result = combined.map((c) => ({
      lecteur_id: c.lecteur_id,
      nom: readerById[c.lecteur_id]?.nom || null,
      prenom: readerById[c.lecteur_id]?.prenom || null,
      matricule: readerById[c.lecteur_id]?.matricule || null,
      total: c.total,
    }));

    res.json({ topReaders: result });
  } catch (err) {
    console.error("❌ stats.topReaders", err);
    res.status(500).json({ error: "Erreur statistiques - top-readers" });
  }
};

/* =========================================================
   4️⃣ RÉPARTITION FACULTÉ / FILIÈRE / NIVEAU (déjà là)
========================================================= */
const faculties = async (req, res) => {
  try {
    // allow optional date range: only count readers who had a loan or consultation in period
    const start = req.query.start;
    const end = req.query.end;
    let readerWhere = {};

    if (start && end) {
      // gather unique reader ids from loans and consultations
      const loanIds = await Loan.findAll({
        attributes: ['lecteur_id'],
        where: { date_emprunt: { [Op.between]: [new Date(start), new Date(end)] } },
        raw: true,
      });
      const consultIds = await Consultation.findAll({
        attributes: ['lecteur_id'],
        where: { heure_debut: { [Op.between]: [new Date(start), new Date(end)] } },
        raw: true,
      });
      const idsSet = new Set();
      loanIds.forEach(r => idsSet.add(r.lecteur_id));
      consultIds.forEach(r => idsSet.add(r.lecteur_id));
      if (idsSet.size === 0) {
        return res.json({ byFaculty: [], byFiliere: [], byNiveau: [] });
      }
      readerWhere.id = [...idsSet];
    }

    const byFaculty = await Reader.findAll({
      attributes: [
        "faculte",
        [Sequelize.fn("COUNT", Sequelize.col("faculte")), "cnt"],
      ],
      where: readerWhere,
      group: ["faculte"],
      order: [[Sequelize.literal("cnt"), "DESC"]],
      raw: true,
    });

    const byFiliere = await Reader.findAll({
      attributes: [
        "filiere",
        [Sequelize.fn("COUNT", Sequelize.col("filiere")), "cnt"],
      ],
      where: readerWhere,
      group: ["filiere"],
      order: [[Sequelize.literal("cnt"), "DESC"]],
      raw: true,
    });

    const byNiveau = await Reader.findAll({
      attributes: [
        "niveau",
        [Sequelize.fn("COUNT", Sequelize.col("niveau")), "cnt"],
      ],
      where: readerWhere,
      group: ["niveau"],
      order: [[Sequelize.literal("cnt"), "DESC"]],
      raw: true,
    });

    res.json({ byFaculty, byFiliere, byNiveau });
  } catch (err) {
    console.error("❌ stats.faculties", err);
    res.status(500).json({ error: "Erreur statistiques - faculties" });
  }
};

/* =========================================================
   5️⃣ TENDANCES (déjà chez toi)
========================================================= */
const trends = async (req, res) => {
  try {
    const type =
      req.query.type === "consultations" ? "consultations" : "loans";
    const period =
      req.query.period === "monthly" ? "monthly" : "daily";
    const limit = Math.min(
      365,
      parseInt(req.query.limit || "30", 10)
    );

    const start = req.query.start;
    const end = req.query.end;

    let dateFormat, groupExpr;

    if (period === "daily") {
      dateFormat = "%Y-%m-%d";
      groupExpr = `DATE(${
        type === "loans" ? "date_emprunt" : "heure_debut"
      })`;
    } else {
      dateFormat = "%Y-%m";
      groupExpr = `DATE_FORMAT(${
        type === "loans" ? "date_emprunt" : "heure_debut"
      },'%Y-%m-01')`;
    }

    // build optional where clause if a date range is provided
    let whereClause = '';
    const replacements = { limit };
    if (start && end) {
      const field = type === "loans" ? "date_emprunt" : "heure_debut";
      whereClause = ` WHERE ${field} BETWEEN :start AND :end`;
      replacements.start = start;
      replacements.end = end;
    }

    const sql = `
      SELECT DATE_FORMAT(${groupExpr}, '${dateFormat}') as period,
             COUNT(*) AS cnt
      FROM ${type}
      ${whereClause}
      GROUP BY period
      ORDER BY period DESC
      LIMIT :limit
    `;

    const rows = await sequelize.query(sql, {
      replacements,
      type: Sequelize.QueryTypes.SELECT,
    });

    rows.reverse();
    res.json(rows);
  } catch (err) {
    console.error("❌ stats.trends", err);
    res.status(500).json({ error: "Erreur statistiques - trends" });
  }
};

/* =========================================================
   ✅ NOUVELLES FONCTIONS QUE TU VOULAIS AJOUTER
========================================================= */

/* --------- STATS PAR FILIÈRE & FACULTÉ --------- */
const getStatsByFiliereFaculte = async (req, res) => {
  try {
    const consultationsParFiliere = await Consultation.findAll({
      attributes: [
        [sequelize.col("Reader.filiere"), "filiere"],
        [sequelize.fn("COUNT", sequelize.col("Consultation.id")), "count"],
      ],
      include: [{ model: Reader, as: 'Reader', attributes: [] }],
      where: {
        "$Reader.filiere$": { [Op.ne]: null },
      },
      group: ["Reader.filiere"],
      raw: true,
    });

    const empruntsParFiliere = await Loan.findAll({
      attributes: [
        [sequelize.col("Reader.filiere"), "filiere"],
        [sequelize.fn("COUNT", sequelize.col("Loan.id")), "count"],
      ],
      include: [{ model: Reader, as: 'Reader', attributes: [] }],
      where: {
        "$Reader.filiere$": { [Op.ne]: null },
      },
      group: ["Reader.filiere"],
      raw: true,
    });

    // counts by faculty
    const consultationsParFaculte = await Consultation.findAll({
      attributes: [
        [sequelize.col("Reader.faculte"), "faculte"],
        [sequelize.fn("COUNT", sequelize.col("Consultation.id")), "count"],
      ],
      include: [{ model: Reader, as: 'Reader', attributes: [] }],
      where: {
        "$Reader.faculte$": { [Op.ne]: null },
      },
      group: ["Reader.faculte"],
      raw: true,
    });

    const empruntsParFaculte = await Loan.findAll({
      attributes: [
        [sequelize.col("Reader.faculte"), "faculte"],
        [sequelize.fn("COUNT", sequelize.col("Loan.id")), "count"],
      ],
      include: [{ model: Reader, as: 'Reader', attributes: [] }],
      where: {
        "$Reader.faculte$": { [Op.ne]: null },
      },
      group: ["Reader.faculte"],
      raw: true,
    });

    const filieres = await Reader.findAll({
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("filiere")), "filiere"],
      ],
      raw: true,
    });

    res.json({
      success: true,
      data: {
        consultationsParFiliere,
        empruntsParFiliere,
        consultationsParFaculte,
        empruntsParFaculte,
        filieres: filieres.map((f) => f.filiere).filter(Boolean),
      },
    });
  } catch (err) {
    console.error("❌ getStatsByFiliereFaculte", err);
    res.status(500).json({ error: err.message });
  }
};

/* --------- STATS GÉNÉRALES --------- */
const getGeneralStats = async (req, res) => {
  try {
    const totals = {
      readers: await Reader.count(),
      loans: await Loan.count(),
      consultations: await Consultation.count(),
    };

    res.json({
      success: true,
      data: { totals },
    });
  } catch (err) {
    console.error("❌ getGeneralStats", err);
    res.status(500).json({ error: err.message });
  }
};

/* --------- EXPORT STATS --------- */
const getExportStats = async (req, res) => {
  try {
    const stats = await sequelize.query(
      `SELECT r.filiere, COUNT(r.id) as lecteurs
       FROM readers r
       GROUP BY r.filiere`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    res.json({ success: true, data: stats });
  } catch (err) {
    console.error("❌ getExportStats", err);
    res.status(500).json({ error: err.message });
  }
};

/* --------- STATS PAR PÉRIODE --------- */
const getStatsByPeriod = async (req, res) => {
  try {
    res.json({
      success: true,
      message: "Fonction prête (adapter plus tard si besoin)",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// =============================
// CONSULTATIONS PAR HEURE
// =============================
const hourlyConsults = async (req, res) => {
  try {
    const start = req.query.start;
    const end = req.query.end;
    let where = "WHERE heure_fin IS NOT NULL";
    const repl = {};
    if (start && end) {
      where += " AND heure_debut BETWEEN :start AND :end";
      repl.start = start;
      repl.end = end;
    }
    const rows = await sequelize.query(`
      SELECT 
        HOUR(heure_debut) as hour,
        COUNT(*) as count,
        ROUND(AVG(TIMESTAMPDIFF(MINUTE, heure_debut, heure_fin)), 1) as avg_duration
      FROM consultations
      ${where}
      GROUP BY HOUR(heure_debut)
      ORDER BY hour ASC;
    `, { replacements: repl, type: Sequelize.QueryTypes.SELECT });

    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur hourly-consults :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
const monthlyConsults = async (req, res) => {
  try {
    const start = req.query.start;
    const end = req.query.end;
    let where = "WHERE heure_fin IS NOT NULL";
    const repl = {};
    if (start && end) {
      where += " AND heure_debut BETWEEN :start AND :end";
      repl.start = start;
      repl.end = end;
    }
    const rows = await sequelize.query(`
      SELECT 
        DATE_FORMAT(heure_debut, '%Y-%m') as month,
        ROUND(SUM(TIMESTAMPDIFF(HOUR, heure_debut, heure_fin)), 2) as hours
      FROM consultations
      ${where}
      GROUP BY month
      ORDER BY month ASC;
    `, { replacements: repl, type: Sequelize.QueryTypes.SELECT });

    res.json(rows);
  } catch (err) {
    console.error("❌ Erreur monthly-consults :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};



/* =========================================================
   ✅ EXPORT FINAL
========================================================= */
module.exports = {
  summary,
  topBooks,
  topReaders,
  faculties,
  trends,
  getStatsByFiliereFaculte,
  getGeneralStats,
  getExportStats,
  getStatsByPeriod,
  hourlyConsults,
  monthlyConsults
};
