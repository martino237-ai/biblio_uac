const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {

  getAllReaders,
  getReaderById,
  createReader,
  updateReader,
  deleteReader,
  searchReaders, 
    // ✅ ajouté
} = require("../controllers/readerController");

// don't require auth for creating a reader (self‑registration)
router.post("/", createReader);

// all other operations require authentication
router.use(authenticateToken);

router.get("/", getAllReaders);
router.get("/search",searchReaders);  // ✅ route ajoutée
router.get("/:id", getReaderById);
router.put("/:id", updateReader);
router.delete("/:id",deleteReader);

module.exports = router;
