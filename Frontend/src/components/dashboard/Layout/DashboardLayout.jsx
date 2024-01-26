import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";


export const DashboardLayout = ({children}) => {
  return (
    <div className="flex  ">
        <Sidebar  />
        <div className="h-full flex-1 p-7">
       
        <h1 className="text-2xl font-semibold "> <Outlet /></h1>
      </div>
        </div>
   
    
  )
}