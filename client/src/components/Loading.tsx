import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-goldenrod rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
