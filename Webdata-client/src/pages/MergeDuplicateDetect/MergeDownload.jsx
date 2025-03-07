import React, { useState } from "react";
import { downloadUpdatedCsv } from "../../services/common";
import { toast } from "react-toastify";

const MergeDownload = ({ setDownload,templateId }) => {

const [loading,setLoading] = useState(false)

const handleDownload = async() =>{
  try {
    setLoading(true)
    const response = await downloadUpdatedCsv(templateId);

    // // Convert response to a Blob (CSV file)
    // const blob = new Blob([response], { type: "text/csv" });

    // // Create a download link
    // const link = document.createElement("a");
    // link.href = window.URL.createObjectURL(blob);
    // link.setAttribute("download", `template_${templateId}.csv`); // File name
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    toast.success("Downloaded the file successfully");
  } catch (error) {
    console.error("Error downloading CSV:", error);
    toast.error("Failed to download the file");
  }finally{
    setLoading(false)
  }
}

  return (
    // <div className="flex justify-center items-center w-[100%] pt-20 h-[100vh] bg-blue-500">
    <div className="w-1/4 h-1/4 bg-white flex flex-col p-10 rounded-lg relative">
      <div
        onClick={() => {
          setDownload(false);
        }}
        className=" absolute right-5 top-2 text-xl font-bold text-red-500"
      >
        <button>X</button>
      </div>
      <h1 className="text-center text-2xl">Dowload Updated Files</h1>
      <div className="flex justify-center items-center mt-14">
        <button className="bg-green-500 text-white py-2 px-4 rounded-3xl" disabled={loading} onClick={handleDownload}>
          {loading?"processing...":"Download"}
          
        </button>
      </div>
    </div>
    // </div>
  );
};

export default MergeDownload;
