import React, { useEffect, useState } from "react";
import moment from "moment";
import { HiOutlineUserGroup } from "react-icons/hi2";

export const Users = ({ users }) => {
  const [currentMonthUsers, setCurrentMonthUsers] = useState(0);
  const [previousMonthUsers, setPreviousMonthUsers] = useState(0);

  useEffect(() => {
    const currentMonthStart = moment().startOf("month").format("YYYY-MM-DD");
    const currentMonthEnd = moment().endOf("month").format("YYYY-MM-DD");

    const totalCurrentMonthUsers = users.reduce((acc, user) => {
      const userDate = moment(user.date).format("YYYY-MM-DD");

      if (userDate >= currentMonthStart && userDate <= currentMonthEnd) {
        return acc + 1;
      }
      return acc;
    }, 0);

    setCurrentMonthUsers(totalCurrentMonthUsers);
  }, [users]);

  useEffect(() => {
    const previousMonthStart = moment()
      .subtract(1, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const previousMonthEnd = moment()
      .subtract(1, "months")
      .endOf("month")
      .format("YYYY-MM-DD");

    const totalPreviousMonthUsers = users.reduce((acc, user) => {
      const userDate = moment(user.date).format("YYYY-MM-DD");

      if (userDate >= previousMonthStart && userDate <= previousMonthEnd) {
        return acc + 1;
      }
      return acc;
    }, 0);

    setPreviousMonthUsers(totalPreviousMonthUsers);
  }, [users]);

  const percentageDifference =
    ((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100;

  return (
    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
      <div className="bg-clip-border text-2xl mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-fuchsia-500 to-fuchsia-300 text-white shadow-fuchsia-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
        <HiOutlineUserGroup />
      </div>
      <div className="p-4 text-right">
        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
          Users
        </p>
        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
          {currentMonthUsers}
        </h4>
      </div>
      <div className="border-t border-blue-gray-50 p-4">
        <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
          {isFinite(percentageDifference) ? (
            <>
              {percentageDifference >= 0 ? (
                <span className="text-green-500">
                  +{percentageDifference.toFixed(2)}%
                </span>
              ) : (
                <span className="text-red-500">
                  {percentageDifference.toFixed(2)}%
                </span>
              )}
              &nbsp;{percentageDifference >= 0 ? "more" : "less"} than last
              month
            </>
          ) : (
            "No previous month data available"
          )}
        </p>
      </div>
    </div>
  );
};
