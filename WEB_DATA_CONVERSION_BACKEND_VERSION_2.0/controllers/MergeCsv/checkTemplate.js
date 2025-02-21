const Template = require("../../models/TempleteModel/templete");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
exports.checkTempalte = async (req, res) => {
  try {
    const { files, templateId } = req.body; // Expecting an array of file names

    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    if (template.mergedTableName) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Template have merged file",
          tableName: template.mergedTableName,
        });
    }
    return res.status(200).json({ message: "Template is valid" });
  } catch (error) {
    console.error("Error checking template:", error.message);
    res.status(500).send("Internal server error");
  }
};




exports.getTableData = async (req, res) => {
    try {
      const { tableName } = req.params; // Get the table name from request params
  
      if (!tableName) {
        return res.status(400).json({ success: false, message: "Table name is required" });
      }
  
      // Check if the table exists
      const [results] = await sequelize.query(
        `SELECT table_name FROM information_schema.tables WHERE table_name = :tableName`,
        { replacements: { tableName }, type: sequelize.QueryTypes.SELECT }
      );
  
      if (!results) {
        return res.status(404).json({ success: false, message: "Table not found" });
      }
  
      // Fetch all data from the table using raw SQL
      const data = await sequelize.query(`SELECT * FROM ${tableName}`, {
        type: sequelize.QueryTypes.SELECT,
      });
  
      res.json({ success: true, data });
    } catch (error) {
      console.error("Error fetching table data:", error);
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
  };
  