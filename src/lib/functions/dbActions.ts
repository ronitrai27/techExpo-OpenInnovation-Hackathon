"use server";
import { redis } from "@/lib/redis";
import { supabase } from "@/services/supabaseClient";

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

export async function getAllInterviews(): Promise<InterviewData[]> {
  const cacheKey = `interviews`;

  // 1. Try Redis
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`----✅ ALL Interviews HIT from Redis for key: ${cacheKey}`);
    try {
      let parsed: InterviewData[];

      if (typeof cached === "object" && cached !== null) {
        parsed = cached as InterviewData[];
      } else if (typeof cached === "string") {
        parsed = JSON.parse(cached) as InterviewData[];
      } else {
        throw new Error("Cached data is neither an object nor a string");
      }

      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn(`❌ Invalid cache data for key: ${cacheKey}`, err);
    }
  } else {
    console.log(`--- Cache miss for interviews: ${cacheKey} ---`);
  }

  // 2. Fetch from DB
  const { data, error } = await supabase
    .from("interviews")
    .select(
      `id, created_at, jobTitle, jobDescription, interviewDuration, interviewType, acceptResume, questionList, userEmail, organization, interview_id`
    );

  if (error) {
    console.error("Error fetching interviews:", error);
    return [];
  }

  if (!data || data.length === 0) {
    console.warn("⚠️ No interviews found in DB");
    return [];
  }

  // 3. Cache in Redis
  await redis.set(cacheKey, JSON.stringify(data), { ex: 600 });
  console.log("📦 Interviews fetched from DB and cached in Redis");

  return data as InterviewData[];
}
