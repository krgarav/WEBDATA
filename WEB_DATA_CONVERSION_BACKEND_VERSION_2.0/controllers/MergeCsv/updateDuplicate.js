const Templete = require("../../models/TempleteModel/templete");
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../../utils/database");
const { QueryTypes } = require("sequelize");

exports.updateDuplicate = async (req, res) => {
  try {
    const { templateId, rowId } = req.query;
    const updatedData = req.body;

    if (!templateId || !rowId || Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Template ID, Row ID, and updated data are required",
      });
    }

    console.log("Updating template ID:", templateId);
    console.log("Row ID:", rowId);
    console.log("New Data:", updatedData);

    // 1️⃣ Get the table name from the template
    const template = await Templete.findByPk(templateId);
    if (!template || !template.mergedTableName) {
      return res.status(404).json({
        success: false,
        message: "Template or associated table not found",
      });
    }

    const tableName = template.mergedTableName;

    const filteredData = {};
    Object.keys(updatedData).forEach((key) => {
      const safeKey = key.replace(/\s+/g, "_"); // Convert spaces to underscores for Sequelize bindings
      filteredData[safeKey] = updatedData[key];
    });

    const setClause = Object.keys(updatedData)
      .map((key) => `\`${key}\` = :${key.replace(/\s+/g, "_")}`) // Use original key in SQL, safe key in bindings
      .join(", ");

    const updateQuery = `
      UPDATE \`${tableName}\`
      SET ${setClause}
      WHERE id = :rowId
    `;

    await sequelize.query(updateQuery, {
      replacements: { rowId, ...filteredData }, // Use safe keys
      type: QueryTypes.UPDATE,
    });

    res.json({
      success: true,
      message: `Row in '${tableName}' updated successfully`,
    });
  } catch (error) {
    console.error("Error updating row:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
