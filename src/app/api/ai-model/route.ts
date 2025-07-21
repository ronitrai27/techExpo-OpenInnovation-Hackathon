/* eslint-disable @typescript-eslint/no-explicit-any */


import { NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

interface InterviewRequest {
  jobTitle: string;
  jobDescription: string;
  interviewDuration: string;
  interviewType: string | string[];
}

const questionSchema = z.array(
  z.object({
    interviewQuestions: z.array(
      z.object({
        question: z.string().describe("The interview question"),
        type: z
          .enum(["Technical", "Behavioral", "Problem Solving", "Leadership", "Experience"])
          .describe("The type of question"),
      })
    ),
  })
);


const parser = StructuredOutputParser.fromZodSchema(questionSchema);

const promptTemplate = PromptTemplate.fromTemplate(`
Based on the following inputs, generate a well-structured list of high-quality interview questions:
Job Title: {jobTitle}
Job Description: {jobDescription}
Interview Duration: {interviewDuration}
Interview Type: {interviewType}

Your task:
- Analyze the job description to identify the key responsibilities, required skills, and expected experience.
- Generate questions that can be all covered in  {interviewDuration}-minute interview, Take care of the time.
- Ensure ALL questions are ONLY of the types specified in {interviewType} (e.g., {interviewType}). Do NOT include questions of any other type.
- Ensure the questions match the tone and structure of a real-life {interviewType} interview.
- Return a JSON array containing a single object with the key 'interviewQuestions' containing an array of objects with 'question' and 'type' fields. Do not include markdown, explanations, or extra text.

{format_instructions}
`);

const llm = new ChatGroq({
  model: "meta-llama/llama-4-scout-17b-16e-instruct",
  temperature: 0.7,
  maxTokens: 600,
  maxRetries: 3,
});

const chain = promptTemplate.pipe(llm).pipe(parser);

export async function POST(request: Request) {
  try {
    const body: InterviewRequest = await request.json();
    const { jobTitle, jobDescription, interviewDuration, interviewType } = body;

    if (!jobTitle || !jobDescription || !interviewDuration || !interviewType) {
      return NextResponse.json(
        { isError: true, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const readableInterviewType = Array.isArray(interviewType)
      ? interviewType.join(", ")
      : interviewType;

    const input = {
      jobTitle,
      jobDescription,
      interviewDuration,
      interviewType: readableInterviewType,
      format_instructions: parser.getFormatInstructions(),
    };

    // Run the chain
    const result = await chain.invoke(input);

    // Fallback to extract inner object for UI
    const finalResult =
      Array.isArray(result) && result[0]?.interviewQuestions
        ? { interviewQuestions: result[0].interviewQuestions }
        : result;

    // console.log("✅ STRUCTURED OUTPUT:", JSON.stringify(finalResult, null, 2));

    return NextResponse.json({ data: finalResult });
  } catch (error: any) {
    console.error("❌ ERROR:", error);
    return NextResponse.json(
      { isError: true, error: error.message || "Failed to generate questions" },
      { status: 500 }
    );
  }
}