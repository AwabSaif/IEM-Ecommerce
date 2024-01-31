import React, { useEffect, useState } from "react";
import moment from "moment";
import { FaMoneyBill1Wave, FaMoneyBillTrendUp } from "react-icons/fa6";
export const TodayMoney = ({ orders }) => {
  const [dailySales, setDailySales] = useState(0);
  const [yesterdaySales, setYesterdaySales] = useState(0);

  useEffect(() => {
    const todayDate = moment().format("YYYY-MM-DD");

    const totalSales = orders.reduce((acc, order) => {
      const orderDate = moment(order.dateOrdered).format("YYYY-MM-DD");
      if (orderDate === todayDate) {
        return acc + order.totalPrice;
      }
      return acc;
    }, 0);

    setDailySales(totalSales);

    const yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");

    const yesterdayTotalSales = orders.reduce((acc, order) => {
      const orderDate = moment(order.dateOrdered).format("YYYY-MM-DD");
      if (orderDate === yesterdayDate) {
        return acc + order.totalPrice;
      }
      return acc;
    }, 0);

    setYesterdaySales(yesterdayTotalSales);
  }, [orders]);

  const salesDifference = dailySales - yesterdaySales;
  const percentageDifference = (
    (salesDifference / yesterdaySales) *
    100
  ).toFixed(2);

  return (
    <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
      <div className="bg-clip-border text-2xl mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
        <FaMoneyBill1Wave />
      </div>
      <div className="p-4 text-right">
        <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">
          Today's Money
        </p>
        <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
          ${dailySales}
        </h4>
      </div>
      <div className="border-t border-blue-gray-50 p-4">
        <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">
          {salesDifference >= 0 ? (
            <span className="text-green-500">+{percentageDifference}%</span>
          ) : (
            <span className="text-red-500">{percentageDifference}%</span>
          )}
          &nbsp;{salesDifference >= 0 ? "more" : "less"} than yesterday
        </p>
      </div>
    </div>
  );
};
