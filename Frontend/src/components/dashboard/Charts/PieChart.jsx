import React, { useEffect, useState } from "react";
import moment from "moment";
import { TEChart } from "tw-elements-react";

export const PieChart = ({ users }) => {
  // State to store daily user counts
  const [dailyUserCounts, setDailyUserCounts] = useState([]);

  useEffect(() => {
    // Calculate the number of users for the last 7 days
    const last7DaysUserCounts = Array(7).fill(0);
    const today = moment().endOf("day");

    // Loop through each user
    users.forEach((user) => {
      const userDate = moment(user.registrationDate);

      // Check if the user registration date belongs to the last 7 days
      if (today.diff(userDate, "days") < 7) {
        const dayIndex = today.diff(userDate, "days");
        last7DaysUserCounts[dayIndex]++;
      }
    });

    // Update daily user counts state
    setDailyUserCounts(last7DaysUserCounts);
  }, [users]);

  return (
    <div>
      {/* Render the pie chart */}
      <TEChart
        type="pie"
        data={{
          labels: [
            // Generate labels for the last 7 days
            moment().subtract(6, "days").format("dddd"),
            moment().subtract(5, "days").format("dddd"),
            moment().subtract(4, "days").format("dddd"),
            moment().subtract(3, "days").format("dddd"),
            moment().subtract(2, "days").format("dddd"),
            moment().subtract(1, "days").format("dddd"),
            moment().format("dddd"),
          ],
          datasets: [
            {
              label: "User Counts",
              data: dailyUserCounts,
              backgroundColor: [
                // Background colors for each dataset
                "rgba(63, 81, 181, 0.5)",
                "rgba(77, 182, 172, 0.5)",
                "rgba(66, 133, 244, 0.5)",
                "rgba(156, 39, 176, 0.5)",
                "rgba(233, 30, 99, 0.5)",
                "rgba(66, 73, 244, 0.4)",
                "rgba(66, 133, 244, 0.2)",
              ],
            },
          ],
        }}
      />
    </div>
  );
};
