const express = require("express");
const { mergeCSV } = require("../controllers/MergeCsv/mergecsv");
const { checkTempalte, getTableData } = require("../controllers/MergeCsv/checkTemplate");
const router = express.Router();

router.post('/mergecsv',mergeCSV );
router.post('/checkmergecsv',checkTempalte );
router.get("/gettabledata/:tableName", getTableData);

module.exports = router;
