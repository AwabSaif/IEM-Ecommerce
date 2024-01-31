import React from "react";

export const OrderPrintComponent = ({ orders }) => {
  return (
    <div className="-mx-4  sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <div className="inline-block min-w-full  shadow rounded-lg overflow-hidden">
        <table className="min-w-full  leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3  border-b-2 text-center border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                User
              </th>
              <th className="px-5 py-3 border-b-2 text-center border-gray-200 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Order number
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Created at
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
            
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="items-center">
                    <div className="text-center">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order?.user.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5  text-center border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {order?.orderNumber}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {order?.status}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {order?.dateOrdered
                      ? new Date(order.dateOrdered).toLocaleDateString("en-GB")
                      : ""}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {order?.totalPrice}
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
