import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"
const SUBJECT_TEXT: string = "новое сообщение с визитки";

export default async function sendFeedbackEmail(
  fromEmail: string,
  comment: string
): Promise<string> {
  const apiKey: string | undefined = process.env.BREVO_API_KEY;
  const senderEmail: string | undefined = process.env.EMAIL_SENDER;
  const recipientEmail: string | undefined = process.env.EMAIL_RECEPIENT;
  if (!apiKey) throw new Error("BREVO_API_KEY не настроен");
  if (!senderEmail) throw new Error("EMAIL_SENDER не настроен");
  if (!recipientEmail) throw new Error("EMAIL_RECEPIENT не настроен");
  const emailAPI = new TransactionalEmailsApi();
  emailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  const sender: { email: string; name?: string } = { email: senderEmail, name: "Business Card" };
  const to: Array<{ email: string }> = [{ email: recipientEmail }];
  const textContent: string = `Email отправителя: ${fromEmail}\n\nСообщение:\n${comment}`;
  const htmlContent: string = `<div><p><strong>Email отправителя:</strong> ${fromEmail}</p><p><strong>Сообщение:</strong></p><p>${comment.replace(/\n/g, "<br>")}</p></div>`;
  const email: SendSmtpEmail = {
    sender,
    to,
    replyTo: { email: fromEmail },
    subject: SUBJECT_TEXT,
    textContent,
    htmlContent,
  };
  const response = await emailAPI.sendTransacEmail(email);
  return "Message sent successfully";
}
