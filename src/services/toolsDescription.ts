import { tool } from "@langchain/core/tools";
import { z } from "zod";
import sendFeedbackEmail from "./emailService.js";

const schemaSendEmail = z.object({
    email: z.string().describe("Email address of the user who wants to contact the developer"),
    body: z.string().describe("The message that the user wants to send to the developer"),
  });

export const sendEmailTool = tool(
    async function sendEmail(
      { email, body }: { email: string, body: string }
    ) {
      return await sendFeedbackEmail(email, body);
    },
    {
      name: "sendEmailToDeveloperAboutCooperate",
      description:
        "Send a message from the user to the developer (Volodymyr) for contact or cooperation. The email parameter should be the user's email address, and the body parameter should contain the message they want to send to the developer.",
      schema: schemaSendEmail,
    }
  );
  
