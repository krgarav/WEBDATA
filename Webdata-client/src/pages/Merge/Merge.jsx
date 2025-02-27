import React, { useEffect, useState } from "react";
import NewSelect from "../../UI/NewSelect";
import { MdCompareArrows } from "react-icons/md";
import Multiselect from "multiselect-react-dropdown";
import {
  fetchFilesAssociatedWithTemplate,
  onGetAllTasksHandler,
  REACT_APP_IP,
} from "../../services/common";
import { use } from "react";
import axios from "axios";
import DeactivateModal from "../../components/DeactivateModal";
import MergeModal from "../../UI/MergeModal";

const Merge = () => {
  const [options, setOptions] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [selectedValues, setSelectedValues] = useState([]);
  const [modals, setModals] = useState(false);
  const [message, setMessage] = useState("");
  const [tableName, setTableName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      setSelectedValues([]);
    } else {
      setSelectedValues(options);
    }
  };
  useEffect(() => {
    if (selectedTemplate) {
      fetchFile(selectedTemplate);
    }
  }, [selectedTemplate]);
  const checkMergeHandler = async () => {
    const obj = {
      templateId: +selectedTemplate,
      files: selectedValues.map((item) => item.value),
    };
    try {
      setLoading(true);
      const res = await axios.post(
        `http://${REACT_APP_IP}:4000/checkmergecsv`,
        obj
      );
      setModals(true);
      setMessage(res.data.message);
      setTableName(res.data.tableName);
      console.log(res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchFile = async (templateId) => {
    try {
      const response = await fetchFilesAssociatedWithTemplate(templateId);

      const csvOptions = response.map((item) => ({
        label: item.csvFile,
        value: item.id,
      }));

      setOptions(csvOptions);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  };
  return (
    <>
      {modals && (
        <MergeModal
          isOpen={modals}
          onClose={() => setModals(false)}
          message={message}
        table={tableName}
          templateId={selectedTemplate}
          // taskId={taskId}
        />
      )}
      <div className="h-[100vh] pt-24 overflow-y-hidden bg-blue-500 flex justify-center items-start">
        <div className="my-auto bg-white p-10 rounded-3xl mx-10">
          <h1 className="text-center mb-6 text-black text-2xl font-bold">
            MERGE
          </h1>
          <div className="flex flex-row items-end gap-4 lg:gap-7">
            <p className="text-black font-semibold lg:text-xl sm:min-w-40 mb-2">
              Select Template :{" "}
            </p>
            <div className="sm:w-80 md:w-96">
              <NewSelect
                label="Select Template"
                onTemplateSelect={setSelectedTemplate}
                values={selectedTemplate}
              />
            </div>
          </div>
          {/* <div className="flex flex-row items-start gap-5 lg:gap-7 mt-5">
            <p className="text-black font-semibold lg:text-xl sm:min-w-40 mb-2">
              Select CSV File :{" "}
            </p>
            <div className="sm:w-80 md:w-96">
              <div className="lg:w-96">
                <button
                  onClick={handleSelectAll}
                  className="w-40 text-start mb-2 flex gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.length === options.length}
                    readOnly
                  />
                  <span>
                    {selectedValues.length === options.length
                      ? "Deselect All"
                      : "Select All"}
                  </span>
                </button>
                <Multiselect
                  options={options}
                  displayValue="label"
                  selectedValues={selectedValues}
                  onSelect={setSelectedValues}
                  onRemove={setSelectedValues}
                  showCheckbox
                  placeholder="Select CSV Files"
                  style={{
                    multiselectContainer: {
                      maxHeight: "200px",
                      overflowY: "auto",
                      minHeight: "200px",
                    }, // Set max height and scroll
                    chips: { background: "#007bff" }, // Optional: Style selected items
                    searchBox: {
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }, // Optional: Style input
                  }}
                />
              </div>
            </div>
          </div> */}
          <div className="flex justify-center items-center mt-10">
            <button
              type="button"
              class={`text-white focus:outline-none focus:ring-2 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all ${loading ? "bg-blue-500":"bg-blue-700 hover:bg-blue-800"}`}
              onClick={checkMergeHandler}
            >
              {loading ? (
                    <span className="flex">
                      <svg
                        className="ml-1 mr-2 h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Checking...
                    </span>
                  ) : (
                    <span className="flex justify-center items-center gap-2"><MdCompareArrows size={23} /> Check Merge</span>
                  )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Merge;
