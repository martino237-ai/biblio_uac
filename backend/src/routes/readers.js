const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
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
} = require("../controllers/readerController");

// don't require auth for creating a reader (self‑registration)
router.post("/", createReader);

// all other operations require authentication
router.use(authenticateToken);

router.get("/", getAllReaders);
router.get("/search",searchReaders);  // ✅ route ajoutée
router.get("/me", getCurrentReader);
router.get("/:id/loans", getReaderLoans);
router.get("/:id/consultations", getReaderConsultations);
router.get("/:id", getReaderById);
router.put("/:id", updateReader);
router.delete("/:id",deleteReader);

module.exports = router;
