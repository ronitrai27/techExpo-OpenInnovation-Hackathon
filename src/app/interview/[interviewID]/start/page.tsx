/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
// 5bddec57-596b-458d-bdf5-e762fdc61a92
"use client";
import { useInterview } from "@/context/interviewContext";
import {
  InfoIcon,
  Loader2,
  LucideCheckCircle,
  Mic,
  PhoneMissed,
  SearchCheck,
  Timer,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Vapi from "@vapi-ai/web";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LuX } from "react-icons/lu";
import { toast } from "sonner";
import { json, set } from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/services/supabaseClient";
import { fi } from "zod/v4/locales";

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

if (!VAPI_PUBLIC_KEY) {
  throw new Error(
    "NEXT_PUBLIC_VAPI_PUBLIC_KEY is required. Please set it in your .env.local file."
  );
}

interface Message {
  type: "user" | "assistant";
  content: string;
}

const StartInterview = () => {
  const { interviewInfo, setInterviewInfo } = useInterview();
  const [vapiError, setVapiError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [caption, setCaption] = useState<string>("");
  const [activeUser, setActiveUser] = useState<boolean>(false);
  const [callFinished, setCallFinished] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversation, setConversation] = useState<string>("");
  const [generateLoading, setGenerateLoading] = useState<boolean>(false);

  const [vapi] = useState(() => new Vapi(VAPI_PUBLIC_KEY));

  useEffect(() => {
    interviewInfo && startCall();
  }, [interviewInfo]);

  const startCall = async () => {
    let questionList = "";
    interviewInfo?.interviewData?.forEach((item: any, index: number) => {
      questionList +=
        item.question +
        (index < interviewInfo.interviewData.length - 1 ? "," : "");
    });
    try {
      await vapi.start({
        // Basic assistant configuration
        model: {
          provider: "openai",
          model: "gpt-4.1-mini",
          messages: [
            {
              role: "system",
              content:
                `
You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.

Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ` +
                interviewInfo?.jobPosition +
                ` interview, Let's get started with a few questions!"

Ask one question at a time and wait for the candidate's response before proceeding. 
Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ` +
                questionList +
                `

If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"

Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"

Keep the conversation natural and engaging—use casual phrases like 
"Alright, next up..." or "Let's tackle a tricky one!"

Key Guidelines:
Be friendly, engaging, and witty ✏️
Keep responses short and natural, like a real conversation
Adapt based on the candidate's confidence level
Ensure the interview remains focused on React
`.trim(),
            },
          ],
        },

        // Voice configuration Elliot
        voice: {
          provider: "vapi",
          voiceId: "Hana",
        },

        // Transcriber configuration
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },

        // Call settings
        firstMessage:
          "Hi " +
          interviewInfo?.userName +
          ", how are you? Ready for your interview on " +
          interviewInfo?.jobPosition +
          "?",
        endCallMessage:
          "Thanks for chatting! Hope to see you crushing projects soon!",
        endCallPhrases: ["goodbye", "bye", "end call", "hang up"],

        // Silence timeout (in seconds)
        silenceTimeoutSeconds: 20,

        // Max call duration (in seconds) - 10 minutes/ 5min
        maxDurationSeconds: 300,
      });
    } catch (error) {
      console.error("Error starting call:", error);
      setVapiError(error);
      setLoading(false);
    }
  };
  vapi.on("speech-start", () => {
    // console.log("Speech has started");
    setActiveUser(true);
  });

  vapi.on("speech-end", () => {
    // console.log("Speech has ended");
    setActiveUser(false);
  });

  vapi.on("call-start", () => {
    console.log("Call has started");
    setIsCallActive(true);
    setLoading(false);
    toast.info("Interview Has been started", {
      description: (
        <span className="text-sm text-gray-500 font-medium">
          Your Interview Has Been started!{" "}
          <span className="text-blue-600">All the best</span>
        </span>
      ),
    });
  });

  vapi.on("call-end", () => {
    console.log("Call has stopped");
    setIsCallActive(false);
    setCallFinished(true);
  });
  useEffect(() => {
    if (callFinished) {
      GenerateFeedback();
      setIsDialogOpen(true);
      toast.success("Interview Has been Ended", {
        description: (
          <span className="text-sm text-gray-500 font-medium">
            Your Interview Has Been Ended!{" "}
          </span>
        ),
      });
    }
  }, [callFinished]);
  // TIMER--------------------------------
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isCallActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      // Reset timer when call ends
      setSeconds(0);
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCallActive]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((totalSeconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (totalSeconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

  useEffect(() => {
    vapi.on("message", (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const role = message.role === "user" ? "user" : "assistant";
        const content = message.transcript;

        //  Prevent duplicates
        setMessages((prev) => {
          if (prev.length > 0) {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg.type === role && lastMsg.content === content) {
              return prev;
            }
          }
          return [...prev, { type: role, content }];
        });

        // Show captions only for assistant
        if (role === "assistant") {
          setCaption(content);
          setTimeout(() => setCaption(""), 2000);
        }
      }
    });
  }, [vapi]);

  vapi.on("error", (e) => {
    console.error(e);
    setVapiError(e);
  });

  const stopCall = () => {
    vapi.stop();
  };

  // messages to pass to feedback
  const GenerateFeedback = async () => {
    setGenerateLoading(true);
    try {
      const res = await axios.post("/api/ai-feedback", {
        conversation: messages,
      });
      console.log("Feedback Result From GROQ LLM:", res.data);
      const { data, error } = await supabase
        .from("interview-details")
        .insert([
          {
            userName: interviewInfo?.userName,
            userEmail: interviewInfo?.userEmail,
            interview_id: interviewInfo?.interviewID,
            feedback: res.data,
            recomended: "No",
            acceptResume: interviewInfo?.acceptResume,
            organization: interviewInfo?.organization,
            resumeURL: interviewInfo?.resumeURL,
          },
        ])
        .select();
      console.log("✅ Interview Details:", data);
      toast.success("Feedback Generated Successfully", {
        description: (
          <span className="text-sm text-gray-500 font-medium">
            Feedback Generated Successfully!{" "}
          </span>
        ),
      })
    } catch (err) {
      console.error("❌ Test Feedback Error:", err);
    }finally {
      setGenerateLoading(false);
    }
  };

  const addMessage = (type: "user" | "assistant", content: string) => {
    const newMessage: Message = {
      type,
      content,
    };
    setMessages((prev) => [...prev, newMessage]);
    // User: hello
    // Assistant: Hi, how can I help?
    setConversation(
      (prev) => `${prev}\n${type === "user" ? "User" : "Assistant"}: ${content}`
    );
  };

  // --------------------TESTING-----------------------------
  // const handleCheckConversation = () => {
  //   console.log("🔹 Messages Array:", messages);
  // };

  const demoConversation = [
    { type: "assistant", content: "Hi, Renit. How are you?" },
    {
      type: "assistant",
      content: "Ready for your interview on React and Next.js vs Vue?",
    },
    { type: "assistant", content: "Able to work with MongoDB, PostgreSQL..." },
    {
      type: "user",
      content: "Uh, yes. I'm ready for that. I'm pretty excited.",
    },
    {
      type: "assistant",
      content:
        "Awesome. Let's kick things off, tell me among React, Next.js, Vue.js",
    },
    { type: "assistant", content: "Which one will you use and why?" },
    {
      type: "user",
      content: "Well, I will use Next.js for sure, because of its SSR and SSG",
    },
    { type: "assistant", content: "Thats great renit" },
    {
      type: "assistant",
      content: "Now tell me about your experience with react",
    },
    {
      type: "user",
      content:
        "I have worked with React for 2 years, where i learned lazy loading, hooks, context api",
    },
    {
      type: "assistant",
      content: "okay so tell me with your backend experience",
    },
    {
      type: "user",
      content:
        "Yes i worked with node , express , flask and even supabase.",
    },
    { type: "assistant", content: "Great, tell me something bout your projects?" },
    {
      type: "assistant",
      content: "Tell me any third party packages you have worked with in your project",
    },
    {
      type: "user",
      content:
        "yes, i created a neuratwin web app,  that uses openai api to generate text, langchain , mongodb , vapi ai for voice assistants, and sync with googpe calenders.",
    },
  ];

  //   -----------------------------
  return (
    <div className="relative mt-14 p-6 h-[calc(100vh-56px)]">
      <div className="flex items-center justify-between max-w-[900px] mx-auto">
        <h2 className="text-xl font-semibold  font-inter">
          AI INTERVIEW SESSION
        </h2>
        <p className="text-base tracking-tight font-semibold text-blue-500 max-w-[300px] mx-auto text-center">
          Important Notice: This feature has been stopped by the creater !!
        </p>
        <p className="text-xl flex items-center gap-3 font-semibold">
          <Timer /> {formatTime(seconds)}
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center bg-gray-50 py-12 px-4 mt-6">
        <div className="w-[440px] h-[380px] bg-blue-100 flex flex-col space-y-6 items-center justify-center rounded-md">
          <div className="relative">
            {activeUser && !loading && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-50 animate-ping "></span>
            )}
            <h1 className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-semibold font-sora">
              AI
            </h1>
          </div>

          <p className="mt-2 font-inter text-base font-medium">AI Recruiter</p>
        </div>
        {loading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="animate-spin" size={36} />
            <p className="font-sora text-lg"> Configuring Call</p>
          </div>
        )}

        <div className="w-[440px] h-[380px] bg-blue-100 flex flex-col  space-y-6 items-center justify-center rounded-md">
          <div className="relative">
            {!activeUser && !loading && !setCallFinished && (
              <span className="absolute inset-0 rounded-full bg-blue-500 opacity-50 animate-ping "></span>
            )}
            <Image
              src="/profile.png"
              width={90}
              height={90}
              alt="profile"
              className="object-cover"
            />
          </div>

          <p className="mt-2 font-inter text-base font-medium capitalize">
            {interviewInfo?.userName}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-10 mt-8">
        <Mic className="h-12 w-12 p-3 rounded-full bg-blue-500 text-white" />{" "}
        <AlertDialog>
          <AlertDialogTrigger className="w-12 h-12 p-3 rounded-full bg-red-500 text-white cursor-pointer hover:scale-105 transition-all">
            <PhoneMissed />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="font-sora">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-inter">
                This action cannot be undone. This will end your interview right
                away. Are you confirming your decision?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={stopCall} className="bg-red-500 ">
                Continue <LuX />
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {/* TESTIG ONLY--------------------- */}
         <Button className="text-base font-medium cursor-pointer" variant="outline" onClick={GenerateFeedback}>{generateLoading ? "Generating..." : "Generate Feedback (full stack)"}</Button>
      </div>

      <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2">
        {caption && (
          <p className="text-lg text-muted-foreground font-medium tracking-wide w-full">
            {caption}
          </p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="p-0 overflow-hidden rounded-md max-w-md ">
          {/* Header with gradient */}
          <DialogHeader className="bg-gradient-to-br from-blue-500 via-indigo-400 to-pink-300 p-5">
            <DialogTitle className="text-center flex items-center justify-center gap-3 text-white text-2xl font-semibold font-sora">
              Congratulations!{" "}
              <LucideCheckCircle className="w-7 h-7 text-white" />
            </DialogTitle>
            <DialogDescription className="text-lg text-gray-100 font-inter text-center">
              {interviewInfo?.userName}, your interview has ended successfully
            </DialogDescription>
          </DialogHeader>

          {/* Body */}
          <div className="p-6 text-center space-y-4">
            <p className="text-muted-foreground text-base font-inter">
              You’ve just completed your interview for <br />
              <span className="font-semibold">{interviewInfo?.jobTitle}</span>.
            </p>

            <p className="text-base text-gray-500">
              You can now safely leave this meeting.
            </p>

            <div className="bg-blue-200 border border-blue-600 p-3 rounded-md flex gap-3 mt-10">
              <InfoIcon className="w-8 h-8 text-blue-600" />
              <p className="tracking-tight text-sm font-inter">
                You can either close this tab or you can also check other
                interviews by clikcing on Explore!
              </p>
            </div>

            <div className=" grid grid-cols-2 justify-items-center gap-6">
              <Button
                onClick={() => setIsDialogOpen(false)}
                className="w-full  font-medium bg-gray-300 text-black cursor-pointer hover:bg-gray-100 "
              >
                Close
              </Button>
              <Button
                className="w-full  font-medium "
              >
                Explore <SearchCheck />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StartInterview;
