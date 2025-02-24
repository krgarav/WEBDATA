const Template = require("../../models/TempleteModel/templete");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const { QueryTypes } = require("sequelize");
exports.viewDuplicates = async (req, res) => {
    try {
      const { colName, colValue, templateId } = req.body;
  
      if (!templateId) {
        return res.status(400).json({
          success: false,
          message: "Template ID is required",
        });
      }
      if (!colName || colValue === undefined) {
        return res.status(400).json({
          success: false,
          message: "Column name is required, and column value cannot be undefined",
        });
      }
      
  
      // Fetch table name from template
      const template = await Template.findByPk(templateId);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
  
      let tableName = template.mergedTableName;
  
      // Fetch full duplicate records, including IDs
      let query = `
        SELECT *
        FROM ${tableName}
        WHERE ${colName} = :colValue
        AND ${colName} IN (
            SELECT ${colName}
            FROM ${tableName}
            GROUP BY ${colName}
            HAVING COUNT(${colName}) > 1
        )
      `;
  
      const result = await sequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: { colValue },
      });
  
      res.json({ success: true, duplicates: result });
    } catch (error) {
      console.error("Error fetching duplicate records:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while fetching duplicate records",
      });
    }
  };