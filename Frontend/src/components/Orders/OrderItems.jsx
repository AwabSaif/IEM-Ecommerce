import React from "react";

export const OrderItems = ({ orderItems, totalPrice }) => {
  return (
    <div className="-mx-4  sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      <div className="inline-block min-w-full  shadow rounded-lg overflow-hidden">
        <table className="min-w-full  leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product iamge
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cost
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((orderItem) => (
              <tr key={orderItem.product.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <img
                          className="w-16"
                          src={orderItem.product.image}
                          alt={orderItem.product.image}
                        />
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {orderItem.product.name}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {orderItem.product.price}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {orderItem.quantity}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {orderItem.quantity * orderItem.product.price}$
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between ">
          <span className=" flex  flex-row items-center justify-between text-gray-900 whitespace-no-wrap ">
            TOTAL: &nbsp;{totalPrice}$
          </span>
        </div>
      </div>
    </div>
  );
};
