const Template = require("../../models/TempleteModel/templete");
const sequelize = require("../../utils/database");
const { Parser } = require("json2csv");
exports.downloadCsvController = async (req, res) => {
  try {
    const { templateId } = req.query;
    const template = await Template.findByPk(templateId);

    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const tableName = template.mergedTableName;
    const fileName = template.name

    // Validate table name (prevent SQL injection)
    if (!/^[a-zA-Z0-9_]+$/.test(tableName)) {
      return res.status(400).send("Invalid table name");
    }

    // Dynamically fetch table data
    const [results, metadata] = await sequelize.query(
      `SELECT * FROM ${tableName}`,
      {
        raw: true, // Ensures raw data without extra Sequelize formatting
      }
    );

    if (!results.length) {
      return res.status(404).send("Table is empty or does not exist");
    }

  
    // Remove "id" column from headers and rows
    const filteredResults = results.map(({ id, ...rest }) => rest); // Remove "id" field from rows
    const columns = Object.keys(filteredResults[0]); // Extract column names excluding "id"

    // Convert JSON to CSV
    const json2csvParser = new Parser({ fields: columns });
    const csv = json2csvParser.parse(filteredResults);

    // Send CSV file as response
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}.csv`);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition"); 
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Error retrieving data");
  }
};
