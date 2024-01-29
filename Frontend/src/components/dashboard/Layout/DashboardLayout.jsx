import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";


export const DashboardLayout = () => {
  return (
    <div  className="flex ">
        <Sidebar  />
        <div className="h-full flex-1 p-7">
       
        {/* <div className="text-2xl font-semibold "> </div> */}
        <Outlet />
      </div>
        </div>
   
    
  )
}