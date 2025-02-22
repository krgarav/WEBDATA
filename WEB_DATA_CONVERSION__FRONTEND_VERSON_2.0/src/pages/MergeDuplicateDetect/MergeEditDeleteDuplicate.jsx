import React, { useState } from "react";
import { MdDelete } from "react-icons/md";
import MergeEditDuplicateData from "./MergeEditDuplicateData";
import { useNavigate } from "react-router-dom";

const MergeEditDeleteDuplicate = () => {

  const navigate = useNavigate();

  return (
    <>
        {/* <div className="w-[100%] pt-20 h-[100vh] bg-blue-500 flex justify-center items-center"> */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 h-[71%] md:h-[61%] rounded-lg overflow-auto mx-5">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center  sm:mt-0 sm:text-left w-full">
                <h2 className="font-semibold">Data1</h2>
                <div className="mt-2">
                  <div className="min-w-full divide-y divide-gray-200">
                    <div className="bg-gray-50 ">
                      <div className="flex">
                        <div className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Data1
                        </div>
                        <div className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Row Index
                        </div>
                        <div className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Edit
                        </div>
                        <div className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                          Remove
                        </div>
                      </div>
                    </div>
                    <div className="overflow-y-auto h-[400px]">
                      <div className="">
                        <div className="bg-white flex-col">
                          <div className="flex">
                            <div className="text-center py-4 whitespace-nowrap text-xs font-medium text-gray-900 w-1/4">
                              154614654
                            </div>
                            <div className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4 text-center">
                              190
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                              <button
                                className="border-e px-4 bg-gray-100 py-2 text-sm/none text-blue-600 rounded-3xl hover:bg-blue-200"
                                onClick={() => {
                                  navigate("/merge/duplicate/data/edit");
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-red-500 text-2xl  w-1/4">
                              <MdDelete className="mx-auto text-2xl hover:text-3xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="bg-white flex-col">
                          <div className="flex">
                            <div className="text-center py-4 whitespace-nowrap text-xs font-medium text-gray-900 w-1/4">
                              154614654
                            </div>
                            <div className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4 text-center">
                              190
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                              <button
                                className="border-e px-4 bg-gray-100 py-2 text-sm/none text-blue-600 rounded-3xl hover:bg-blue-200"
                                onClick={() => {
                                  navigate("/merge/duplicate/data/edit");
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-red-500 text-2xl  w-1/4">
                              <MdDelete className="mx-auto text-2xl hover:text-3xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="bg-white flex-col">
                          <div className="flex">
                            <div className="text-center py-4 whitespace-nowrap text-xs font-medium text-gray-900 w-1/4">
                              154614654
                            </div>
                            <div className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4 text-center">
                              190
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                              <button
                                className="border-e px-4 bg-gray-100 py-2 text-sm/none text-blue-600 rounded-3xl hover:bg-blue-200"
                                onClick={() => {
                                  navigate("/merge/duplicate/data/edit");
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-red-500 text-2xl  w-1/4">
                              <MdDelete className="mx-auto text-2xl hover:text-3xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="bg-white flex-col">
                          <div className="flex">
                            <div className="text-center py-4 whitespace-nowrap text-xs font-medium text-gray-900 w-1/4">
                              154614654
                            </div>
                            <div className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4 text-center">
                              190
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                              <button
                                className="border-e px-4 bg-gray-100 py-2 text-sm/none text-blue-600 rounded-3xl hover:bg-blue-200"
                                onClick={() => {
                                  navigate("/merge/duplicate/data/edit");
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-red-500 text-2xl  w-1/4">
                              <MdDelete className="mx-auto text-2xl hover:text-3xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="bg-white flex-col">
                          <div className="flex">
                            <div className="text-center py-4 whitespace-nowrap text-xs font-medium text-gray-900 w-1/4">
                              154614654
                            </div>
                            <div className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4 text-center">
                              190
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                              <button
                                className="border-e px-4 bg-gray-100 py-2 text-sm/none text-blue-600 rounded-3xl hover:bg-blue-200"
                                onClick={() => {
                                  navigate("/merge/duplicate/data/edit");
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-red-500 text-2xl  w-1/4">
                              <MdDelete className="mx-auto text-2xl hover:text-3xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="bg-white flex-col">
                          <div className="flex">
                            <div className="text-center py-4 whitespace-nowrap text-xs font-medium text-gray-900 w-1/4">
                              154614654
                            </div>
                            <div className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4 text-center">
                              190
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                              <button
                                className="border-e px-4 bg-gray-100 py-2 text-sm/none text-blue-600 rounded-3xl hover:bg-blue-200"
                                onClick={() => {
                                  navigate("/merge/duplicate/data/edit");
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-red-500 text-2xl  w-1/4">
                              <MdDelete className="mx-auto text-2xl hover:text-3xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        <div className="bg-white flex-col">
                          <div className="flex">
                            <div className="text-center py-4 whitespace-nowrap text-xs font-medium text-gray-900 w-1/4">
                              154614654
                            </div>
                            <div className=" py-4 whitespace-nowrap text-sm font-medium text-gray-900 w-1/4 text-center">
                              190
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-sm text-gray-500 w-1/4">
                              <button
                                className="border-e px-4 bg-gray-100 py-2 text-sm/none text-blue-600 rounded-3xl hover:bg-blue-200"
                                onClick={() => {
                                  navigate("/merge/duplicate/data/edit");
                                }}
                              >
                                Edit
                              </button>
                            </div>
                            <div className="text-center py-4 whitespace-nowrap text-red-500 text-2xl  w-1/4">
                              <MdDelete className="mx-auto text-2xl hover:text-3xl" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/* </div> */}
    </>
  );
};

export default MergeEditDeleteDuplicate;
