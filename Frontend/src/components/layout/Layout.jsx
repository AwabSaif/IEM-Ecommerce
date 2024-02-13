import { Outlet } from "react-router-dom";
import { Footer } from "../common/Footer";
import { Header } from "../common/Header";

// Layout component responsible for rendering header, children components, and footer
export const Layout = ({ children }) => {
  return (
    <>
      {/* Render the Header component */}
      <Header />

      {/* Outlet component renders nested child routes */}
      <Outlet className="min-h-[80vh]" />

      {/* Render the Footer component */}
      <Footer />
    </>
  );
};
