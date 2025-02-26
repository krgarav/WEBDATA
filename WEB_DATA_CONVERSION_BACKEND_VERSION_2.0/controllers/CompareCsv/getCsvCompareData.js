const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const Assigndata = require("../../models/TempleteModel/assigndata");
const groupByPrimaryKey = require("../../services/groupingCsvData");
const MappedData = require("../../models/TempleteModel/mappedData");
const getAllDirectories = require("../../services/directoryFinder");
const fastCsv = require("fast-csv");
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

// const getCsvCompareData = async (req, res) => {
//   const userPermission = req.permissions;

//   const { taskId } = req.params;
//   const task = await Assigndata.findOne({ where: { id: taskId } });
//   if (!task) {
//     return res.status(404).json({ message: "Task not found" });
//   }

//   const {
//     max,
//     min,
//     templeteId,
//     id,
//     errorFilePath,
//     correctedCsvFilePath,
//     imageDirectoryPath,
//     csvFilePath,
//   } = task;
//   const taskTempleteId = templeteId;
//   const minIndex = parseInt(min);
//   const maxIndex = parseInt(max);
//   const { currentIndex } = req.body;

//   if (!maxIndex || !minIndex) {
//     return res.status(400).json({ message: "Max and min values are required" });
//   }

//   if (currentIndex === undefined || currentIndex === null) {
//     return res.status(400).json({ message: "Current index is required" });
//   }

//   if (!(currentIndex >= minIndex && currentIndex <= maxIndex)) {
//     return res.status(400).json({ message: "Invalid current index" });
//   }

//   if (!csvFilePath) {
//     return res.status(400).json({ message: "CSV file path is required" });
//   }

//   try {
//     const errorJsonFile = await readCSVAndConvertToJSON(errorFilePath);
//     const groupedData = groupByPrimaryKey(errorJsonFile);
//     const absoluteFilePath = path.resolve(csvFilePath);

//     const results = [];
//     let mappedReponse = [];

//     const currentTask = await Assigndata.findOne({ where: { id: taskId } });
//     if (!currentTask) {
//       return res.status(404).json({ message: "Task not found" });
//     }
   
//     await currentTask.update({ currentIndex });

//     fs.createReadStream(absoluteFilePath)
//       .pipe(csv())
//       .on("data", (data) => results.push(data))
//       .on("end", async () => {
//         const mappedData = await MappedData.findAll({
//           where: {
//             templeteId: taskTempleteId,
//           },
//         });

      

//         const keyValuePair = mappedData.map((item) => ({
//           [item.key]: item.value,
//         }));

//         mappedReponse = keyValuePair;

//         const mergedObject = keyValuePair.reduce((acc, obj) => {
//           const key = Object.keys(obj)[0];
//           const value = obj[key];
//           acc[key] = value;
//           return acc;
//         }, {});

//         const resultsWithIndex = results.map((result, index) => ({
//           ...result,
//           rowIndex: minIndex + index,
//         }));
//         resultsWithIndex.unshift(mergedObject);

//         const filteredResults = resultsWithIndex
//           .map((result) => {
//             const filterValue = groupedData[0].PRIMARY_KEY;
//             const matchingGroupedData = groupedData.find(
//               (group) => group.PRIMARY === result[filterValue]
//             );
//             return matchingGroupedData ? { ...result } : null;
//           })
//           .filter((result) => result !== null);

//         let imageFile = path.join(
//           __dirname,
//           "../",
//           "../",
//           "extractedFiles",
//           imageDirectoryPath
//         );

//         const imageFolders = getAllDirectories(imageFile);
//         imageFolders.forEach((folder) => {
//           imageFile = path.join(imageFile, folder);
//         });

//         // const prefixToRemove ="D:\\Omr\\CSV\\WEB_DATA_CONVERSION_BACKEND_4.0\\extractedFiles";
//         // const result = imageFile.replace(prefixToRemove, "");

//         const result = imageFile.split("extractedFiles\\")[1];
//         console.log(groupedData[currentIndex - 1]);
//         res.status(200).json({
//           message: "Data found",
//           data: {
//             previousData: groupedData[currentIndex - 1],
//             max: maxIndex,
//             min: minIndex,
//             filteredResults: filteredResults[currentIndex - 1],
//             imageDirectoryPath: result,
//             mappedReponse
//           },
//         });
//       })
//       .on("error", (error) => {
//         console.error("Error reading CSV file:", error);
//         res.status(500).json({ error: "Error reading CSV file" });
//       });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
const getCsvCompareData = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { currentIndex } = req.body;
    
    const task = await Assigndata.findOne({ where: { id: taskId } });
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    const { max, min, templeteId, errorFilePath, correctedCsvFilePath, imageDirectoryPath, csvFilePath } = task;
    if (!max || !min) return res.status(400).json({ message: "Max and min values are required" });
    if (currentIndex === undefined || currentIndex === null) return res.status(400).json({ message: "Current index is required" });
    if (!(currentIndex >= parseInt(min) && currentIndex <= parseInt(max))) return res.status(400).json({ message: "Invalid current index" });
    if (!csvFilePath) return res.status(400).json({ message: "CSV file path is required" });

    const errorJsonFile = await readCSVAndConvertToJSON(errorFilePath);
    const groupedData = groupByPrimaryKey(errorJsonFile);
    const absoluteFilePath = path.resolve(csvFilePath);

    const results = [];
    const currentTask = await Assigndata.findOne({ where: { id: taskId } });
    if (!currentTask) return res.status(404).json({ message: "Task not found" });
    await currentTask.update({ currentIndex });

    fs.createReadStream(absoluteFilePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          const mappedData = await MappedData.findAll({ where: { templeteId } });
          const keyValuePair = mappedData.map((item) => ({ [item.key]: item.value }));
          const mergedObject = Object.assign({}, ...keyValuePair);

          const resultsWithIndex = results.map((result, index) => ({
            ...result,
            rowIndex: parseInt(min) + index,
          }));
          resultsWithIndex.unshift(mergedObject);

          const filteredResults = resultsWithIndex
            .map((result) => groupedData.find((group) => group.PRIMARY === result[groupedData[0].PRIMARY_KEY]) ? result : null)
            .filter(Boolean);

          let imageFile = path.join(__dirname, "../../extractedFiles", imageDirectoryPath);
          getAllDirectories(imageFile).forEach((folder) => (imageFile = path.join(imageFile, folder)));
          const result = imageFile.split("extractedFiles\\")[1];

          res.status(200).json({
            message: "Data found",
            data: {
              previousData: groupedData[currentIndex - 1],
              max: parseInt(max),
              min: parseInt(min),
              filteredResults: filteredResults[currentIndex - 1],
              imageDirectoryPath: result,
              mappedReponse: keyValuePair,
            },
          });
        } catch (error) {
          console.error("Error processing CSV data:", error);
          res.status(500).json({ error: "Error processing CSV data" });
        }
      })
      .on("error", (error) => {
        console.error("Error reading CSV file:", error);
        res.status(500).json({ error: "Error reading CSV file" });
      });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = getCsvCompareData;
