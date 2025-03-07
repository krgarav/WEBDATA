import React, { useEffect, useState } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
  Edit,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";
import axios from "axios";
import { REACT_APP_IP } from "../../services/common";

const MergeEditDeleteDuplicate = ({
  templateId,
  setEditModalData,
  setEditViewModal,
  duplicateData,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (Array.isArray(duplicateData)) {
      const updatedData = duplicateData.map((item) => {
        const newItem = {}; // Create a new object to store updated keys
        for (const key in item) {
          const newKey = key.endsWith(".") ? key.slice(0, -1) : key; // Remove trailing dot
          newItem[newKey] = item[key]; // Assign value to new key
        }
        return newItem;
      });
      setData(updatedData);
    }
      
  }, [duplicateData]);

  // Filtering logic: Stop looping when a key starts with "q"
  let stopProcessing = false;
  const columns = [];

  if (data.length > 0) {
    for (const key of Object.keys(data[0])) {
      if (/^q/i.test(key)) {
        // Stops looping if key starts with "q" or "Q"
        stopProcessing = true;
        break; // Exit the loop
      }
      columns.push({
        field: key,
        headerText:  key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
        width: 150,
        textAlign: "Center",
      });
    }
  }

  // Add Edit & Delete buttons as action buttons
  columns.push(
    {
      field: "edit",
      headerText: "Edit",
      template: (props) => (
        <button
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={() => {
            setEditViewModal(true);
            setEditModalData(props); // Store row data in state
          }}
        >
          Edit
        </button>
      ),
      width: 100,
      textAlign: "Center",
    },
    {
      field: "delete",
      headerText: "Delete",
      template: (props) => (
        <button
          className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={() => handleDelete(props)}
        >
          Delete
        </button>
      ),
      width: 100,
      textAlign: "Center",
    }
  );

  // Delete handler
  const handleDelete = async (rowData) => {
    const result = window.confirm("Are you sure you want to delete this item?");
    if (!result) {
      return;
    }
    try {
      const obj = { rowId: rowData.id, templateId };
      console.log(obj);
      const res = await axios.delete(`http://${REACT_APP_IP}:4000/deleteRow?rowId=${rowData.id}&templateId=${templateId}`)
      console.log(res)
    } catch (error) {}
    // setData((prevData) => prevData.filter((item) => item !== rowData));
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Duplicate Data</h2>
      <GridComponent
        dataSource={data}
        allowPaging={true}
        pageSettings={{ pageSize: 10 }}
        toolbar={["Search"]}
        editSettings={{ allowEditing: true, allowDeleting: true }}
      >
        <ColumnsDirective>
          {columns.map((col, index) => (
            <ColumnDirective key={index} {...col} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Edit, Toolbar]} />
      </GridComponent>
    </div>
  );
};

export default MergeEditDeleteDuplicate;
