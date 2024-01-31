import React, { useEffect, useState } from "react";
import moment from "moment";
import { TEChart } from "tw-elements-react";

export const BarChart = ({ orders }) => {
  const [weeklySales, setWeeklySales] = useState([]);

  useEffect(() => {
    const last7DaysSales = Array(7).fill(0);
    const today = moment().endOf("day");

    orders.forEach((order) => {
      const orderDate = moment(order.dateOrdered);

      if (today.diff(orderDate, "days") < 7) {
        const dayIndex = today.diff(orderDate, "days");
        last7DaysSales[dayIndex] += order.totalPrice;
      }
    });

    setWeeklySales(last7DaysSales);
  }, [orders]);

  return (
    <div className="">
      <TEChart
        type="bar"
        data={{
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
              label: "Last 7 Days Sales",
              data: weeklySales,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(100, 100, 100, 0.2)",
              ],
              borderColor: [
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
