import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

import { SalesSummary } from "./ItemsComponents/SalesSummary";
import { TodayMoney } from "./ItemsComponents/TodayMoney";
import { Users } from "./ItemsComponents/Users";
import { Products } from "./ItemsComponents/Products";
import { BarChart } from "./Charts/BarChart";
import { PieChart } from "./Charts/PieChart";

/*
 DashboardItems component displays various components 
   related to dashboard items such as today's sales, users, products */
export const DashboardItems = () => {
  const { auth } = useAuth();
  const token = auth.token;
  const [orders, SetOrders] = useState([]);
  
  /*
   useEffect hook to fetch orders data from the API
   */
  useEffect(() => {
    const getOrders = async () => {
      try {
        const response = await axios.get("/api/orders", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });

        SetOrders(response.data);
      } catch (error) {
        console.error("Error fetching Orders:", error);
      }
    };

    getOrders();
  }, [token]);

  const [users, SetUsers] = useState([]);
  
  /**
   * useEffect hook to fetch users data from the API
   */
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await axios.get("/api/users", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });

        SetUsers(response.data);
      } catch (error) {
        console.error("Error fetching Users:", error);
      }
    };

    getUsers();
  }, [token]);

  const [products, SetProducts] = useState([]);
  
  /*
    useEffect hook to fetch products data from the API
   */
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.get("/api/products", {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
          },
          withCredentials: true,
        });

        SetProducts(response.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    getProducts();
  }, [token]);

  return (
    <div className="mt-12">
      {/* Today's Money, Users, Products, and Sales Summary */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        <TodayMoney orders={orders} />
        <Users users={users} />
        <Products products={products} />
        <SalesSummary orders={orders} />
      </div>

      {/* Bar Chart and Pie Chart */}
      <div className="mb-4 grid grid-cols-2 gap-6">
        <div className="flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md overflow-hidden xl:col-span-2">
          <div className="bg-clip-border rounded-xl overflow-hidden bg-transparent shadow-none md-p-6 m-0 sm:flex-col md:flex-col lg:flex-row xl:flex-row flex items-center justify-between p-6">
            {/* Bar Chart for Sales in last 7 days */}
            <div className="flex flex-col">
              <h4 className="block mb-4 antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                Sales in last 7 days
              </h4>
              <div className="md:w-full lg:w-[600px] rounded-xl bg-white text-gray-700 shadow-md">
                <BarChart orders={orders} />
              </div>
            </div>
            {/* Pie Chart for New users in last 7 days */}
            <div className="flex flex-col">
              <h4 className="block mb-4 antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">
                New users in last 7 days
              </h4>
              <div className="md:w-full lg:w-[350px] rounded-xl bg-white text-gray-700 shadow-md">
                <PieChart users={users} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
