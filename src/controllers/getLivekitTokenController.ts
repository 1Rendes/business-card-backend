import { FastifyReply, FastifyRequest } from "fastify";
import { AccessToken } from "livekit-server-sdk";

export async function getLivekitTokenController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const token = await createToken();
    reply.status(201).send(JSON.stringify({ message: "token created", token }));
  } catch (error) {
    reply.status(500).send(error);
  }
}

const createToken = async () => {
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
  at.metadata = JSON.stringify({ livekitUrl });
  return await at.toJwt();
};
