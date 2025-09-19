/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/context/ThemeProvider";
import { useUserData } from "@/context/UserDetailContext";
import { supabase } from "@/services/supabaseClient";
import { Archive, Copy } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Briefcase,
  Clock,
  FileText,
  UserCheck,
  Calendar,
  Send,
  Grid2X2,
  List,
  Filter,
} from "lucide-react";
import { LuVideo } from "react-icons/lu";

const icons = [Briefcase, Clock, FileText, UserCheck, Calendar];

const AllInterview = () => {
  const { darkTheme } = useTheme();
  const { users } = useUserData();
  const [interviewList, setInterviewList] = useState<any>([]);
  const [view, setView] = useState("grid");

  useEffect(() => {
    users && GetInterviewList();
  }, [users]);

  const GetInterviewList = async () => {
    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("userEmail", users?.[0].email);

         setInterviewList(data);
  };

  return (
    <div
      className={`w-full h-full p-6 ${
        !darkTheme
          ? "bg-gradient-to-br from-blue-50 to-gray-100"
          : "bg-gray-200"
      } relative`}
    >
      <div className="">
        <div className=" flex items-center justify-between">
          <h2 className="font-semibold text-2xl font-inter capitalize ml-5">
          Interviews
          </h2>
          <div className="flex items-center gap-5 mr-10">
            <div className="space-x-2 bg-white p-2 rounded-md flex">
              <Button
                variant={view === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="rounded-md"
              >
                <Grid2X2 className="w-4 h-4" />
              </Button>

              <Button
                variant={view === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="rounded-md"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-md">
              <Filter />
              <p>Filters</p>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          {interviewList?.length == 0 && (
            <div className=" flex flex-col justify-center items-center mt-20">
              <LuVideo className="text-3xl text-blue-600" />
              <p className="text-2xl font-medium tracking-tight font-inter mt-2 text-gray-500">
                No Interviews to display
              </p>
            </div>
          )}
        </div>

        {interviewList && (
          <div
            className={`grid ${
              view === "grid" ? "grid-cols-2 min-[1220px]:grid-cols-3" : "grid-cols-1"
            } gap-4 mt-10`}
          >
            {interviewList?.map((item: any, index: number) => {
              const Icon = icons[index % icons.length]; // pick icon by index

              return (
                <Card
                  key={item.interview_id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition p-3"
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="p-2 rounded-md bg-gray-100">
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <CardTitle className="font-medium text-lg text-black font-sora">
                      {item.jobTitle}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="text-sm text-muted-foreground text-center font-inter space-y-2">
                    <p className="line-clamp-2">{item.jobDescription}</p>
                    <div className="flex items-center justify-start text-base mt-3 text-gray-500">
                      <span>⏱ {item.interviewDuration} mins</span>
                      {/* <span>📌 {item.interviewType}</span> */}
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-center gap-6">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `${window.location.origin}/interview/${item.interview_id}`;
                        navigator.clipboard.writeText(url);
                        toast.success("Link copied to clipboard");
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      Copy Link <Copy className="ml-2 w-4 h-4" />
                    </Button>

                    {/* <Button
                      size="sm"
                      className=" bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {}}
                    >
                      Send <Send className="ml-2 w-4 h-4" />
                    </Button> */}

                     <Button
                      size="sm"
                      variant="destructive"
                      className=""
                      onClick={() => {}}
                    >
                      Archive <Archive className="ml-2 w-4 h-4" />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default AllInterview;
