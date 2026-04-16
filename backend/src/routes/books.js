const express = require("express");
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  searchBooks,   // ✅
} = require("../controllers/bookController");

// toutes les routes nécessitent une authentification
router.use(authenticateToken);


router.get("/", getAllBooks);
router.get("/search", searchBooks);  // ✅ route ajoutée
router.get("/:id", getBookById);
router.post("/", createBook);
router.put("/:id", updateBook);
router.delete("/:id", deleteBook);

module.exports = router;
