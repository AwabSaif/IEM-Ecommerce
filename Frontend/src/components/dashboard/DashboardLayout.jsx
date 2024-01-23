import { Outlet } from "react-router-dom";
import Sidebar from '../sidebar/Sidebar'

export const DashboardLayout = ({children}) => {
  return (
      <>
        <Outlet />
        <Sidebar  />
      </>
   
    
  )
}
