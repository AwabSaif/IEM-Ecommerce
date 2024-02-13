import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";

// Component for Dashboard Layout
export const DashboardLayout = () => {
  return (
    <div className="flex ">
        {/* Sidebar Component */}
        <Sidebar />
        {/* Main Content Area */}
        <div className="h-full flex-1 p-7">
        
          {/* Routing Outlet for rendering nested routes */}
          <Outlet />
        </div>
    </div>
  )
}
