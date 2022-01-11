const express = require("express");
const protect = require("../middlewares/protect");
const category = require("../controllers/category.controller.js");

const router = express.Router();

router.use(protect);

// get monthly statistics for categories by type
router.get("/stats/year/:year/month/:month/type/:type", category.getCategoryStats);
router.route("/").post(category.addCategory).get(category.getCategories);
router
  .route("/:id")
  .get(category.getCategory)
  .put(category.updateCategory)
  .delete(category.deleteCategory);

module.exports = router;
