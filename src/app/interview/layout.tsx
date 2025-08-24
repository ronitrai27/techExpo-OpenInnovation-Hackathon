"use client";
import InterviewLinkHeader from '@/components/InterviewLinkHeader'
import { InterviewProvider } from "@/context/interviewContext";
import { Toaster } from "@/components/ui/sonner"
import React from 'react'

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <InterviewProvider>
        <InterviewLinkHeader/>
      {children}
      </InterviewProvider>
       <Toaster />
    </div>
  )
}

export default layout
