import React, { useEffect, useState } from "react";
import { 
  GridComponent, 
  ColumnsDirective, 
  ColumnDirective, 
  Inject, 
  Page, 
  Edit, 
  Toolbar 
} from "@syncfusion/ej2-react-grids";
import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";

const MergeEditDeleteDuplicate = ({setEditModalData, setEditViewModal, duplicateData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (Array.isArray(duplicateData)) {
      setData(duplicateData);
    }
  }, [duplicateData]);

  // Filtering logic: Stop looping when a key starts with "q"
  let stopProcessing = false;
  const columns = [];
  
  if (data.length > 0) {
    for (const key of Object.keys(data[0])) {
      if (/^q/i.test(key)) {  // Stops looping if key starts with "q" or "Q"
        stopProcessing = true;
        break;  // Exit the loop
      }
      columns.push({
        field: key,
        headerText: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize header
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
            console.log("Editing row:", props); // Log entire row data
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
  const handleDelete = (rowData) => {
    setData((prevData) => prevData.filter((item) => item !== rowData));
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
