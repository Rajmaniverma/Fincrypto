import React from 'react'

const Stats = () => {
    const stats =["Price","Performance","Charts","Maps"];
    
  return (
    <div className=' w-full   mx-auto'>
        <nav className='flex '>
            <ul className='flex gap-x-2'>
              {stats.map((data,index)=>(   //yanha paar haam return or ( ) wala paranthesis laga bhul gaye isliye mapp me error tha
                <li className=' text-gray-700 font-semibold text-[14px]  flex gap-x-3 hover:ring-1  cursor-pointer active:hover:bg-blue-100 hover:ring-blue-400 hover:rounded-[3px] p-1' key={index}>{data}</li>
              ))}
            </ul>


        </nav>

    </div>
  )
}

export default Stats