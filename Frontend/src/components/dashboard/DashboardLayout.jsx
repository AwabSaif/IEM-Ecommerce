import React from 'react'
import Sidebar from '../sidebar/Sidebar'

export const DashboardLayout = (children) => {
  return (
      <div className='min-h-[80vh]'>
        <Sidebar/>
        {children}
    </div>
    
  )
}
