import { tool } from "@langchain/core/tools";
import { z } from "zod";
import sendFeedbackEmail from "./emailService.js";

const schemaSendEmail = z.object({
    email: z.string().describe("Email address of the user who wants to contact the developer"),
    body: z.string().describe("The message that the user wants to send to the developer"),
    name: z.string().optional().describe("Name or company name of the user (optional)").nullable(),
  });

export const sendEmailTool = tool(
    async function sendEmail(
      { email, body, name }: { email: string; body: string; name?: string }
    ) {
      return await sendFeedbackEmail(email, body, name);
    },
    {
      name: "sendEmailToDeveloperAboutCooperate",
      description:
        "Send a message from the user to the developer (Volodymyr) for contact or cooperation. Collect the user's email address, their message, and optionally their name or company name. IMPORTANT: If the message is about pricing or service rates, the name field is REQUIRED and must be collected before sending.",
      schema: schemaSendEmail,
    }
  );
  
