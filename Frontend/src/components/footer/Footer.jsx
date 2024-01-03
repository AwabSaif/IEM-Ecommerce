import React from 'react'

export const Footer = () => {
  return (
  
 
     <footer className="flex w-full flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
       <div color="blue-gray" className="font-normal pr-3">
         &copy; 2023 IEM-Awab Saif
       </div>
       <ul className="flex flex-wrap items-center gap-y-2 gap-x-8 pl-3">
         <li>
           <div
             as="a"
             href="#"
             color="blue-gray"
             className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
           >
               من نحن     
           </div>
         </li>
         
         <li>
           <div
             as="a"
             href="#"
             color="blue-gray"
             className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
           >
             السياسات
           </div>
         </li>
         <li>
           <div
             as="a"
             href="#"
             color="blue-gray"
             className="font-normal transition-colors hover:text-blue-500 focus:text-blue-500"
           >
            اتصل بنا
           </div>
         </li>
       </ul>
     </footer>

  )
}
