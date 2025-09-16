import { FastifyReply, FastifyRequest } from "fastify";
import { AccessToken } from "livekit-server-sdk";

export async function getLivekitTokenController(
  request: FastifyRequest<{ Querystring: { language: string } }>,
  reply: FastifyReply
) {
  try {
    const language = request.query.language;
    const token = await createToken(language);
    reply.status(201).send(JSON.stringify({ message: "token created", token }));
  } catch (error) {
    reply.status(500).send(error);
  }
}

const createToken = async (language: string) => {
  const roomName = `voice_assistant_room_${Math.floor(Math.random() * 10_000)}`;
  const identity = `user_${Math.floor(Math.random() * 10_000)}`;
  const livekitUrl = process.env.LIVEKIT_URL;
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity,
      ttl: "10m",
    }
  );
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canPublishData: true,
    canSubscribe: true,
  });
  at.metadata = JSON.stringify({ livekitUrl, language });
  return await at.toJwt();
};
