import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { MdDataSaverOn } from "react-icons/md";
import {
  fetchLatestTaskData,
  fetchTemplateFormData,
  REACT_APP_IP,
} from "../../services/common";
import { toast } from "react-toastify";

const CorrectionField = ({
  correctionData,
  setCorrectionData,
  currentIndex,
  imageFocusHandler,
  onNextHandler,
  maximum,
}) => {
  // const [inputValues, setInputValues] = useState("");
  const taskData = JSON.parse(localStorage.getItem("taskdata"));
  const taskId = JSON.parse(localStorage.getItem("taskdata")).id;
  const token = JSON.parse(localStorage.getItem("userData"));
  const [visited, setVisited] = useState(false);
  const [visitedCount, setVisitedCount] = useState(0);
  const [visitedRows, setVisitedRows] = useState({}); // Track visited rows
  const inputRefs = useRef([]);
  // const firstInputRef = useRef(null);

  // useEffect(() => {
  //   if (firstInputRef.current) {
  //     firstInputRef.current.focus(); // Automatically focus on first input
  //   }
  // }, []);
  const handleVisit = (index) => {
    if (!visitedRows[index]) {
      setVisitedRows((prev) => ({ ...prev, [index]: true }));
      setVisitedCount((prev) => prev + 1);
    }
  };
  const [filteredData, setFilterData] = useState(
    correctionData?.previousData?.DATA
  );
  const [updatedData, setUpdatedData] = useState([]);
  // const filteredData = correctionData?.previousData?.DATA
  const PRIMARY = correctionData?.previousData?.PRIMARY;
  const PRIMARY_KEY = correctionData?.previousData?.PRIMARY_KEY;

  const [inputValue, setInputValue] = useState({});

  useEffect(() => {
    // When filteredData or PRIMARY changes, update the input values
    const initialValues = filteredData.reduce((acc, dataItem) => {
      const key = `${PRIMARY?.trim()}-${dataItem?.COLUMN_NAME?.trim()}`;
      acc[key] = dataItem.CORRECTED || ""; // Default to empty string if CORRECTED is undefined
      return acc;
    }, {});
    setInputValue(initialValues);
  }, [filteredData, PRIMARY]);

  useEffect(() => {
    const processTemplateData = async () => {
      try {
        if (!taskData?.templeteId || filteredData.length === 0) return;

        const templateId = taskData.templeteId;

        // Fetch form field data for each COLUMN_NAME in parallel
        const updatedData = await Promise.all(
          filteredData.map(async (item) => {
            try {
              const isFormField = await fetchTemplateFormData(
                templateId,
                item.COLUMN_NAME
              );
              const type = isFormField?.templateData?.fieldType || "formField"; // Use default "formField" if API fails or returns undefined
              return { ...item, type };
            } catch (error) {
              console.error(
                `Error fetching data for ${item.COLUMN_NAME}:`,
                error
              );
              return { ...item, type: "formField" }; // Fallback to "formField"
            }
          })
        );

        setUpdatedData(updatedData);
      } catch (error) {
        console.error("Error processing template data:", error);
      }
    };

    processTemplateData();
  }, [filteredData]);

  useEffect(() => {
    setFilterData(correctionData?.previousData?.DATA);
    setVisitedCount(0);
    setVisitedRows({});
  }, [correctionData?.previousData?.DATA]);
  useEffect(() => {
    const handleAltSKey = (e) => {
      if (e.altKey && e.key.toLowerCase() === "s") {
        e.preventDefault(); // Prevents browser shortcuts (if any)
        document.getElementById("update").click();
      }
    };

    document.addEventListener("keydown", handleAltSKey);
    return () => document.removeEventListener("keydown", handleAltSKey);
  }, []);
  useEffect(() => {
    handleVisit(0);
  }, []);
  useEffect(() => {
    const handleTabKey = (e) => {
      if (e.key === "Tab") {
        e.preventDefault(); // Prevent default tab behavior

        const focusableInputs = inputRefs.current.filter((el) => el);
        const currentIndex = focusableInputs.indexOf(document.activeElement);

        if (e.shiftKey) {
          // Shift + Tab (Move Backward)
          const prevIndex =
            (currentIndex - 1 + focusableInputs.length) %
            focusableInputs.length;
          focusableInputs[prevIndex]?.focus();
        } else {
          // Tab (Move Forward)
          const nextIndex = (currentIndex + 1) % focusableInputs.length;
          focusableInputs[nextIndex]?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, []);
  useEffect(() => {}, []);
  // console.log(inputValue);
  const handleInputChange = (e, key) => {
    setInputValue((prevValues) => ({
      ...prevValues,
      [key]: e.target.value,
    }));
  };
  const onUpdateHandler = async () => {
    const updates = Object.entries(inputValue).map(([key, correctedValue]) => {
      const [primary, columnName] = key.split("-");
      return {
        PRIMARY: primary,
        PRIMARY_KEY,
        CORRECTED: correctedValue, // Allow empty values
        COLUMN_NAME: columnName,
      };
    });

    if (updates.length === 0) return; // Ensure there are values to update
    try {
      // const response = await axios.post(
      //   `http://${REACT_APP_IP}:4000/csvUpdateData/${taskId}/batch`,
      //   updates,
      //   {
      //     headers: {
      //       token: token,
      //     },
      //   }
      // );
      // Get the latest `updatedAt`
      const response = await axios.post(
        `http://${REACT_APP_IP}:4000/csvUpdateData/${taskId}/batch`,

        updates, // Your update data

        {
          headers: {
            token: token,
          },
        }
      );

      // Update the local state with the new corrected values
      setCorrectionData((prevState) => {
        const updatedData = prevState?.previousData?.DATA?.map((item) => {
          const update = updates.find(
            (u) =>
              u?.PRIMARY?.trim() === item?.PRIMARY?.trim() &&
              u?.COLUMN_NAME?.trim() === item?.COLUMN_NAME?.trim()
          );
          if (update) {
            return { ...item, CORRECTED: update?.CORRECTED };
          }
          return item;
        });

        return {
          ...prevState,
          previousData: {
            ...prevState?.previousData,
            DATA: updatedData,
          },
        };
      });
      if (currentIndex !== maximum) {
        setInputValue({});
      }
      console.log(response.data);
      toast.success("Corrected Value is Updated");
      onNextHandler("next", currentIndex);
    } catch (error) {
      console.error("Error updating data:", error.response.data.message);
      toast.error(error.response.data.message);
    }
  };

  const errorData = updatedData?.map((dataItem, index) => {
    const key = `${PRIMARY?.trim()}-${dataItem?.COLUMN_NAME?.trim()}`;
    // const updatedValue = dataItem.CORRECTED||"Null";
    // const questionAllowedValues = ["A", "B", "C", "D", "*", " "];
    // const formAllowed = //allvalues
    // Allowed values for different field types
    const questionAllowedValues = ["A", "B", "C", "D", "*", " "];
    const numberRegex = /^[0-9]*$/; // Allows only numbers (0-9)
    // const allowedValues = dataItem.type=== "formField"?questionAllowedValues  : "questionsField";
    return (
      <div
        key={index}
        className={`flex ${visitedRows[index] ? "bg-green-200" : "bg-red-200"}`}
      >
        <div className="py-2 px-4 border-b w-1/5">
          {correctionData?.previousData?.PRIMARY}
        </div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.COLUMN_NAME}</div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.FILE_1_DATA}</div>
        <div className="py-2 px-4 border-b w-1/5">{dataItem?.FILE_2_DATA}</div>
        <div className="py-2 px-4 border-b w-1/5 flex space-x-2">
          <input
            type="text"
            className="w-full border rounded-xl py-1 px-2 shadow"
            // value={inputValue[key] ?inputValue[key]:dataItem?.FILE_1_DATA}
            value={
              inputValue[key] !== undefined
                ? inputValue[key]
                : dataItem?.FILE_1_DATA
            }
            // defaultValue={dataItem?.FILE_1_DATA}
            onChange={(e) => {
              const input = e.target.value.toUpperCase(); // Convert input to uppercase

              // Validate based on field type
              if (
                (dataItem.type === "formField" && numberRegex.test(input)) || // Allow only numbers for form fields
                (dataItem.type !== "formField" &&
                  (input === "" || questionAllowedValues.includes(input))) // Allow question field values
              ) {
                handleInputChange(
                  { ...e, target: { ...e.target, value: input } },
                  key
                );
              }
            }}
            onFocus={(e) => {
              imageFocusHandler(dataItem.COLUMN_NAME); // First function
              handleVisit(index); // Second function
            }} // Mark row as visited
            ref={(el) => (inputRefs.current[index] = el)}
            maxLength={dataItem.type !== "formField" && 1}
          />

          {/* <div className="flex justify-center items-center">
            <MdDataSaverOn
              className="text-2xl text-teal-600"
              onClick={() =>
                onUpdateHandler(
                  PRIMARY?.trim(),
                  dataItem?.COLUMN_NAME?.trim()
                )
              }
            />
          </div> */}
        </div>
      </div>
    );
  });

  return (
    <div className="mx-4 bg-white my-6 px-4 py-4 rounded-md">
      <div className="flex justify-between mb-6 mt-2">
        <h2 className="text-xl mx-4 font-bold pt-1 text-blue-500">
          {`${correctionData?.previousData?.PRIMARY_KEY} (Primary Key)`}
        </h2>
        <h3 className="text-lg font-bold bg-red-100 text-red-600 px-2 py-1 rounded-md shadow-md border border-red-300">
          Total Errors:{" "}
          <span className="font-extrabold">{filteredData?.length}</span>
        </h3>

        {filteredData?.length === visitedCount && (
          <span className="text-green-700 bg-green-200 font-semibold px-2 py-1 rounded-md shadow-md border border-green-400">
            ✅ All Visited
          </span>
        )}
        {filteredData?.length !== visitedCount && (
          <span className="flex items-center text-yellow-800 bg-yellow-200 font-semibold px-3 py-1 rounded-md shadow-md border border-yellow-400">
            ⚠️ Not All Visited &nbsp;|&nbsp; {visitedCount} of{" "}
            {filteredData?.length} completed
          </span>
        )}

        <h3 className="text-lg font-bold bg-blue-100 text-blue-600 px-2 py-1 rounded-md shadow-md border border-blue-300">
          Visited: <span className="font-extrabold">{visitedCount}</span>
        </h3>
        <button
          className="px-6 py-2 bg-teal-600 rounded-lg text-white"
          onClick={onUpdateHandler}
          id="update"
        >
          Update
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-full bg-white">
          <div>
            <div className="flex text-center">
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                {PRIMARY_KEY}
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                Field name
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                File 1
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                File 2
              </div>
              <div className="py-2 px-4 border-b font-semibold w-1/5">
                Corrected Data
              </div>
            </div>
          </div>
          <div className="h-[180px] overflow-y-auto text-center">
            {errorData}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrectionField;
