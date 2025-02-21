const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const Assigndata = require("../../models/TempleteModel/assigndata");
const lockfile = require("proper-lockfile");
const csvToJson = require("../../services/csv_to_json");
const jsonToCsv = require("../../services/json_to_csv");
const { promisify } = require("util");
const Files = require("../../models/TempleteModel/files");
function readCSVAndConvertToJSON(filePath) {
  return new Promise((resolve, reject) => {
    const jsonArray = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        jsonArray.push(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
        resolve(jsonArray);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

function writeJSONToCSV(filePath, jsonArray) {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(filePath);
    writeStream.write(
      "PRIMARY,COLUMN_NAME,FILE_1_DATA,FILE_2_DATA,IMAGE_NAME,CORRECTED,CORRECTED BY,PRIMARY KEY\n"
    );
    jsonArray.forEach((row) => {
      writeStream.write(
        `${row.PRIMARY},${row.COLUMN_NAME},${row.FILE_1_DATA},${row.FILE_2_DATA},${row.IMAGE_NAME},${row.CORRECTED},${row["CORRECTED BY"]},${row["PRIMARY KEY"]}\n`
      );
    });
    writeStream.end();
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}

// const csvUpdateData = async (req, res) => {
//   try {
//     const { userName, email } = req.user;

//     const { taskId } = req.params;
//     const updates = req.body; // Expecting an array of updates

//     const task = await Assigndata.findOne({ where: { id: taskId } });
//     if (!task) {
//       return res.status(404).json({ message: "Task not found" });
//     }

//     const { errorFilePath, correctedCsvFilePath, fileId } = task;
//     if (!errorFilePath || !correctedCsvFilePath) {
//       return res.status(400).json({ error: "FilePath not provided" });
//     }
//     if (!fileId) {
//       return res.status(400).json({ error: "fileId not found" });
//     }
//     const fileData = await Files.findOne({ where: { id: fileId } });
//     if (!fileData) {
//       return res.status(404).json({ error: "File not found" });
//     }
//     const originalFilename = fileData.csvFile;
//     const originalFilePath = path.join(
//       __dirname,
//       "../../csvFile",
//       originalFilename
//     );
//     try {
//       await fs.access(originalFilePath);
//     } catch (err) {
//       return res.status(404).json({ error: "File not found" });
//     }

//     const resolvedErrorFilePath = path.resolve(errorFilePath);
//     const jsonData = await csvToJson(originalFilePath);
//     if (!fs.existsSync(resolvedErrorFilePath)) {
//       return res.status(400).json({ message: "Error file not found" });
//     }

//     const errorJsonFile = await readCSVAndConvertToJSON(resolvedErrorFilePath);

//     // Process each update in the request body
//     const updatedErrorJsonFile = errorJsonFile.map((item) => {
//       updates.forEach((update) => {
//         const { PRIMARY, COLUMN_NAME, CORRECTED } = update;
//         if (
//           item.PRIMARY.trim() === PRIMARY.trim() &&
//           item.COLUMN_NAME.trim() === COLUMN_NAME.trim()
//         ) {
//           item.CORRECTED = CORRECTED; // Update CORRECTED value

//           // Save email in CORRECTED BY column
//           item["CORRECTED BY"] = email;
//         }
//       });
//       return item;
//     });
//     updatedErrorJsonFile.forEach((errorRow) => {
//       const primaryKey = errorRow["PRIMARY KEY"];
//       const primary = errorRow["PRIMARY"];
//       const columnName = errorRow["COLUMN_NAME"];
//       const correctedValue = errorRow["CORRECTED"];
//       const correctedBy = errorRow["CORRECTED BY"] || "Unknown"; // Default to "Unknown" if not present

//       let findVar = jsonData.find((item) => item[primaryKey] == primary.trim());

//       if (findVar) {
//         // Apply the correction
//         findVar[columnName] = correctedValue;

//         // Append the correction in "Corrected Data"
//         if (correctedValue) {
//           findVar["Corrected Data"] = findVar["Corrected Data"]
//             ? findVar["Corrected Data"] + `, ${columnName}: ${correctedValue}`
//             : `${columnName}: ${correctedValue}`;
//           // Append the corrector's name in "Corrected By"
//           findVar["Corrected By"] = correctedBy;
//         }
//       } else {
//         console.log(
//           `No matching row found for primary key '${primary}, ${primaryKey}'`
//         );
//       }
//     });

//     const updatedCsv = await jsonToCsv(jsonData);
//     await fs.writeFile(correctedCsvFilePath, updatedCsv);
//     // Write the updated JSON back to CSV
//     await writeJSONToCSV(resolvedErrorFilePath, updatedErrorJsonFile);

//     return res
//       .status(200)
//       .json({ message: "Task updated successfully", updatedErrorJsonFile });
//   } catch (error) {
//     console.error("Error in csvUpdateData:", error);
//     return res
//       .status(500)
//       .json({ message: "An error occurred while updating the task" });
//   }
// };
const csvUpdateData = async (req, res) => {
  try {
    const { userName, email } = req.user;
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Assigndata.findOne({ where: { id: taskId } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { errorFilePath, correctedCsvFilePath, fileId } = task;
    if (!errorFilePath || !correctedCsvFilePath)
      return res.status(400).json({ error: "FilePath not provided" });

    if (!fileId) return res.status(400).json({ error: "fileId not found" });

    const fileData = await Files.findOne({ where: { id: fileId } });
    if (!fileData) return res.status(404).json({ error: "File not found" });

    const originalFilePath = path.resolve(
      __dirname,
      "../../csvFile",
      fileData.csvFile
    );
    try {
      await fs.promises.access(originalFilePath);
    } catch (err) {
      console.log(err);
      return res.status(404).json({ error: "Original file not found", err });
    }

    const resolvedErrorFilePath = path.resolve(errorFilePath);
    if (
      !(await fs.promises
        .access(resolvedErrorFilePath)
        .then(() => true)
        .catch(() => false))
    ) {
      return res.status(400).json({ message: "Error file not found" });
    }

    // Use lockfile to prevent simultaneous access
    const releaseLock = await lockfile.lock(correctedCsvFilePath, {
      stale: 5000,
    });

    try {
      let jsonData = await csvToJson(originalFilePath);
      let errorJsonFile = await csvToJson(resolvedErrorFilePath);

      const updatedErrorJsonFile = errorJsonFile.map((item) => {
        updates.forEach(({ PRIMARY, COLUMN_NAME, CORRECTED }) => {
          if (
            item.PRIMARY.trim() === PRIMARY.trim() &&
            item.COLUMN_NAME.trim() === COLUMN_NAME.trim()
          ) {
            item.CORRECTED = CORRECTED;
            item["CORRECTED BY"] = email;
          }
        });
        return item;
      });

      updatedErrorJsonFile.forEach((errorRow) => {
        const primaryKey = errorRow["PRIMARY KEY"];
        const primary = errorRow["PRIMARY"];
        const columnName = errorRow["COLUMN_NAME"];
        const correctedValue = errorRow["CORRECTED"];
        const correctedBy = errorRow["CORRECTED BY"] || "Unknown";

        let findVar = jsonData.find(
          (item) => item[primaryKey] == primary.trim()
        );

        if (findVar) {
          findVar[columnName] = correctedValue;
          if (correctedValue) {
            findVar["Corrected Data"] = findVar["Corrected Data"]
              ? findVar["Corrected Data"] + `, ${columnName}: ${correctedValue}`
              : `${columnName}: ${correctedValue}`;
            findVar["Corrected By"] = correctedBy;
          }
        }
      });

      // Write to a temporary file first to prevent corruption
      const tempCorrectedFilePath = correctedCsvFilePath + ".tmp";
      const tempErrorFilePath = resolvedErrorFilePath + ".tmp";

      await fs.promises.writeFile(tempCorrectedFilePath, jsonToCsv(jsonData));
      await fs.promises.writeFile(
        tempErrorFilePath,
        jsonToCsv(updatedErrorJsonFile)
      );

      // Rename the temp files to make the update atomic
      await fs.promises.rename(tempCorrectedFilePath, correctedCsvFilePath);
      await fs.promises.rename(tempErrorFilePath, resolvedErrorFilePath);

      return res.status(200).json({
        message: "Task updated successfully",
        updatedErrorJsonFile,
      });
    } finally {
      // Release the lock
      releaseLock();
    }
  } catch (error) {
    console.error("Error in csvUpdateData:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the task" });
  }
};
module.exports = csvUpdateData;
