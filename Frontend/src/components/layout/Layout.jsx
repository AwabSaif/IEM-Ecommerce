import { Outlet } from "react-router-dom";
import { Footer } from "../common/Footer";
import { Header } from "../common/Header";

export const Layout = ({ children }) => {
  return (
    <>
      <Header />

     
      <Outlet />
      {/* <div className="min-h-[80vh]"></div> */}
      {/* <div className="min-h-[80vh]">{children}</div> */}
      <Footer />
    </>
  );
};
