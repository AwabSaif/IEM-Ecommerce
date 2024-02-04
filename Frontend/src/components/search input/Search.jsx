import { useState } from "react";
import { GoSearch } from "react-icons/go";
import { useSearch } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";

export const Search = ({ products }) => {
  //navigate
  const navigate = useNavigate();
  const { handleSearch } = useSearch();
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      navigate("/searchresults");
    }
  };
  return (
    <div className="relative">
      <input
        type="text"
        name="search"
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full border h-10 shadow p-4 rounded-full  outline-fuchsia-500"
        placeholder="search"
        onKeyDown={handleKeyPress}
      />
      <button
        onClick={(e) => navigate("/searchresults")}
        onKeyDown={handleKeyPress}
        type="submit"
      >
        <GoSearch className="text-fuchsia-400 h-5 w-5 absolute top-2.5 right-3 fill-current   outline-none" />
      </button>
    </div>
  );
};
