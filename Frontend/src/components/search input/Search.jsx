import { useState } from "react";
import { GoSearch } from "react-icons/go";
import { useSearch } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

// Search component
export const Search = ({ products }) => {
  // Navigate to search results page
  const navigate = useNavigate();
  // Access search context
  const { handleSearch } = useSearch();

  // Handle key press event
  const handleKeyPress = (e) => {
    // If Enter key is pressed, navigate to search results page
    if (e.key === "Enter") {
      navigate("/searchresults");
    }
  };

  // Render search input and button
  return (
    <div className="relative">
      <input
        type="text"
        name="search"
        // Call handleSearch function on input change
        onChange={(e) => handleSearch(e.target.value)}
        // Styling for search input
        className="w-full border h-10 shadow p-4 rounded-full  outline-fuchsia-500"
        placeholder="search"
        // Call handleKeyPress function on key down
        onKeyDown={handleKeyPress}
      />
      <button
        // Navigate to search results page on button click
        onClick={(e) => navigate("/searchresults")}
        // Call handleKeyPress function on key down
        onKeyDown={handleKeyPress}
        type="submit"
      >
        {/* Search icon */}
        <GoSearch className="text-fuchsia-400 h-5 w-5 absolute top-2.5 right-3 fill-current   outline-none" />
      </button>
    </div>
  );
};
