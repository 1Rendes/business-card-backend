import { FastifyRequest, FastifyReply } from "fastify";
import sendFeedbackEmail from "../services/emailService.js";

type FeedbackBody = {
  email: string;
  comment: string;
  name?: string;
};

export default async function feedbackController(
  request: FastifyRequest<{ Body: FeedbackBody }>,
  reply: FastifyReply
): Promise<void> {
  try {
    const { email, comment, name } = request.body;
    await sendFeedbackEmail(email, comment, name);
    reply.status(200).send({ message: "Сообщение отправлено успешно" });
  } catch (error) {
    const errorMessage: string =
      error instanceof Error ? error.message : "Ошибка отправки сообщения";
    reply.status(500).send({ message: errorMessage });
  }
}

