"use client";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDetailContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { LuBookOpenCheck, LuCheck, LuInbox, LuWorkflow } from "react-icons/lu";
import { getAllInterviews } from "@/lib/functions/dbActions";
import { LuClipboard } from "react-icons/lu";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type InterviewData = {
  id: number; // bigint
  created_at: string; // timestamp with time zone
  jobTitle: string;
  jobDescription: string;
  interviewDuration: string;
  interviewType: string;
  acceptResume: boolean;
  questionList: any; // JSON structure
  userEmail: string;
  organization: string;
  interview_id: string;
};

const AllInterviews = () => {
  const [interviews, setAllInterviews] = useState<InterviewData[]>([]);
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({});
  const { users } = useUserData();
  useEffect(() => {
    if (!users?.[0]?.id) return;
    const load = async () => {
      try {
        const data = await getAllInterviews();
        setAllInterviews(data);
      } catch (err) {
        console.error("Failed to load interviews", err);
      }
    };

    load();
  }, [users?.[0]?.id]);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess((s) => ({ ...s, [id]: true }));
      setTimeout(() => setCopySuccess((s) => ({ ...s, [id]: false })), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  console.log("interviews", interviews);
  return (
    <div className="mt-16">
      <div className="border border-rose-400 bg-gradient-to-br from-rose-50 via-rose-50 to-rose-300 rounded-md  w-[900px] h-60 mx-auto mt-12 relative overflow-hidden">
        <div className="flex relative h-full">
          {/* Left side */}
          <Image
            src="/static1.png"
            alt="Decorative Element"
            width={300}
            height={300}
            className="object-comtain absolute left-0 -bottom-12 z-50"
          />

          <Image
            src="/static5.png"
            alt="Decorative Element"
            width={300}
            height={300}
            className=" absolute -left-2 -top-10 "
          />
          {/* RIGHT SIDE */}

          <div className="absolute -bottom-16 right-0 w-16 h-16">
            <div className="w-full h-full bg-white/40 rounded-tr-2xl rotate-45 transform origin-top-right"></div>
          </div>

          <div className="absolute bottom-20 -right-10 w-16 h-16">
            <div className="w-full h-full bg-white/30 rounded-tr-2xl rotate-6 transform origin-top-right"></div>
          </div>

          <div className="absolute -bottom-10 left-[45%] w-16 h-16">
            <div className="w-full h-full bg-white/40 rounded-tr-2xl rotate-6 transform origin-top-right"></div>
          </div>

          <div className="w-[64%] ml-auto h-full py-4 px-3">
            <h2 className="font-sora text-3xl font-extrabold tracking-tight text-pretty text-center capitalize leading-normal bg-gradient-to-br from-slate-800 via-rose-500 to-rose-300 text-transparent bg-clip-text">
              It&apos;s time to take your career to the next level and shine!
            </h2>

            <div className="flex items-center gap-5 mt-5 justify-center">
              <Button className="bg-white text-black font-inter text-sm cursor-pointer hover:bg-gray-100">
                Check Job Listings <LuInbox />
              </Button>
              {/* <Button className="bg-white text-black font-inter text-sm cursor-pointer hover:bg-gray-100">
                        Check Courses <LuBookOpenCheck />
                      </Button> */}
            </div>

            {/* <div className="flex items-center gap-5 mt-5 justify-center">
                      <Button className="bg-white text-black font-inter text-sm cursor-pointer hover:bg-gray-100">
                        Go To Career Board <LuWorkflow />
                      </Button>
                    </div> */}
          </div>
        </div>
      </div>

      <main className="w-full px-6 mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
          {interviews.map((iv) => {
            const createdAt = iv.created_at
              ? new Date(iv.created_at).toLocaleString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "—";

            return (
              <Card
                key={iv.id}
                className="shadow-sm hover:shadow-md transition"
              >
                <CardHeader className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      {iv.jobTitle}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {iv.organization}
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span className="text-xs text-muted-foreground">
                      {createdAt}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-800">
                        {iv.interviewType}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-800">
                        {iv.interviewDuration}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-2">
                  <p className="text-sm text-slate-600 line-clamp-3 mb-3">
                    {iv.jobDescription}
                  </p>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Interview ID
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs font-medium px-2 py-1 bg-slate-50 rounded">
                          {iv.interview_id}
                        </code>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(iv.interview_id, String(iv.id))
                        }
                        className="flex items-center gap-2"
                      >
                        {copySuccess[String(iv.id)] ? (
                          <>
                            <LuCheck /> Copied
                          </>
                        ) : (
                          <>
                            <LuClipboard /> Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AllInterviews;
