const express = require("express");
const { mergeCSV } = require("../controllers/MergeCsv/mergecsv");
const {
  checkTempalte,
  getTableData,
  getTableHeaders,
} = require("../controllers/MergeCsv/checkTemplate");
const { checkDuplicates } = require("../controllers/MergeCsv/checkDuplicate");
const router = express.Router();

router.post("/mergecsv", mergeCSV);
router.post("/checkmergecsv", checkTempalte);
router.get("/gettabledata/:tableName", getTableHeaders);
// router.get("/gettabledata/:tableName", getTableHeaders);
router.post("/checkduplicates",checkDuplicates)

module.exports = router;
