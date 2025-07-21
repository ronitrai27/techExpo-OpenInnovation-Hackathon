import InterviewLinkHeader from '@/components/InterviewLinkHeader'
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <InterviewLinkHeader/>
      {children}
    </div>
  )
}

export default layout
