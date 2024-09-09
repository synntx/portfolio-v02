import React from "react";

const TerminalLoader: React.FC = () => {
  return (
    <div className="w-full max-w-4xl h-[26rem] bg-[#ffffff] dark:bg-[#101110] rounded-lg overflow-hidden shadow-lg dark:shadow-2xl border border-[#cccccc] dark:border-border">
      <div className="px-4 py-2 flex items-center justify-between bg-gradient-to-r from-[#dcdcdc] to-[#f0f0f0] dark:from-[#272727] dark:to-[#292c29]">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-foreground text-sm">
          Loading HarshOS Terminal...
        </div>
      </div>
      <div className="p-4 h-full font-mono text-sm text-green-400 flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-green-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        <span className="animate-pulse">Initializing system...</span>
      </div>
    </div>
  );
};

export default TerminalLoader;
