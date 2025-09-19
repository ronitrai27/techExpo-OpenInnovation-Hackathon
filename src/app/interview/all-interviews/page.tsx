/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/context/UserDetailContext";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { LuBookOpenCheck, LuCheck, LuInbox, LuWorkflow, LuClipboard } from "react-icons/lu";
import { getAllInterviews } from "@/lib/functions/dbActions";
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
      {/* TOP SECTION ------------------- */}
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
            </div>
          </div>
        </div>
      </div>

      {/* INTERVIEWS GRID ------------------- */}
      <main className="w-full px-4 sm:px-6 lg:px-10 py-10 bg-gray-50 min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
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
              <div
                key={iv.id}
                className="relative p-1 rounded-2xl h-full flex"
                style={{
                  backgroundColor: `hsl(${(iv.id * 50) % 360}, 70%, 95%)`,
                }}
              >
                <Card className="relative z-10 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border border-gray-100 flex flex-col w-full">
                  <CardHeader className=" flex-shrink-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold flex-shrink-0">
                          {iv.organization ? iv.organization[0] : "O"}
                        </div>
                        <p className="text-xs font-medium text-gray-600 font-inter truncate">
                          {iv.organization}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 font-inter whitespace-nowrap">
                        {createdAt}
                      </span>
                    </div>

                    <CardTitle className="text-base font-sora font-bold text-gray-900 leading-tight line-clamp-2 mb-2">
                      {iv.jobTitle}
                    </CardTitle>

                    <div className="flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 font-inter whitespace-nowrap">
                        {(() => {
                          try {
                            const types =
                              typeof iv.interviewType === "string"
                                ? JSON.parse(iv.interviewType)
                                : iv.interviewType;
                            return Array.isArray(types)
                              ? types.join(", ")
                              : types;
                          } catch {
                            return iv.interviewType;
                          }
                        })()}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 font-inter whitespace-nowrap">
                        {iv.interviewDuration} duration
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="p-3 pt-1 flex-1 flex flex-col">
                    <p className="text-sm text-gray-700 font-semibold line-clamp-3 mb-2 font-inter leading-relaxed flex-1">
                      {iv.jobDescription}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 mt-auto">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-400 font-inter mb-1">
                          Interview ID
                        </p>
                        <code className="text-xs font-medium px-2 py-1 bg-gray-50 text-gray-700 rounded font-mono truncate block">
                          {iv.interview_id}
                        </code>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(iv.interview_id, String(iv.id))
                        }
                        className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 font-inter px-2 py-1 h-auto flex-shrink-0"
                      >
                        {copySuccess[String(iv.id)] ? (
                          <>
                            <LuCheck className="w-3 h-3" />
                            <span className="hidden sm:inline">Copied</span>
                          </>
                        ) : (
                          <>
                            <LuClipboard className="w-3 h-3" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AllInterviews;
