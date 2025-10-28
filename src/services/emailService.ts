import nodemailer, { Transporter } from "nodemailer";

const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export async function sendFeedbackEmail(
  fromEmail: string,
  comment: string
): Promise<void> {
  const recipientEmail: string = process.env.EMAIL_RECEPIENT || "";
  if (!recipientEmail) {
    throw new Error("EMAIL_RECEPIENT не настроен");
  }
  const transporter: Transporter = createTransporter();
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipientEmail,
    subject: "новое сообщение с визитки",
    text: `Email отправителя: ${fromEmail}\n\nСообщение:\n${comment}`,
    html: `
      <div>
        <p><strong>Email отправителя:</strong> ${fromEmail}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${comment.replace(/\n/g, "<br>")}</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
}

