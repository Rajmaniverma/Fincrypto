import React from 'react'
import Image from 'next/image'
import Navigationbar from './menu'
import Stats from './Stats'
import Graph from './Graph'
import Dashboard from './Dashboard'
import SubGraph from './SubGraph/page'

const Head = () => {
  return (
    
    <div className='w-full bg-white min-h-screen flex flex-col gap-y-2 mb-5 '>
      
     <div className=' w-full max-w-14/15  mx-auto'>
         <Image src="/image.png" alt="Header image" width={150} height={400}   />
      <input type='text' placeholder='Search Ticket,Company or profile' className='text-gray-700  text-[15px] p-1 w-1/4 ring-[1px] font-extralight ring-gray-300 rounded-sm  ' />
     </div>
     <Navigationbar />
     <Stats />
    <Dashboard />
    </div>
  )
}

export default Head