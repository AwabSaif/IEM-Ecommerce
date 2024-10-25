// Importing necessary libraries and components
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Importing CSS file
import App from "./App.jsx"; // Importing main App component
import { AuthProvider } from "./context/AuthProvider"; // Importing AuthProvider context
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importing BrowserRouter, Routes, and Route components from react-router-dom
import CartProvider from "./context/CartContext.jsx"; // Importing CartProvider context
import { SearchProvider } from "./context/SearchContext"; // Importing SearchProvider context

// Rendering the root React component into the DOM
ReactDOM.createRoot(document.getElementById("root")).render(
  // Wrapping the entire application with React.StrictMode for additional development checks
  <React.StrictMode>
    {/* Setting up browser router for handling routing */}
    <BrowserRouter>
      {/* Providing authentication context to the entire application */}
      <AuthProvider>
        {/* Providing cart context to the entire application */}
        <CartProvider>
          {/* Providing search context to the entire application */}
          <SearchProvider>
            {/* Defining routes for different components */}
            <Routes>
              {/* Route for rendering the main App component */}
              <Route path="/*" element={<App />} />
            </Routes>
          </SearchProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
