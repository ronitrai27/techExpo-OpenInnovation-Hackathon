"use client"
import React, { useState } from 'react'
import { LuVideo  } from "react-icons/lu";
const DasboardRecentInterviews = () => {
    const [interviewList, setInterviewList] = useState([]);
  return (
    <div className='my-5'>
      <div className='flex items-center gap-3'>
         <div className="w-5 h-5 bg-blue-200 rounded-full animate-pulse transition-all duration-700"></div>
        <h2 className='font-semibold text-xl font-inter capitalize'>Recent Interviews</h2>
      </div>

      <div className='w-full flex items-center justify-center mt-20'>
        {interviewList?.length == 0 && 
        <div className=' flex flex-col justify-center items-center'>
          <LuVideo className='text-3xl text-blue-600'/>
          <p className="text-xl font-medium tracking-tight font-inter mt-2 text-gray-500">No Interviews to display</p>
        </div>
        }
      </div>
     
      
    </div>
  )
}

export default DasboardRecentInterviews
