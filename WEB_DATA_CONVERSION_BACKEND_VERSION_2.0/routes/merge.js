const express = require("express");
const { mergeCSV } = require("../controllers/MergeCsv/mergecsv");
const { checkTempalte, getTableData, getTableHeaders } = require("../controllers/MergeCsv/checkTemplate");
const router = express.Router();

router.post('/mergecsv',mergeCSV );
router.post('/checkmergecsv',checkTempalte );
router.get("/gettabledata/:tableName", getTableHeaders);
// router.post('/checkmergecsv',checkTempalte );

module.exports = router;
