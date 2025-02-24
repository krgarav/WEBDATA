import React, { useEffect, useState } from "react";
import img23 from "./img23.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { REACT_APP_IP } from "../../services/common";

const MergeEditDuplicateData = ({
  templateId,
  editModalData,
  setEditViewModal,
}) => {
  const [editableData, setEditableData] = useState({});
  const [headerData, setHeaderData] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://${REACT_APP_IP}:4000/getImageCol?templateId=${templateId}`
        );
        if (res.data.success) {
          setImageUrl(res.data.imageCol);
        }

        // console.log(headerData)
        // console.log(editModalData[imageUrl]);
      } catch (error) {}
    };
    fetchData();
  }, []);
  useEffect(() => {
    console.log(headerData);
    console.log(editModalData[imageUrl]);
  }, [imageUrl]);

  useEffect(() => {
    const header = Object.keys(editModalData);
    if (header) {
      setHeaderData(header);
    }
  }, [editModalData]);
  const alldata = headerData.map((item) => {
    return (
      <div className="flex flex-row justify-center">
        <div className="py-2 px-2 text-center w-1/3 lg:w-1/2">{item}</div>
        <div className="py-2 p-2 px-2 text-center lg:w-1/2">
          <input
            className="text-center p-2 rounded-3xl lg:w-11/12"
            type="text"
            value={editModalData[item]}
          />
        </div>
      </div>
    );
  });
  const backHandler = () => {
    setEditViewModal(false);
  };
  return (
    <>
      <div className="w-[100%] pt-20 bg-blue-500 lg:flex gap-10 xl:gap-80 px-5">
        <div className="flex flex-row lg:flex-col justify-center items-center lg:ms-3 w-full md:w-1/2 lg:w-[25%] mx-auto mb-4">
          <div className="mx-6 inline-block align-bottom lg:mt-2  bg-teal-100 rounded-xl  text-left shadow-md transform transition-all  sm:align-middle w-[100%] lg:w-full">
            <div className="px-4 py-2 lg:py-3">
              <div className="sm:flex w-full">
                <div className="text-center  sm:text-left w-full">
                  <div className=" font-semibold my-2 overflow-y-auto h-[70vh]">
                    <div className="divide-y divide-gray-100 text-sm">
                      <div className="flex flex-col">{alldata}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <div className="flex flex-col space-y-4 lg:space-y-0 lg:space-x-12 lg:flex-row lg:pt-2 lg:pb-1  px-4 lg:px-7 w-[25%] lg:w-full">
      <button
        onClick={() => setEditModal(false)}
        class="group inline-block rounded-3xl bg-blue-500 p-[2px] text-white hover:bg-indigo-600 focus:outline-none focus:ring active:text-opacity-75"
      >
        <span class="block rounded-sm  text-center lg:px-8 py-2 text-md font-medium group-hover:bg-transparent">
          Back
        </span>
      </button>
      <button
        onClick={onUpdateCurrentDataHandler}
        class="group inline-block rounded-3xl bg-blue-500 p-[2px] text-white hover:bg-indigo-600 focus:outline-none focus:ring active:text-opacity-75"
      >
        <span class="block rounded-sm  text-center lg:px-8 py-2 text-md font-medium group-hover:bg-transparent">
          Save
        </span>
      </button>
    </div> */}
            <div className="flex justify-around pb-3 lg:pb-5 lg:w-full">
              <button class="group inline-block rounded-3xl bg-blue-500 p-[2px] text-white hover:bg-indigo-600 focus:outline-none focus:ring active:text-opacity-75">
                <span
                  class="block rounded-sm  px-10 py-2 text-md font-medium group-hover:bg-transparent"
                  onClick={backHandler}
                  //  onClick={() => {
                  //     navigate("/merge/duplicate/data");
                  //   }}
                >
                  Back
                </span>
              </button>
              <button class="group inline-block rounded-3xl bg-blue-500 p-[2px] text-white hover:bg-indigo-600 focus:outline-none focus:ring active:text-opacity-75">
                <span class="block rounded-sm  px-10 py-2 text-md font-medium group-hover:bg-transparent">
                  Save
                </span>
              </button>
            </div>
          </div>
        </div>
        {/* <div className="mt-5">
          <h1 className="text-white text-xl text-center mb-3">1 out of 1</h1>
          <img
            src={`http://${REACT_APP_IP}:4000/images/${editModalData[imageUrl]}`}
            alt="student-answer"
            style={{
              maxHeight: "80vh", // Adjust as needed
              width: "auto", // Keeps aspect ratio
              objectFit: "contain", // Ensures the image fits without cropping
            }}
          />
        </div> */}

        <div className="mx-auto max-w-screen-xl px-2 lg:py-1 sm:px-6 lg:px-8">
          <div className=" flex justify-center">
            <div className="">
              {imageUrl && (
                <div
                  style={{
                    position: "relative",
                    height: "89.1vh"
                  }}
                  className="w-full overflow-y-auto mb-4 overflow-auto"
                >
                  <img
                    // src={`data:image/jpeg;base64,${imageUrl}`}
                    src={`http://${REACT_APP_IP}:4000/images/${editModalData[imageUrl]}`}
                    alt="Selected"
                    // style={{
                    //   width: "48rem",
                    //   height: "49rem",
                    // }}
                    className=""
                    draggable={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MergeEditDuplicateData;
