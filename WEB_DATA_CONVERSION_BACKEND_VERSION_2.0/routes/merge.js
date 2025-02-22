const express = require("express");
const { mergeCSV } = require("../controllers/MergeCsv/mergecsv");
const {
  checkTempalte,
  getTableData,
  getTableHeaders,
} = require("../controllers/MergeCsv/checkTemplate");
const { checkDuplicates } = require("../controllers/MergeCsv/checkDuplicate");
const { viewDuplicates } = require("../controllers/MergeCsv/viewDuplicates");
const router = express.Router();

router.post("/mergecsv", mergeCSV);
router.post("/checkmergecsv", checkTempalte);
router.get("/gettabledata/:templateId", getTableHeaders);
// router.get("/gettabledata/:tableName", getTableHeaders);
router.post("/checkduplicates",checkDuplicates);
router.post("/viewDuplicates",viewDuplicates)

module.exports = router;
