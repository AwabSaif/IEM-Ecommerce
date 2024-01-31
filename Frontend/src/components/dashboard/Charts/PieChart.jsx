import React, { useEffect, useState } from "react";
import moment from "moment";
import { TEChart } from "tw-elements-react";

export const PieChart = ({ users }) => {
  const [dailyUserCounts, setDailyUserCounts] = useState([]);

  useEffect(() => {
    // حساب عدد المستخدمين لآخر 7 أيام
    const last7DaysUserCounts = Array(7).fill(0);
    const today = moment().endOf("day");

    users.forEach((user) => {
      const userDate = moment(user.registrationDate);

      // التحقق مما إذا كانت تاريخ تسجيل المستخدم ينتمي إلى الأيام السبع الأخيرة
      if (today.diff(userDate, "days") < 7) {
        const dayIndex = today.diff(userDate, "days");
        last7DaysUserCounts[dayIndex]++;
      }
    });

    setDailyUserCounts(last7DaysUserCounts);
  }, [users]);

  return (
    <div>
      <TEChart
        type="pie"
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
              label: "User Counts",
              data: dailyUserCounts,
              backgroundColor: [
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
