import React, { useEffect, useState } from "react";
import { FaCloudDownloadAlt } from "react-icons/fa";
import axios from "axios";
import {
  fetchFilesAssociatedWithTemplate,
  REACT_APP_IP,
} from "../services/common";
import Multiselect from "multiselect-react-dropdown";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const MergeModal = ({ isOpen, onClose, templateId, message, tableName }) => {
  const [merge, setMerge] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOptions = async () => {
      const response = await fetchFilesAssociatedWithTemplate(templateId);
      if (response) {
        const csvOptions = response.map((item) => ({
          label: item.csvFile,
          value: item.id,
        }));
        setOptions(csvOptions);
      }
      // console.log(response);
    };
    fetchOptions();
  }, [isOpen]);
  useEffect(() => {
    if (message !== "Template have merged file") {
      setMerge(true);
    } else {
      setMerge(false);
    }
  }, [message]);
  const mergeHandler = async () => {
    const obj = {
      templateId: +templateId,
      files: selectedValues.map((item) => item.value),
    };
    try {
      const res = await axios.post(`http://${REACT_APP_IP}:4000/mergecsv`, obj);

      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error);
    }
  };
  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      setSelectedValues([]);
    } else {
      setSelectedValues(options);
    }
  };
  const duplicateHandler = async () => {
    console.log(tableName);
    try {
        const response = await axios.get(`http://${REACT_APP_IP}:4000/gettabledata/${tableName}`);
        
        const headers = response.data.headers

        console.log(headers);
        navigate("/merge/duplicate", { state: { headers, tableName } });

    } catch (error) {
        
    }
    
  };

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        aria-hidden="true"
      ></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:px-2 sm:py-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                  <h3
                    className="text-2xl font-semibold leading-6 text-gray-700"
                    id="modal-title"
                  >
                    {message}
                  </h3>
                  <div>
                    <span className="text-red-500">
                      Total Files:{options.length}
                    </span>
                  </div>
                  <div className="mt-6 px-6">
                    <div className="flex flex-row items-start gap-5 lg:gap-7 mt-5">
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => onClose()}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
              {merge && selectedValues.length > 0 && (
                <button
                  type="button"
                  onClick={mergeHandler}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Merge
                </button>
              )}
              {!merge && (
                <button
                  type="button"
                  onClick={duplicateHandler}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Show Duplicates
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MergeModal;
