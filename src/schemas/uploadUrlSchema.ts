export const uploadUrlSchema = {
  description: "Allows one link per time",
  tags: ["upload"],
  summary: "Uploading content from html pages",
  consumes: ["application/json"],
  body: {
    type: "object",
    properties: { url: { type: "string" } },
    required: ["url"],
  },
  response: {
    201: {
      description: "url uploaded, <url>",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};
