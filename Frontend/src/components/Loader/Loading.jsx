import React from "react";

// Loading component responsible for displaying a loading spinner
const Loading = () => {
  return (
    // Container element with flex layout to center content vertically and horizontally
    <div className="flex items-center justify-center min-h-screen">
      {/* Button element */}
      <button
        type="button"
        className="bg-fuchsia-400 h-max w-max rounded-lg text-white font-bold hover:bg-fuchsia-300 hover:cursor-not-allowed duration-[500ms,800ms]"
        disabled // Disable the button while loading
      >
        {/* Flex container for spinner and text */}
        <div className="flex items-center justify-center m-[10px]">
          {/* Spinner animation */}
          <div className="h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4"></div>
          {/* Text indicating loading */}
          <div className="ml-2"> Loading...</div>
        </div>
      </button>
    </div>
  );
};

export default Loading;
