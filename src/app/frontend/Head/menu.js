"use client"

import React, { useState,useEffect } from 'react';
import Clock from "./Clock";

const Navigationbar = () => {
    

  return (
    <div className='w-full bg-gray-700 h-10 flex '>
        <div className=' max-w-14/15 w-full mx-auto flex items-center px-2 gap-x-2 text-[14px] font-semibold  justify-between' >
     <ul className='flex justify-start flex-3 gap-x-2' >      <li className='hover:bg-gray-500 cursor-pointer' >Home</li>|

        <li className='hover:bg-gray-500 cursor-pointer' >News</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Screener</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Charts</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Maps</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Groups</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Portfolio</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Insider</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Futures</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Forex</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Crypto</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Calendar</li>|
        <li className='hover:bg-gray-500 cursor-pointer' >Pricing</li>|

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