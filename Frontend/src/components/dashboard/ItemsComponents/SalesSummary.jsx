import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaMoneyBillTrendUp } from "react-icons/fa6";

// SalesSummary component receives orders as props
export const SalesSummary = ({ orders }) => {
  // State variables to hold monthly and previous month sales
  const [monthlySales, setMonthlySales] = useState(0);
  const [previousMonthSales, setPreviousMonthSales] = useState(0);

  // useEffect hook to calculate monthly and previous month sales
  useEffect(() => {
    // Get current date
    const currentDate = moment();
    // Calculate start and end of current month
    const startOfMonth = currentDate.startOf("month").format("YYYY-MM-DD");
    const endOfMonth = currentDate.endOf("month").format("YYYY-MM-DD");

    // Calculate total monthly sales
    const totalMonthlySales = orders.reduce((acc, order) => {
      const orderDate = moment(order.dateOrdered).format("YYYY-MM-DD");
      if (orderDate >= startOfMonth && orderDate <= endOfMonth) {
        return acc + order.totalPrice;
      }
      return acc;
    }, 0);
    setMonthlySales(totalMonthlySales);

    // Calculate start and end of previous month
    const previousMonthStart = currentDate
      .subtract(1, "months")
      .startOf("month")
      .format("YYYY-MM-DD");
    const previousMonthEnd = currentDate.endOf("month").format("YYYY-MM-DD");

    // Calculate total sales of previous month
    const totalPreviousMonthSales = orders.reduce((acc, order) => {
      const orderDate = moment(order.dateOrdered).format("YYYY-MM-DD");
      if (orderDate >= previousMonthStart && orderDate <= previousMonthEnd) {
        return acc + order.totalPrice;
      }
      return acc;
    }, 0);
    setPreviousMonthSales(totalPreviousMonthSales);
  }, [orders]);

  // Calculate sales difference and percentage difference
  const salesDifference = monthlySales - previousMonthSales;
  const percentageDifference = (
    (salesDifference / previousMonthSales) * 100
  ).toFixed(2);

  // Return JSX for SalesSummary component
  return (
    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
      <div className="bg-clip-border text-2xl mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
        <FaMoneyBillTrendUp />
      </div>
      <div className="p-4 text-right">
        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
          Sales this month
        </p>
        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
          ${monthlySales}
        </h4>
      </div>
      <div className="border-t border-blue-gray-50 p-4">
        <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
          {isFinite(percentageDifference) ? (
            <>
              {salesDifference >= 0 ? (
                <span className="text-green-500">+{percentageDifference}%</span>
              ) : (
                <span className="text-red-500">{percentageDifference}%</span>
              )}
              &nbsp;{salesDifference >= 0 ? "more" : "less"} than the previous
              month
            </>
          ) : (
            "No previous month sales data available"
          )}
        </p>
      </div>
    </div>
  );
};
