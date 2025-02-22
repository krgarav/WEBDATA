import React, { useState } from "react";
import MergeDuplicateData from "./MergeDuplicateData";
import MergeEditDeleteDuplicate from "./MergeEditDeleteDuplicate";
import MergeEditDuplicateData from "./MergeEditDuplicateData";

const Structure = () => {
  const [showFirstComponent, setShowFirstComponent] = useState(true);
  const [showEditModel, setShowEditModel] = useState(false);
  const [showFinalComponent, setShowFinalComponent] = useState(false);

  return (
    <>
      <div className="relative w-full h-screen">
        {/* First Component (Blur when EditModel is Open) */}
        <div className={`${showEditModel ? "blur-sm" : ""}`}>
          {showFirstComponent && (
            <MergeDuplicateData
              setShowFirstComponent={setShowFirstComponent}
              setShowEditModel={setShowEditModel}
            />
          )}
        </div>

        {/* Edit Model Overlay */}
        {showEditModel && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 relative">
              <MergeEditDeleteDuplicate
                setShowFinalComponent={setShowFinalComponent}
                setShowEditModel={setShowEditModel}
              />
            </div>
          </div>
        )}

        {/* Final Component Overlay (Above Everything) */}
        {showFinalComponent && (
          <div className="fixed inset-0 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-3/4 relative">
              <MergeEditDuplicateData
                setShowFinalComponent={setShowFinalComponent}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Structure;
