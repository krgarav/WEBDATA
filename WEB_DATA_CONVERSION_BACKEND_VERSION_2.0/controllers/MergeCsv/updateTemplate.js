const Template = require("../../models/TempleteModel/templete");
const sequelize = require("../../utils/database");
const { QueryTypes } = require("sequelize");
exports.updateTemplate = async (req, res) => {
  try {
    const { templateId } = req.query;

    if (!templateId) {
      return res.status(400).json({ message: "Template ID is required" });
    }

    // Find the template by ID
    const template = await Template.findByPk(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }
    if (!template.mergedTableName) {
      return res
        .status(400)
        .json({ message: "No table associated with this template." });
    }
    const tableName = template.mergedTableName;

    // Drop the table if it exists
    const query = `DROP TABLE IF EXISTS \`${tableName}\``; // Ensure table name is safely escaped
    await sequelize.query(query, { type: QueryTypes.RAW });
    // Clear the mergedTableName in the template
    template.mergedTableName = "";
    await template.save(); // ✅ Await the save operation
    res.json({
      success: true,
      message: `Table ${tableName} has been dropped.`,
    });
  } catch (error) {
    console.error("Error dropping table:", error);
    res.status(500).json({ success: false, message: "Failed to drop table." });
  }
};
