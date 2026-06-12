"use client";

import React from "react";

import { useRouter } from "next/navigation";

const Navigationbar = () => {
  const router = useRouter();

  return (
    <div className="w-full bg-gray-700 h-10 flex">
      <div className="max-w-14/15 w-full mx-auto flex items-center px-2 gap-x-2 text-[14px] font-semibold justify-between">
        
        <ul className="flex justify-start flex-3 gap-x-2">
          <li className="hover:bg-gray-500 cursor-pointer">
            Home
          </li>
        </ul>

        <ul className="flex flex-2 justify-end-safe gap-x-2">


          <li className="hover:bg-gray-500 cursor-pointer">Help❔</li>|
          
          <li
            className="hover:bg-gray-500 cursor-pointer"
            onClick={() => router.push("/frontend/Admin")}
          >
            Login
          </li>
          |

          <li className="hover:bg-gray-500 cursor-pointer">
            Register
          </li>
          |
        </ul>

      </div>
    </div>
  );
};

export default Navigationbar;