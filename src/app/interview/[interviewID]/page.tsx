import Image from 'next/image'
import React from 'react'

const Interview = () => {
  return (
    <div className='flex items-center justify-center w-full h-screen bg-gray-100'>
      <div className="bg-white p-4 flex flex-col rounded-md min-w-[360px] items-center justify-center">
        <h1  className='font-medium text-2xl tracking-tight capitalize font-inter mb-3'>Welcome  Candidate</h1>
        <Image
        src="/workspace.png"
        width={200}
        height={200}
        alt="workspace"
        />
        <div className='my-8'>
<p className="text-center text-xl font-medium tracking-tight font-inter">Full stack Developer</p>
        </div>
      </div>
      
    </div>
  )
}

export default Interview
