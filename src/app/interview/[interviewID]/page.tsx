/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/services/supabaseClient";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuClock2, LuMoveRight } from "react-icons/lu";
import { toast } from "sonner";
import { useInterview } from "@/context/interviewContext";
import { set } from "zod";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator"

const Interview = () => {
  const { interviewID } = useParams();
  // console.log("interviewID", interviewID);
  const router = useRouter();
  const { interviewInfo, setInterviewInfo } = useInterview();
  const [interviewDetails, setInterviewDetails] = useState<any>(null); //for displaying
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [wrongId, setWrongId] = useState<boolean>(false);

  useEffect(() => {
    interviewID && GetInterviewDetails();
  }, [interviewID]);

  const GetInterviewDetails = async () => {
    setLoading(true);
    try {
      const { data: interviews, error } = await supabase
        .from("interviews")
        .select(
          "jobTitle, jobDescription, interviewDuration,  acceptResume, organization"
        )
        .eq("interview_id", interviewID);

      if (interviews && interviews.length > 0) {
        setInterviewDetails(interviews[0]);
      } else {
        setWrongId(true);
        toast("Incorrect Interview ID");
      }
    } catch (err) {
      setLoading(false);
      toast("Incorrect Interview ID");
    } finally {
      setLoading(false);
    }

    // console.log("interviews", interviews);
  };

  const onJoinInterview = async () => {
    setLoading(true);
    const { data: interviews, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("interview_id", interviewID);

    if (interviews) {
      setInterviewInfo({
        userName: userName, 
        userEmail: userEmail,
        jobTitle: interviews[0].jobTitle,
        jobPosition: interviews[0].jobDescription,
        interviewDuration: interviews[0].interviewDuration,
        interviewData: interviews[0].questionList,
        interviewID: interviewID,
      });

      router.push(`/interview/${interviewID}/start`);
      setLoading(false);
    } else {
      toast("Incorrect Interview ID");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center py-12 w-full h-screen bg-gradient-to-br from-blue-100 to-indigo-300 absolute inset-0 z-0"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, #fff 40%, #6366f1 100%)",
      }}
    >
      {wrongId ? (
        <Card className="min-w-[440px] flex items-center justify-center">
          <h1>Dear Candidate</h1>
          <CardContent>
            <p>Your provided Interview ID is incorrect</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-gray-50 shadow-md px-4 py-6 flex flex-col border border-gray-300 rounded-md min-w-[480px] ">
          <h1 className="font-semibold text-2xl tracking-tight capitalize font-sora mb-3 text-center">
            Welcome Candidate
          </h1>
          <Image
            src="/workspace.png"
            width={150}
            height={150}
            alt="workspace"
            className="mx-auto"
          />
          <div className="">
            <p className="text-center text-xl font-semibold tracking-tight font-inter capitalize">
            {interviewDetails?.jobTitle || "Collecting Information..."}
            </p>
            <h2 className="text-center text-lg font-semibold tracking-tight font-inter">
             {interviewDetails?.organization}
            </h2>

            <p className="mt-3 text-center text-base font-inter flex items-center justify-center gap-3 mb-2">
               Duration:   
              <LuClock2 />
           {interviewDetails?.interviewDuration} minutes
            </p>

            <Separator className="my-4" />

            <div className="w-full px-4 flex flex-col space-y-2">
              <div className="flex gap-2 items-center">
                <Label>FullName:</Label>
                <Input
                  placeholder="John Doe"
                  className="w-[320px] ml-auto mt-1 bg-white"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="flex gap-2 items-center">
                {" "}
                <Label>Email:</Label>
                <Input
                  placeholder="john@example.com"
                  className="w-[320px] ml-auto mt-1 bg-white"
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>

              <div className="flex gap-2 items-center">
                <Label>Resume:</Label>
                <Input type="file" className="w-[320px] ml-auto mt-1 bg-white" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-sky-100 border border-blue-400 rounded-md p-3 mt-8">
              <ul className="list-disc list-inside  text-blue-600 font-light text-base">
                <li>Make sure your camera and microphone works properly</li>
                <li>Ensure you have stable internet connection</li>
                <li>Find a quiet place for interview</li>
              </ul>
            </div>
            <div className="w-full flex items-center justify-center mt-4">
              <Button
                className=""
                disabled={loading || !userName || !userEmail}
                onClick={() => onJoinInterview()}
              >
                {loading && <Loader2 className="mr-2  animate-spin" />} Join
                Interview <LuMoveRight />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Interview;
