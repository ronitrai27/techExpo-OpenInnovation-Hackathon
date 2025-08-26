"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { useUserData } from "@/context/UserDetailContext";
import { useTheme } from "@/context/ThemeProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Ghost, LucideLoader2 } from "lucide-react";
import { LuDock, LuWorkflow } from "react-icons/lu";
import Image from "next/image";

// ---------- Interfaces ----------
interface Question {
  question?: string;
  type?: string;
}

interface FeedbackRatings {
  technicalSkills?: number;
  communication?: number;
  problemSolving?: number;
  experience?: number;
}

interface FeedbackData {
  feedback: {
    rating: FeedbackRatings;
    summary: string;
    recommendation?: string;
    recommendationMessage: string;
  };
}

interface Feedback {
  data: FeedbackData;
}

interface InterviewDetails {
  userEmail?: string;
  userName?: string;
  feedback?: Feedback | null;
  resumeURL?: string | null;
  created_at?: string;
}

interface Interview {
  jobTitle?: string;
  jobDescription?: string;
  interview_id?: string;
  created_at?: string;
  interviewDuration?: number;
  interviewType?: string;
  acceptResume?: boolean;
  questionList?: Question[] | null;
  "interview-details"?: InterviewDetails[];
}

// ---------- Page ----------
export default function InterviewDetailsPage() {
  const { interview_id } = useParams();
  const { users } = useUserData();
  const { darkTheme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [interviewList, setInterviewList] = useState<Interview[] | null>(null);
  const [selectedCandidate, setSelectedCandidate] =
    useState<InterviewDetails | null>(null);

  useEffect(() => {
    users && GetInterviewList();
  }, [users]);

  const GetInterviewList = async () => {
    setLoading(true);
    try {
      const result = await supabase
        .from("interviews")
        .select(
          "jobTitle, jobDescription, interview_id,created_at,interviewDuration,interviewType,acceptResume,questionList, interview-details(userEmail,userName,feedback,resumeURL,created_at)"
        )
        .eq("userEmail", users?.[0].email)
        .eq("interview_id", interview_id);

      console.log("detailed candidate and interview data", result.data);

      setInterviewList(result.data as Interview[]);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="flex items-center gap-2">
          <LucideLoader2 className="animate-spin" size={32} />
          <h2 className="text-2xl">Loading Contents...</h2>
        </div>
      </div>
    );
  }

  const interview = interviewList?.[0];

  return (
    <div
      className={`${
        darkTheme ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      } h-full p-4`}
    >
      {/* INTERVIEW DETAILS */}
      {interview && (
        <Card className="max-w-5xl mx-auto mb-8 shadow border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold font-inter flex items-center gap-4">
              <p className="w-8 h-8 rounded-md bg-blue-200 flex items-center justify-center">
                <LuWorkflow />
              </p>
              Job Title: {interview.jobTitle}
            </CardTitle>
            <p className="text-base mt-3 text-muted-foreground">
              <span className="text-lg font-medium text-gray-800 font-inter">
                {" "}
                Description:{" "}
              </span>{" "}
              {interview.jobDescription}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 font-sora text-sm">
              <p>
                <span className="font-semibold">Duration:</span>{" "}
                {interview.interviewDuration} mins
              </p>
              <p>
                <span className="font-semibold">Accept Resume:</span>{" "}
                {interview.acceptResume ? "Yes" : "No"}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {interview.created_at
                  ? new Date(interview.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </p>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Questions:</h3>
              <div className="grid grid-cols-2 gap-3">
                {interview.questionList?.map((q, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-md border text-sm bg-white/50 dark:bg-gray-800"
                  >
                    <span className="font-semibold mr-2">{i + 1}.</span>
                    {q.question}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CANDIDATES */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-medium font-sora mb-4">
          {!loading && users && "Candidates"}
        </h2>

        {!loading && (
          <>
            {interview?.["interview-details"] &&
            interview["interview-details"].length > 0 ? (
              <div className="grid gap-4">
                {interview?.["interview-details"]?.map((cand, idx) => (
                  <Card
                    key={idx}
                    className="p-3 border-none shadow"
                    onClick={() => setSelectedCandidate(cand)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <Image
                          src="/profile.png"
                          alt="profile"
                          width={50}
                          height={50}
                          className="rounded-full"
                        />
                        <div>
                          <p className="font-semibold capitalize font-inter">
                            {cand.userName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {cand.userEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <Button variant="outline">
                          View Report <LuWorkflow />
                        </Button>
                        {cand.resumeURL && (
                          <Button variant="outline">
                            View Resume <LuDock />
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-lg font-sora text-center mt-14 text-gray-500 italic flex items-center justify-center gap-5">
                No one has applied for this interview yet. <Ghost className="ml-2" />
              </p>
            )}
          </>
        )}
      </div>

      {/* CANDIDATE DIALOG */}
      <Dialog
        open={!!selectedCandidate}
        onOpenChange={() => setSelectedCandidate(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Candidate Details</DialogTitle>
          </DialogHeader>
          {selectedCandidate && (
            <div className="space-y-4">
              <div>
                <p className="font-semibold">{selectedCandidate.userName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedCandidate.userEmail}
                </p>
                {selectedCandidate.resumeURL && (
                  <a
                    href={selectedCandidate.resumeURL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 underline"
                  >
                    View Resume
                  </a>
                )}
              </div>

              {/* Feedback Ratings with Progress */}
              {selectedCandidate.feedback?.data?.feedback?.rating && (
                <div className="space-y-3">
                  {Object.entries(
                    selectedCandidate.feedback.data.feedback.rating
                  ).map(([key, val]) => (
                    <div key={key}>
                      <p className="capitalize text-sm mb-1">{key}</p>
                      <Progress value={(val ?? 0) * 10} />
                    </div>
                  ))}
                </div>
              )}

              {/* Summary */}
              {selectedCandidate.feedback?.data?.feedback?.summary && (
                <div>
                  <h3 className="font-semibold">Summary</h3>
                  <p className="text-sm">
                    {selectedCandidate.feedback.data.feedback.summary}
                  </p>
                </div>
              )}

              {/* Recommendation */}
              {selectedCandidate.feedback?.data?.feedback?.recommendation && (
                <div>
                  <h3 className="font-semibold">Recommendation</h3>
                  <p className="text-sm">
                    {selectedCandidate.feedback.data.feedback.recommendation} –{" "}
                    {
                      selectedCandidate.feedback.data.feedback
                        .recommendationMessage
                    }
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
