"use client";
import React, { useState } from "react";
import {
  LuVideo,
  LuCircleFadingPlus,
  LuSearch,
  LuMailPlus,
} from "react-icons/lu";
import { LuStar, LuBookText, LuMessageSquareMore } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeProvider";
import Link from "next/link";
import { sendMail } from "@/lib/sendMail";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
const DashBoardOptions = () => {
  const { darkTheme } = useTheme();

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("Hello from Next.js!");
  const [text, setText] = useState("This is a test email.");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await sendMail(to, subject, text);
      toast.success("Email sent successfully!");
      setTo("");
      setText("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-2 min-[1080px]:grid-cols-3 gap-6 w-full my-5 min-[1280px]:px-6">
      {/* First */}
      <div
        className={`${
          darkTheme ? "bg-slate-900 text-white" : "bg-white text-black"
        } py-3 px-4 rounded-md shadow`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-9 h-9 bg-blue-100 rounded-sm">
            <LuVideo className="text-xl text-blue-600" />
          </div>
          <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-pink-200 text-white ml-5 px-3 py-1 text-xs tracking-tight font-medium font-inter rounded-full flex items-center gap-2">
            Pro <LuStar className="text-whitetext-lg" />
          </span>
        </div>
        <h2 className="font-medium text-lg font-inter mt-2">
          Create New Interview
        </h2>
        <p className="text-sm font-light tracking-tight font-inter mt-2 text-gray-500">
          Create AI interviews for your candidates and get interview results,
          insights and more in minutes.
        </p>
        <Link href="/dashboard/create-interview">
          <Button
            className={`py-1 text-sm tracking-tight cursor-pointer font-inter w-fit mt-5 bg-blue-600 text-white `}
          >
            Create Interview <LuCircleFadingPlus />
          </Button>
        </Link>
      </div>
      {/* Second Card */}
      <div
        className={`${
          darkTheme ? "bg-slate-900 text-white" : "bg-white text-black"
        } py-3 px-4 rounded-md shadow`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center w-9 h-9 bg-blue-100 rounded-sm">
            <LuBookText className="text-xl text-blue-600" />
          </div>
          <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-pink-200 text-white ml-5 px-3 py-1 text-xs tracking-tight font-medium font-inter rounded-full flex items-center gap-2">
            Pro <LuStar className="text-whitetext-lg" />
          </span>
        </div>
        <h2 className="font-medium text-lg font-inter mt-2">
          Check Submitted Resume
        </h2>
        <p className="text-sm font-light tracking-tight font-inter mt-2 text-gray-500">
          See all the resume submitted by candidates during interviews in one
          place.
        </p>
        <Button
          className={`py-1 text-sm tracking-tight font-inter w-fit mt-5 bg-blue-600 text-white `}
        >
          Check Resume <LuSearch />
        </Button>
      </div>
      {/* Third Card */}
      <div
        className={`${
          darkTheme ? "bg-slate-900 text-white" : "bg-white text-black"
        } py-3 px-4 rounded-md shadow`}
      >
        <div className="flex">
          <div className="flex items-center justify-center w-9 h-9 bg-blue-100 rounded-sm">
            <LuMessageSquareMore className="text-xl text-blue-600" />
          </div>
        </div>

        <h2 className="font-medium text-lg font-inter mt-2">
          Send Mails to Candidates
        </h2>
        <p className="text-sm font-light tracking-tight font-inter mt-2 text-gray-500">
          Send Custom Mails to candidates and browse your all mails in one place
        </p>

        {/* Dialog Trigger Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="py-1 text-sm tracking-tight font-inter w-fit mt-5 bg-blue-600 text-white">
              Send Mails <LuMailPlus className="ml-1" />
            </Button>
          </DialogTrigger>

          {/* Dialog Content */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-lg font-sora flex items-center gap-5">
                Send Mail <LuMailPlus />
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Recipient email"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="font-inter"
              />
              <Input
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="font-inter"
              />
              <Textarea
                placeholder="Message"
                rows={4}
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="font-inter"
              />
              <Button onClick={handleSend} disabled={loading}>
                {loading ? "Sending..." : "Send"}
              </Button>
              {message && <p>{message}</p>}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DashBoardOptions;
