/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useRef, useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { useUserData } from "@/context/UserDetailContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import DashBoardOptions from "@/components/DashBoardOptions";
import DasboardRecentInterviews from "@/components/DasboardRecentInterviews";
import { SheetDemo } from "@/components/DashBoardRightSlider";



const Page = () => {
  const { darkTheme } = useTheme();
  const { users } = useUserData();

  return (
    <div
      className={`w-full h-full ${
        !darkTheme
          ? "bg-gradient-to-br from-blue-50 to-gray-100"
          : "bg-gray-200"
      } relative`}
    >
      <div className="flex-1">
        <div className="w-full py-4 px-6">
          {/* WELCOM BOX */}
          <div
            className={`${
              darkTheme ? "bg-slate-800 text-white" : "bg-white text-black"
            } rounded-md flex items-center justify-between relative h-auto max-w-[620px] mx-auto shadow`}
          >
            <div className=" flex flex-col justify-evenly h-full py-3 px-4">
              <h1 className="font-semibold text-2xl tracking-tight capitalize font-sora mb-3">
                Welcome {users?.[0].name}
              </h1>
              <p className="font-inter text-base font-medium max-w-[400px]">
                Welcome to your dashboard. check out the recent activity , who
                has given the interview
              </p>
              <Button className="py-1 text-sm tracking-tight font-inter w-fit mt-5 bg-blue-500 text-white">
                View{" "}
              </Button>
            </div>
            <Image
              src="/discussion.png"
              width={180}
              height={180}
              alt="welcome"
              className="object-cover"
            />
          </div>
          {/* OPTIONS */}
          <DashBoardOptions />
          {/* RECENTLY INTERVIEWS */}
          <DasboardRecentInterviews />
        </div>
      </div>
      <SheetDemo />
    </div>
  );
};

export default Page;
