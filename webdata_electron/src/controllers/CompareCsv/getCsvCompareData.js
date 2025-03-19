const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const Assigndata = require("../../models/TempleteModel/assigndata");
const groupByPrimaryKey = require("../../services/groupingCsvData");
const MappedData = require("../../models/TempleteModel/mappedData");
const getAllDirectories = require("../../services/directoryFinder");
const fastCsv = require("fast-csv");
const { app } = require("electron");
const documentsPath = app.getPath("documents");
const basePath = path.join(documentsPath, "Webdata");


function readCSVAndConvertToJSON(filePath) {
  return new Promise((resolve, reject) => {
    const jsonArray = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        jsonArray.push(row);
      })
      .on("end", () => {
        resolve(jsonArray);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}
let csvCache = null; // Store CSV data in-memory
let cacheTimeout = null;

const clearCache = () => {
  csvCache = null;
  console.log("CSV cache cleared due to inactivity");
};

const resetCacheTimer = () => {
  if (cacheTimeout) clearTimeout(cacheTimeout);
  cacheTimeout = setTimeout(clearCache, 30 * 60 * 1000); // 30 minutes
};

// Load CSV into memory on server start
const loadCsvIntoMemory = (csvFilePath,PRIMARY_KEY) => {
  return new Promise((resolve, reject) => {
    const dataMap = {};
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        const primaryKey = row[PRIMARY_KEY]; // Adjust key as per your CSV structure
        dataMap[primaryKey] = row;
      })
      .on("end", () => {
        csvCache = dataMap;
        console.log("CSV cached successfully");
        resolve();
      })
      .on("error", reject);
  });
};


const getCsvCompareData = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { currentIndex } = req.body;

    if (currentIndex === undefined || currentIndex === null) {
      return res.status(400).json({ message: "Current index is required" });
    }

    // Fetch Task and Validations
    const task = await Assigndata.findOne({ where: { id: taskId } });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { max, min, templeteId, errorFilePath, csvFilePath, imageDirectoryPath } = task;
    const minIndex = Number(min),
      maxIndex = Number(max);

    if (Number.isNaN(minIndex) || Number.isNaN(maxIndex) || !csvFilePath) {
      return res.status(400).json({ message: "Invalid task data" });
    }

    if (currentIndex < minIndex || currentIndex > maxIndex) {
      return res.status(400).json({ message: "Invalid current index" });
    }

    // Load Mapped Data & Error File in Parallel
    const [mappedData, errorJsonFile] = await Promise.all([
      MappedData.findAll({
        where: { templeteId },
        attributes: ["key", "value"],
        raw: true,
      }),
      readCSVAndConvertToJSON(errorFilePath),
    ]);

    const keyValuePair = mappedData.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});

    const groupedData = groupByPrimaryKey(errorJsonFile);
    const currentData = groupedData[currentIndex - 1] || {};
    const { PRIMARY: primaryValue, PRIMARY_KEY: primaryKey } = currentData;

    if (!primaryValue || !primaryKey) {
      return res.status(400).json({ message: "Primary key or value missing" });
    }

    // **FAST DATA RETRIEVAL FROM CACHE (O(1) Lookup)**
    if (!csvCache) await loadCsvIntoMemory(csvFilePath,primaryKey); // Load CSV if not already cached
    // console.log(csvCache)
    const filteredResult = csvCache[primaryValue] || null;

    // Construct Image Pathcd 
    const imageFile = path.join(basePath,"extractedFiles" , imageDirectoryPath);
    const relativeImagePath = imageFile.split("extractedFiles\\")[1];
   
    resetCacheTimer();
    res.status(200).json({
      message: "Data found",
      data: {
        previousData: currentData,
        max: maxIndex,
        min: minIndex,
        filteredResults: filteredResult,
        imageDirectoryPath: relativeImagePath,
        mappedReponse: keyValuePair,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = getCsvCompareData;
