import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function UserDetail() {
  const [userDetails, setUserDetails] = useState([]);
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [taskType, setTaskType] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const rowsPerPage = 8;
  const token = JSON.parse(localStorage.getItem("userData"));

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${window.SERVER_IP}/user/details/${id}`,
          {
            headers: {
              token: token,
            },
          }
        );
        setUserDetails(response.data?.userActivitydetails || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserDetails();
  }, [id, token]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const totalPages = Math.ceil(userDetails.length / rowsPerPage);

  const handleClick = (event) => {
    setCurrentPage(Number(event.target.id));
  };

  const renderPageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    renderPageNumbers.push(
      <button
        key={i}
        id={i}
        onClick={handleClick}
        className={`px-3 py-1 mx-1 ${currentPage === i
          ? "bg-blue-500 text-white rounded-md"
          : "bg-gray-200 text-gray-700 rounded-md"
          }`}
      >
        {i}
      </button>
    );
  }

  // Filter user details based on task type and selected date
  const filterUserDetails = (details) => {
    let filteredDetails = details;

    // Filter by taskType (login, logout, or all)
    if (taskType !== "All") {
      filteredDetails = filteredDetails.filter(
        (item) => item.action.toLowerCase() === taskType.toLowerCase()
      );
    }

    // Filter by selected date
    if (selectedDate) {
      filteredDetails = filteredDetails.filter((item) => {
        const itemDate = new Date(item.timestamp).toLocaleDateString("en-GB");
        const selectedDateFormatted = new Date(selectedDate).toLocaleDateString(
          "en-GB"
        );
        return itemDate === selectedDateFormatted;
      });
    }

    return filteredDetails;
  };

  const filteredUserDetails = filterUserDetails(userDetails);

  const sortedUserDetails = [...filteredUserDetails]?.sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  const currentRows = sortedUserDetails.slice(indexOfFirstRow, indexOfLastRow); // Get current rows after filtering

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-400 to-blue-600 h-[100vh] pt-20">
      <div className="overflow-x-auto rounded-3xl w-[800px] shadow-sm shadow-white">
        <div className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm w-full">
          <div className="px-4 py-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-semibold px-4 pb-6">User Detail</h1>
              <Link to={"/all-user"}
                className="px-8 py-2 bg-blue-500 mr-4 text-white rounded-lg shadow-md hover:bg-blue-600"
              >
                Back
              </Link>
            </div>
            <div className="hidden sm:block ml-2 p-2">
              <nav className="flex gap-6" aria-label="Tabs">
                <button
                  onClick={() => setTaskType("All")}
                  className={`shrink-0 rounded-lg p-2 text-sm border-2 font-medium ${taskType === "All" && "bg-sky-100 text-sky-600"} hover:bg-sky-100 hover:text-gray-700`}
                >
                  ALL USER
                </button>

                <button
                  onClick={() => setTaskType("login")}
                  className={`shrink-0 rounded-lg p-2 text-sm border-2 font-medium ${taskType === "login" && "bg-sky-100 text-sky-600"} hover:bg-sky-100 hover:text-gray-700`}
                >
                  LOGIN
                </button>

                <button
                  onClick={() => setTaskType("logout")}
                  className={`shrink-0 border-2 rounded-lg ${taskType === "logout" && "bg-sky-100 text-sky-600"} p-2 text-sm font-medium hover:bg-sky-100`}
                  aria-current="page"
                >
                  LOGOUT
                </button>

                {/* New button for DATA SELECTION */}
                <button
                  className={`shrink-0 border-2 rounded-lg ${taskType === "dataSelection" && "bg-sky-100 text-sky-600"} p-2 text-sm font-medium hover:bg-sky-100 hover:text-gray-700`}
                >
                  DATA SELECTION
                </button>

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="ml-2 p-2 border rounded-lg text-sm"
                />
              </nav>
            </div>

            <div className="mx-4 border-2 rounded-xl">
              <div className="ltr:text-left rtl:text-right">
                <div className="text-xl flex font-bold text-center border-b-2 border-gray-200">
                  <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/4">
                    S.No
                  </div>
                  <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/4">
                    Action
                  </div>
                  <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/4">
                    Date
                  </div>
                  <div className="whitespace-nowrap px-4 py-4 font-medium text-gray-900 w-1/4">
                    Time
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200 text-center overflow-y-auto h-[280px]">
                {currentRows.map((data, index) => {
                  const globalIndex = indexOfFirstRow + index + 1; // Correct global index for serial number
                  const dateObject = new Date(data?.timestamp);
                  const date = dateObject.toLocaleDateString("en-GB");
                  const timeOptions = {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  };
                  const time = dateObject.toLocaleTimeString(
                    "en-US",
                    timeOptions
                  );

                  return (
                    <div key={index} className="even:bg-blue-50 flex">
                      <div className="whitespace-nowrap px-4 py-3 font-medium text-gray-900 w-1/4">
                        {globalIndex} {/* Show correct serial number */}
                      </div>
                      <div className="whitespace-nowrap px-4 py-3 text-gray-700 w-1/4">
                        {data.action}
                      </div>
                      <div className="whitespace-nowrap px-4 py-3 text-gray-700 w-1/4">
                        {date}
                      </div>
                      <div className="whitespace-nowrap px-4 py-3 text-gray-700 w-1/4">
                        {time}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center py-4">
                {renderPageNumbers}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;