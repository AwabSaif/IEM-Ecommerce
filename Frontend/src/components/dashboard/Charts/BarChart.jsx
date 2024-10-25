import React, { useEffect, useState } from "react";
import moment from "moment";
import { TEChart } from "tw-elements-react";

export const BarChart = ({ orders }) => {
  // State to store weekly sales data
  const [weeklySales, setWeeklySales] = useState([]);

  useEffect(() => {
    // Initialize an array to store sales for the last 7 days
    const last7DaysSales = Array(7).fill(0);
    // Get today's date
    const today = moment().endOf("day");

    // Loop through orders to calculate sales for each of the last 7 days
    orders.forEach((order) => {
      const orderDate = moment(order.dateOrdered);

      // Check if the order is within the last 7 days
      if (today.diff(orderDate, "days") < 7) {
        const dayIndex = today.diff(orderDate, "days");
        // Accumulate total price for the day
        last7DaysSales[dayIndex] += order.totalPrice;
      }
    });

    // Set the weekly sales data
    setWeeklySales(last7DaysSales);
  }, [orders]); // Run effect whenever orders change

  return (
    <div className="">
      {/* Render the bar chart */}
      <TEChart
        type="bar"
        data={{
          // Labels for the last 7 days
          labels: [
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
              // Dataset for last 7 days sales
              label: "Last 7 Days Sales",
              data: weeklySales, // Weekly sales data
              backgroundColor: [
                // Colors for bars
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(100, 100, 100, 0.2)",
              ],
              borderColor: [
                // Border colors for bars
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(100, 100, 100, 1)",
              ],
              borderWidth: 1,
            },
          ],
        }}
      />
    </div>
  );
};
