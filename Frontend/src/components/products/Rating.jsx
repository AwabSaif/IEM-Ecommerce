import React, { useState } from "react";
import { FaStar } from "react-icons/fa";

export const Rating = ({ rating55 }) => {
  //reating star
  const [rating, setrating] = useState(null);

  const ratings = [
    { value: 5, percentage: 66 },
    { value: 4, percentage: 33 },
    { value: 3, percentage: 16 },
    { value: 2, percentage: 8 },
    { value: 1, percentage: 6 },
  ];
  return (
    <div className="mt-8">
      <div className="mt-1 flex flex-row justify-start items-center">
        <p className="text-sm font-medium text-gray-600 mr-2">Enter your rating:</p>
        {[...Array(5)].map((star, i) => {
          const ratingValue = i + 1;

          return (
            <label>
              <input
                name="rating"
                type="radio"
                className=" hidden"
                value={ratingValue}
                onClick={() => setrating(ratingValue)}
              />
              <span className="block p-1 transition ease-in duration-300">
                <FaStar
                  className={`w-5 h-5 ${
                    ratingValue <= rating ? "text-yellow-300" : "text-gray-300"
                  }`}
                />
              </span>
            </label>
          );
        })}
      </div>
      <h3 className="text-lg font-bold text-yellow-300">Reviews(10)</h3>
      <div className="space-y-3 mt-4">
        {ratings.map((rating, index) => (
          <div key={index} className="flex items-center">
            <p className="text-sm text-white font-bold">{rating.value}.0</p>
            <FaStar className="w-5 text-yellow-300 ml-1" />
            <div className="bg-gray-400 rounded w-full h-2 ml-3">
              <div
                style={{ width: `${rating.percentage}%` }}
                className="h-full rounded bg-yellow-300"
              ></div>
            </div>
            <p className="text-sm text-white font-bold ml-3">
              {rating.percentage}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
