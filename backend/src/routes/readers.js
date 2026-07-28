const express = require("express");
const router = express.Router();
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getAllReaders,
  getReaderById,
  getCurrentReader,
  getReaderLoans,
  getReaderConsultations,
  createReader,
  updateReader,
  deleteReader,
  searchReaders,
  lookupReaderByMatricule,
  importReaders,
} = require("../controllers/readerController");

// don't require auth for creating a reader (self‑registration)
router.post("/", createReader);
// don't require auth: used during signup to identify a reader already created
// by a librarian (or a previous partial registration) via their matricule
router.get("/lookup/:matricule", lookupReaderByMatricule);

// all other operations require authentication
router.use(authenticateToken);

router.get("/", getAllReaders);
router.get("/search",searchReaders);  // ✅ route ajoutée
router.post("/import", requireRole(['bibliothecaire', 'directeur']), importReaders);
router.get("/me", getCurrentReader);
router.get("/:id/loans", getReaderLoans);
router.get("/:id/consultations", getReaderConsultations);
router.get("/:id", getReaderById);
router.put("/:id", updateReader);
router.delete("/:id",deleteReader);

module.exports = router;
