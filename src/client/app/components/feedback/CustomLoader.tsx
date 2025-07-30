"use client";

import React from "react";

const CustomLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-10 h-10 border-3 border-t-indigo-600 border-r-indigo-200 border-b-indigo-200 border-l-indigo-200 rounded-full animate-spin"></div>
    </div>
  );
};

export default CustomLoader;
