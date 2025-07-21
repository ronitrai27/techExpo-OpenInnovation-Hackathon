/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LuLoader, LuX } from "react-icons/lu";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "./ui/separator";
import { LuArrowRight, LuBrain } from "react-icons/lu";
import { supabase } from "@/services/supabaseClient";
import { useUserData } from "@/context/UserDetailContext";
import { v4 as uuidv4 } from "uuid";
import { LuDelete } from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { LuListPlus } from "react-icons/lu";

interface InterviewFormData {
  jobTitle: string;
  jobDescription: string;
  interviewDuration: string;
  interviewType: string[];
  acceptResume: boolean;
}
type InterviewQuestion = {
  question: string;
  type:
    | "Technical"
    | "Behavioral"
    | "Problem Solving"
    | "Leadership"
    | "Experience";
};

type AIResponse = {
  interviewQuestions: InterviewQuestion[];
};

interface InterviewQuestionsProps {
  formData: InterviewFormData;
  onCreateLink: (id: string) => void;
}
const InterviewQuestions: React.FC<InterviewQuestionsProps> = ({
  formData,
  onCreateLink,
}) => {
  const { users } = useUserData();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const interview_id = uuidv4();
  const [newQuestion, setNewQuestion] = useState("");
  const [newType, setNewType] =
    useState<InterviewQuestion["type"]>("Technical");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateAIQna();
    }
  }, [formData]);

  const GenerateAIQna = async () => {
    setLoading(true);
    setIsError(false);

    const startDelay = new Promise((res) => setTimeout(res, 2000));

    try {
      const request = axios.post("/api/ai-model", formData);
      const [result] = await Promise.all([request, startDelay]);
      // console.log("AI Response------------->", result.data);
      // console.log("setQuestions------------->", questions);
      if (result?.data?.isError) {
        console.error("❌ AI Error:", result.data.error);
        toast(result.data.error || "An error occurred during AI generation.");
        setIsError(true);
        return;
      }
      setQuestions(result.data.data.interviewQuestions);
    } catch (e: any) {
      console.error("❌ Request failed:", e);
      toast("A network/server error occurred. Please try again.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async () => {
    setSaveLoading(true);
    const { data, error } = await supabase
      .from("interviews")
      .insert([
        {
          ...formData,
          questionList: questions,
          userEmail: users?.[0]?.email,
          organization: users?.[0]?.organization,
          interview_id: interview_id,
        },
      ])
      .select();
    setSaveLoading(false);
    onCreateLink(interview_id);
    toast("Interview is Ready");
  };

  const handleDelete = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;

    setQuestions((prev) => [...prev, { question: newQuestion, type: newType }]);
    setNewQuestion("");
    setNewType("Technical");
    setOpen(false);
  };

  return (
    <div className="p-4">
      {loading && (
        <div className="flex flex-col font-inter font-medium text-center bg-blue-100 px-6 py-4 border border-blue-400 rounded-lg mt-5">
          <p className="text-xl flex items-center justify-center gap-5">
            {" "}
            <LuLoader className="animate-spin transition-all duration-500 text-black text-2xl" />{" "}
            Generating AI Questions
          </p>
          <p className=" text-gray-500 tracking-tight mt-3 text-base">
            AI is generating personlaised Interview Questions tailored according
            to your Job Description and type.
          </p>
        </div>
      )}

      {isError && (
        <div className="flex flex-col font-inter font-medium text-center bg-red-100 px-6 py-4 border border-red-400 rounded-lg mt-5">
          <p className="text-xl flex items-center justify-center gap-5">
            {" "}
            <LuX className=" text-red-500 text-2xl" />
            Error Occured While Generating
          </p>
          <p className=" text-gray-500 tracking-tight mt-3 text-base">
            Its not you , It&apos;s us. Kindly try again generating the
            Questions from AI.
          </p>

          <Button
            className="cursor-pointer bg-red-500 hover:bg-red-600 text-white mt-5 px-4 w-fit mx-auto"
            onClick={() => router.push("/dashboard")}
          >
            Retry{" "}
          </Button>
        </div>
      )}

      {!loading && !isError && questions.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
          className="flex flex-col"
        >
          <h2 className="mb-3 font-semibold font-inter text-xl">
            Generated Questions
          </h2>
          <div className="bg-white px-5 py-4 max-w-[800px] mx-auto rounded-xl">
            <div className="flex items-center justify-end mb-3">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="mb-4 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer">Add New Question <LuListPlus className="text-white text-xl"/></Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Interview Question</DialogTitle>
                  </DialogHeader>

                  {/* Input */}
                  <Input
                    placeholder="Enter your question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="mt-2"
                  />

                  {/* Select Type */}
                  <Select
                    value={newType}
                    onValueChange={(value) =>
                      setNewType(value as InterviewQuestion["type"])
                    }
                  >
                    <SelectTrigger className="mt-4">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Behavioral">Behavioral</SelectItem>
                      <SelectItem value="Problem Solving">
                        Problem Solving
                      </SelectItem>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                      <SelectItem value="Experience">Experience</SelectItem>
                    </SelectContent>
                  </Select>

                  <DialogFooter className="mt-4">
                    <Button onClick={handleAddQuestion}>Add Question</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {questions.map((q, i) => (
              <motion.div
                key={i}
                custom={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.3 }}
                className="text-left mb-3"
              >
                <p className="text-lg font-medium tracking-tight text-gray-800 font-inter">
                  {q.question}
                </p>
                <div className="flex items-center justify-between px-2">
                  <p className="text-blue-600 my-2 font-light tracking-tight text-base font-inter">
                    Type: {q.type}
                  </p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" onClick={() => handleDelete(i)}>
                        <LuDelete className="text-xl" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remove</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <Separator className="my-2 bg-blue-100" />
              </motion.div>
            ))}
            <div className="flex items-center justify-evenly px-4 mt-3">
              <Button className="cursor-pointer bg-red-500 hover:bg-red-600 text-white mt-5 px-4 w-fit mx-auto">
                Cancel <LuX className="text-xl" />
              </Button>
              <Button
                onClick={onFinish}
                disabled={saveLoading}
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white mt-5 px-4 w-fit mx-auto"
              >
                {saveLoading && (
                  <LuLoader className="animate-spin transition-all duration-500 text-white text-2xl" />
                )}
                {saveLoading ? "Saving..." : "Finish"}
                <LuArrowRight className="text-xl" />
              </Button>
            </div>
            <div className="w-full bg-gradient-to-br from-blue-600 to-pink-300 via-indigo-400 flex items-center justify-end gap-8 p-4 mt-6 rounded-xl">
              <p className="text-white text-lg font-medium tracking-tight font-sora">
                Become Pro User and unlock every features
              </p>
              <Button className="cursor-pointer bg-white hover:bg-gray-100 text-black px-4 ">
                Generate New Questions <LuBrain className="text-xl" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewQuestions;
