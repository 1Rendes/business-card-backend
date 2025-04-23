import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

async function ping(fastify: FastifyInstance) {
  fastify.get("/api/ping", {
    handler: (req: FastifyRequest, rep: FastifyReply) => {
      rep.status(200).send("ok");
    },
  });
}

export default ping;
