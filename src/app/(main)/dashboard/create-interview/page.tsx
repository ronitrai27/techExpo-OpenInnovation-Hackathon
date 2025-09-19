/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import { LuArrowLeft } from "react-icons/lu";
import { useUserData } from "@/context/UserDetailContext";
import { useTheme } from "@/context/ThemeProvider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import InterviewFormContainer from "@/components/InterviewFormContainer";
import { toast } from "sonner";
import InterviewQuestions from "@/components/InterviewQuestions";
import InterviewLink from "@/components/InterviewLink";
const CreateInterview = () => {
  const { darkTheme } = useTheme();
  const { users } = useUserData();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobDescription: "",
    interviewDuration: "",
    interviewType: [] as string[],
    acceptResume: true,
  });
  const [interviewID, setInterviewID] = useState<string>("");
  const onToggleInterviewType = (type: string) => {
    setFormData((prev) => {
      const isSelected = prev.interviewType.includes(type);
      return {
        ...prev,
        interviewType: isSelected
          ? prev.interviewType.filter((t) => t !== type)
          : [...prev.interviewType, type],
      };
    });
  };

  const onHandleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = () => {
    const { jobTitle, jobDescription, interviewDuration, interviewType } =
      formData;

    if (!jobTitle.trim()) {
      toast.error("Please enter the Job Title.");
      return;
    }

    if (
      jobDescription.trim().length < 50 &&
      jobDescription.trim().length > 800
    ) {
      toast.error("Job Description must be at least 50 characters.");
      return;
    }

    if (!interviewDuration) {
      toast.error("Please select Interview Duration.");
      return;
    }

    if (!interviewType) {
      toast.error("Please select Interview Type.");
      return;
    }

    toast.success("Data Saved Successfully");
    setStep(2);
  };

  const onCreateLink = (interview_id: string) => {
    setInterviewID(interview_id);
    setStep(3);
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 py-4 px-6">
      {step === 3 ? (
        <div
          className={`flex items-center justify-between px-4 py-1 rounded-md max-w-[680px] mx-auto ${
            darkTheme ? "bg-slate-900 text-white" : "bg-white text-black"
          } $`}
        >
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-2xl tracking-tight font-inter capitalize">
              Great, You are almost done
            </h1>
            <p className="font-inter text-lg tracking-tight leading-snug font-medium">
              Its Time to share this link with your candidates and get started. 
            </p>
          </div>
          <Image
            src="/growth.png"
            width={160}
            height={160}
            alt="welcome"
            className="object-cover"
          />
        </div>
      ) : (
        <div
          className={`flex items-center justify-between px-4 py-1 rounded-md max-w-[680px] mx-auto ${
            darkTheme ? "bg-slate-900 text-white" : "bg-white text-black"
          } $`}
        >
          <div className="flex flex-col gap-4">
            <h1 className="font-semibold text-2xl tracking-tight font-sora capitalize">
              {users?.[0].name}, Lets create interviews
            </h1>
            <p className="font-inter text-lg tracking-tight leading-snug font-medium">
              create custome interviews , select duration , type of interview
              and to accept resume.
            </p>
          </div>
          <Image
            src="/partnership.png"
            width={160}
            height={160}
            alt="welcome"
            className="object-cover"
          />
        </div>
      )}

      {/* main area */}
      <div className="w-full flex items-center justify-center">
        <div className="flex flex-col">
          <div className=" flex items-center gap-3 mt-10 ">
            <LuArrowLeft
              onClick={() => router.back()}
              className="text-blue-600 text-xl cursor-pointer"
            />
            <p className="font-medium font-inter text-xl">
              Create New Interview
            </p>
          </div>
          <Progress value={step * 33} className="w-[600px] mx-auto my-5" />
          {step === 1 && (
            <InterviewFormContainer
              formData={formData}
              onHandleInputChange={onHandleInputChange}
              onToggleInterviewType={onToggleInterviewType}
              onSubmit={handleSubmit}
            />
          )}
          {step === 2 && (
            <InterviewQuestions
              formData={formData}
              onCreateLink={(interview_id) => onCreateLink(interview_id)}
            />
          )}
          {step === 3 && (
            <InterviewLink  />
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateInterview;
