import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"

const SUBJECT_TEXT: string = "новое сообщение с визитки";
const CONFIRMATION_SUBJECT_TEXT: string = "Ihre Nachricht wurde erhalten";

const CONFIRMATION_HTML_TEMPLATE: string = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <tr>
      <td style="padding: 40px 30px; text-align: center; background-color: #1a1a2e; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">Vielen Dank für Ihre Nachricht</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px;">
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
          Sehr geehrte Damen und Herren,
        </p>
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
          wir bestätigen hiermit den Eingang Ihrer Nachricht. Ihr Anliegen ist uns wichtig und wird schnellstmöglich bearbeitet.
        </p>
        <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
          Sie erhalten in Kürze eine Rückmeldung.
        </p>
        <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 1.6;">
          Mit freundlichen Grüßen,<br>
          <strong>Volodymyr</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 30px; background-color: #f8f8f8; border-radius: 0 0 8px 8px; text-align: center;">
        <p style="margin: 0; color: #888888; font-size: 12px;">
          Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese Nachricht.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const CONFIRMATION_TEXT_CONTENT: string = `Sehr geehrte Damen und Herren,

wir bestätigen hiermit den Eingang Ihrer Nachricht. Ihr Anliegen ist uns wichtig und wird schnellstmöglich bearbeitet.

Sie erhalten in Kürze eine Rückmeldung.

Mit freundlichen Grüßen,
Volodymyr`;

export default async function sendFeedbackEmail(
  fromEmail: string,
  comment: string,
  senderName?: string
): Promise<string> {
  const apiKey: string | undefined = process.env.BREVO_API_KEY;
  const senderEmail: string | undefined = process.env.EMAIL_SENDER;
  const recipientEmail: string | undefined = process.env.EMAIL_RECEPIENT;
  const autoanswerEmail: string | undefined = process.env.EMAIL_AUTOANSWER;
  if (!apiKey) throw new Error("BREVO_API_KEY не настроен");
  if (!senderEmail) throw new Error("EMAIL_SENDER не настроен");
  if (!recipientEmail) throw new Error("EMAIL_RECEPIENT не настроен");
  const emailAPI = new TransactionalEmailsApi();
  emailAPI.setApiKey(TransactionalEmailsApiApiKeys.apiKey, apiKey);
  const sender: { email: string; name?: string } = { email: senderEmail, name: "Business Card" };
  const to: Array<{ email: string }> = [{ email: recipientEmail }];
  const nameInfo: string = senderName ? `Имя/Компания: ${senderName}\n` : "";
  const nameHtml: string = senderName ? `<p><strong>Имя/Компания:</strong> ${senderName}</p>` : "";
  const textContent: string = `${nameInfo}Email отправителя: ${fromEmail}\n\nСообщение:\n${comment}`;
  const htmlContent: string = `<div>${nameHtml}<p><strong>Email отправителя:</strong> ${fromEmail}</p><p><strong>Сообщение:</strong></p><p>${comment.replace(/\n/g, "<br>")}</p></div>`;
  const email: SendSmtpEmail = {
    sender,
    to,
    replyTo: { email: fromEmail },
    subject: SUBJECT_TEXT,
    textContent,
    htmlContent,
  };
  await emailAPI.sendTransacEmail(email);
  const confirmationEmail: SendSmtpEmail = {
    sender: { email: autoanswerEmail, name: "Volodymyr" },
    to: [{ email: fromEmail }],
    replyTo: { email: autoanswerEmail! },
    subject: CONFIRMATION_SUBJECT_TEXT,
    textContent: CONFIRMATION_TEXT_CONTENT,
    htmlContent: CONFIRMATION_HTML_TEMPLATE,
  };
  await emailAPI.sendTransacEmail(confirmationEmail);
  return "Message sent successfully";
}
