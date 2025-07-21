"use client";
import React from "react";
import clsx from "clsx";
import { BsStars } from "react-icons/bs";
import Image from "next/image";
import { supabase } from "@/services/supabaseClient";
import { toast } from "react-hot-toast";
import { SparklesCore } from "@/components/ui/sparkles";
const Login = () => {

  const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`, 
    },
  });

  if (error) {
    console.log("ERROR is there:", error.message);
    toast.error(error.message);
  }
};

  return (
    <div
      className={clsx(
        "flex items-center justify-center w-full h-screen bg-white"
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="text-sm px-6 text-gray-800 font-medium flex items-center justify-center gap-3 py-1 border border-yellow-500 rounded-full mb-20 animate-moving-gradient">
          Try it for Free <BsStars className="inline-flex text-black text-xl" />
        </div>
        <h1 className="font-extrabold md:text-6xl font-sora tracking-tight mb-3">
          VOCALX AI
        </h1>
      
        <h2 className="md:text-5xl font-inter font-semibold tracking-tight text-center max-w-[700px] mx-auto leading-tight">
          AI-powered Recruitment Platform To Simplify Hiring
        </h2>
          <div className="w-[40rem] relative my-5">
          {/* Gradients */}
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
          <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
          <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />
          <div className="max-w-[20rem] h-[2rem] mx-auto">
            <SparklesCore
              background="transparent"
              minSize={0.4}
              maxSize={1}
              particleDensity={1000}
              className="w-full h-full"
              particleColor="#0000"
            />
          </div>
        </div>

        <p className="text-gray-800 mt-6 text-lg font-inter">
          Sign in with Google to Start Using
        </p>
        <button
          onClick={signInWithGoogle}
          className="cursor-pointer bg-gray-800 px-8 py-2 rounded-xl mt-5"
        >
          <span className="flex items-center justify-between gap-5 font-sora text-white">
            <Image
              src="/google.png"
              alt="Google"
              width={25}
              height={25}
              className=""
            />
            Continue
          </span>
        </button>
        <p className="text-gray-400 mt-12 text-sm font-light cursor-pointer font-inter underline underline-offset-4 ">
          Terms & Conditions
        </p>
      </div>
    </div>
  );
};

export default Login;
