import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 border-4 border-lighter-blue border-t-primary-blue rounded-full animate-spin"></div>
        <p className="text-dark-blue text-lg font-semibold">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
