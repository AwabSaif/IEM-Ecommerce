import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

export const User = () => {
  const [user, setUser] = useState();

  useEffect(() => {
    let isMounted = true;
    const controller =  new AbortController();
    
    const getUser = async () =>{
      try {
        const response = await axios.get('/user',{
          signal:controller.signal
        });
        console.log(response.data);
        isMounted && setUser(response.data)
      } catch (err) {
        console.log(err);
      }
    }
    
    getUser();
    
    return()=>{
      isMounted = false;
      controller.abort();
    }
    
  }, []);

  return (
    <article>
      <div className="flex items-center justify-end my-2">
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
          <div className="justify-end px-4 pt-4 "></div>
          <div className="flex flex-col items-center pb-10">
          {/*   {user.map((user) => {
              <img
                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                src={user?.photo}
                alt="Bonnie image"
              />;
            })} */}

            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
              Bonnie Green
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Visual Designer
            </span>
          </div>
        </div>
      </div>
    </article>
  );
  {
    /*     <button id="dropdownButton" data-dropdown-toggle="dropdown" className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5" type="button">
            <span className="sr-only">Open dropdown</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
            </svg>
            </button>
            
            <div id="dropdown" className="z-10 hidden text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
            <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
            </li>
            <li>
            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
            </li>
            <li>
            <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
            </li>
            </ul>
          </div> */
  }
};
