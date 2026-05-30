"use client"

import React, { useState,useEffect } from 'react';
import Clock from "./Clock";

const Navigationbar = () => {
    

  return (
    <div className='w-full bg-gray-700 h-10 flex '>
        <div className=' max-w-14/15 w-full mx-auto flex items-center px-2 gap-x-2 text-[14px] font-semibold  justify-between' >
     <ul className='flex justify-start flex-3 gap-x-2' >      <li className='hover:bg-gray-500 cursor-pointer' >Home</li>


       


        </ul>
        <ul className='flex flex-2 justify-end-safe gap-x-2 '>
            <li className='flex gap-x-2'>  <Clock />
            </li>
            |<li className="hover:bg-gray-500 cursor-pointer"  >❔Help</li>|
            <li className="hover:bg-gray-500 cursor-pointer">Login</li>|
            <li className="hover:bg-gray-500 cursor-pointer">Register</li>|
       
            </ul>
            </div>
    </div>
  )
}

export default Navigationbar;