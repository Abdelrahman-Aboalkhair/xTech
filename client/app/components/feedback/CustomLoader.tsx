import React from "react";

const CustomLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-t-indigo-600 border-r-indigo-200 border-b-indigo-200 border-l-indigo-200 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-600 font-medium">Loading please wait</p>
    </div>
  );
};

export default CustomLoader;
