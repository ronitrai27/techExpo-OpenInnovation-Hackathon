/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI, Type } from "@google/genai";
import { supabase } from "@/services/supabaseClient";
// import { useUserData } from "@/context/UserDetailContext";
// import nodemailer from "nodemailer";
import { toast } from "sonner";
// import dotenv from "dotenv";
import axios from "axios";
// dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_GENAI_KEY!,
});

type HistoryPart =
  | { text: string }
  | { functionCall: any }
  | { functionResponse: any };

const history: Array<{ role: string; parts: HistoryPart[] }> = [];

// ---------------TOOLS DEFINATION--------------------
async function createTicket({
  userId,
  description,
}: {
  userId: number;
  description: string;
}) {
  const { data, error } = await supabase.from("tickets").insert({
    userId,
    description,
    status: "pending",
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
  toast("Ticket has been created", {
    description: (
      <span className="text-gray-600 font-inter">
        We will get back to you soon.
      </span>
    ),
    action: {
      label: "Pending",
      onClick: () => console.log("Undo"),
    },
  });
  return { message: "Ticket created successfully", data };
}

async function sendMail(to: string, subject: string, body: string) {
  try {
    const res = await axios.post("/api/send-mail", { to, subject, body });
    if (res.data.success) {
      toast("Email has been sent", {
        description: (
          <span className="text-gray-600 font-inter">
            Email has been sent to {to}
          </span>
        ),
        
      });
      return `Email sent to ${to}, messageId: ${res.data.messageId}`;
    }
    return `Failed: ${res.data.error}`;
  } catch (err: any) {
    return `Error: ${err.message}`;
  }
}

// --------------------------TOOL DECLARARTION-----------------------------
export const sendMailDeclaration = {
  name: "sendMail",
  description: "Send an email using Gmail",
  parameters: {
    type: Type.OBJECT,
    properties: {
      to: { type: Type.STRING, description: "Recipient email address" },
      subject: { type: Type.STRING, description: "Subject of the email" },
      body: { type: Type.STRING, description: "Plain text body of the email" },
    },
    required: ["to", "subject", "body"],
  },
};

export const createTicketDeclaration = {
  name: "createTicket",
  description: "Create a new support ticket for the particular user issue",
  parameters: {
    type: Type.OBJECT,
    properties: {
      description: {
        type: Type.STRING,
        description: "Description of the user's issue",
      },
    },
    required: ["description"],
  },
};
let currentUserId: number | undefined;
// -----------------TOOL  MAPPING------------------------
type ToolMap = {
  createTicket: (args: { description: string }) => Promise<any>;
  sendMail: (args: {
    to: string;
    subject: string;
    body: string;
  }) => Promise<string>;
};

const availableTools: ToolMap = {
  createTicket: ({ description }) => {
    if (typeof currentUserId !== "number") {
      throw new Error("User ID is not defined");
    }
    return createTicket({ userId: currentUserId, description });
  },
  sendMail: ({ to, subject, body }) => sendMail(to, subject, body),
};

// -----------------------------AGENT------------------
export async function runAgent(userMessage: string, userId: number) {
  history.push({ role: "user", parts: [{ text: userMessage }] });
  currentUserId = userId;

  while (true) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: history,
      config: {
        systemInstruction: `
          You are helpful AI assitant fro company VOCLAX that is ai powered platform for complete hiring solution. Where HR can create interviews , and send the interview link to candidates and AI voice agents will take interview of the candidates and provide summary and insights. Other than that Candidates can also share their resume on this platform.
          You will help users to solve any query related to this platform, how to create interviews , send mails to candidates and even creating tickets for user issues.
          you can guide user to how to create interviews like in thses 3 steps below :
          1. add job title , description , duration, type and select whether to take resume from candidates or not.
          2. questions will be AI generated , u can manually add questions too or remove them.
          3. interview created , send links to candidates.

          other than that you have also 2 powerful tools to create tickets for user issues and send mails to candidates.
`,
        maxOutputTokens: 600,
        tools: [
          {
            functionDeclarations: [
              createTicketDeclaration,
              sendMailDeclaration,
            ],
          },
        ],
      },
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const { name, args } = response.functionCalls[0];
      const tool = availableTools[name as keyof ToolMap];
      const result = await tool(args as any);

      const functionResponsePart = {
        name: name,
        response: {
          result: result,
        },
      };

      // model response
      history.push({
        role: "model",
        parts: [
          {
            functionCall: response.functionCalls[0],
          },
        ],
      });
      //function reulst in history
      history.push({
        role: "user",
        parts: [
          {
            functionResponse: functionResponsePart,
          },
        ],
      });
    } else {
      history.push({
        role: "model",
        parts: [
          {
            text: response.text ?? "",
          },
        ],
      });
      return response.text ?? "";
    }
  }
}
