import React from "react";

// Functional component to display order items
export const OrderItems = ({ orderItems, totalPrice }) => {
  console.log(orderItems + totalPrice);
  return (
    <div className="-mx-4  sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
      {/* Container for order items */}
      <div className="inline-block min-w-full  shadow rounded-lg overflow-hidden">
        {/* Table to display order item details */}
        <table className="min-w-full  leading-normal">
          <thead>
            {/* Table header */}
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product Image
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product Name
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
            {/* Loop through order items and display each item */}
            {orderItems.map((orderItem) => (
              <tr key={orderItem?.product.id || "NA"}>
                {/* Product Image */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <div className="items-center">
                    <div className="ml-3">
                      {/* Display product image */}
                      <img
                        className="w-16"
                        src={orderItem.product.image || "NA"}
                        alt={orderItem.product.image || "NA"}
                      />
                    </div>
                  </div>
                </td>
                {/* Product Name */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {orderItem?.product.name || "NA"}
                  </p>
                </td>
                {/* Product Price */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {orderItem?.product.price || "NA"}
                  </p>
                </td>
                {/* Quantity */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {orderItem?.quantity || "NA"}
                  </p>
                </td>
                {/* Total Price */}
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {orderItem.quantity * orderItem.product.price || "NA"}$
                  </p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Display total price */}
        <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between ">
          <span className=" flex  flex-row items-center justify-between text-gray-900 whitespace-no-wrap ">
            TOTAL: &nbsp;{totalPrice || "NA"}$
          </span>
        </div>
      </div>
    </div>
  );
};
