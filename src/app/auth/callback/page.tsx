/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/services/supabaseClient";
import { LuLoader } from "react-icons/lu";
import { useUserData } from "@/context/UserDetailContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { users, loading, isNewUser, constCreateNewUser } = useUserData();

  const [orgInput, setOrgInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!users || users.length === 0 || submitting) return;
    setSubmitting(true);

    const { error } = await supabase
      .from("users")
      .update({ organization: orgInput })
      .eq("id", users[0].id);

    if (error) {
      console.error("❌ Error updating organization:", error.message);
      setSubmitting(false);
    } else {
      await constCreateNewUser();
      router.push("/dashboard");
    }
  };

  useEffect(() => {
    if (users && !isNewUser) {
      router.push("/dashboard");
    }
  }, [loading, isNewUser, users]);

  if (loading || !users) {
    return (
      <div className="bg-gray-100 w-full h-screen flex justify-center items-center">
       
          <p className="text-2xl font-medium font-sora flex items-center gap-4">
            <LuLoader className="animate-spin text-xl text-black duration-500" />
            Redirecting To Dashboard...
          </p>
       
      </div>
    );
  }

  return isNewUser ? (
    <div className="bg-blue-100 w-full h-screen flex flex-col items-center justify-center">
      <div className="p-6 rounded-lg shadow-md border max-w-md w-full space-y-4 bg-white">
        <h1 className="font-extrabold text-2xl font-sora text-center">VOCALX AI</h1>
        <h2 className="text-xl font-medium font-sora text-center">Welcome {users?.[0].name}</h2>
        <p className="text-lg text-gray-500 font-medium font-inter text-center tracking-tight leading-snug">Before Proceeding , please enter your organization name.</p>
        <div className="space-y-3 mt-5">
          <label className="text-sm font-medium ">
            Enter your organization:
          </label>
          <Input
            value={orgInput}
            onChange={(e) => setOrgInput(e.target.value)}
            placeholder="e.g. Vrsa Analytics"
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={submitting || orgInput.trim() === ""}
          className="w-full"
        >
          {submitting ? (
            <span className="flex items-center gap-2 font-inter">
              <LuLoader className="animate-spin w-4 h-4" />
              Saving...
            </span>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    
    </div>
  ) : null;
}
