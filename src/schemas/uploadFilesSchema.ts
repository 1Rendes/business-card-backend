export const uploadFilesSchema = {
  summary: "Upload files (doc, pdf)",
  description:
    "Allows uploading up to 5 files of the same type using multipart/form-data.",
  tags: ["upload"],
  consumes: ["multipart/form-data"],
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            files: {
              type: "array",
              items: { type: "string", format: "binary" },
              maxItems: 5,
              description: "Array of files (max 5)",
            },
            url: {
              type: "string",
              format: "uri",
              description: "Alternative URL for file upload",
            },
          },
        },
      },
    },
  },
  response: {
    201: {
      description: "Files uploaded successfully",
      type: "object",
      properties: {
        message: { type: "string" },
        files: {
          type: "array",
          maxItems: 5,
          items: {
            type: "object",
            properties: {
              filename: {
                type: "string",
                description: "Server-stored filename",
              },
              originalname: {
                type: "string",
                description: "Original filename",
              },
              mimetype: { type: "string", description: "File MIME type" },
              size: { type: "integer", description: "File size in bytes" },
            },
          },
        },
      },
      example: {
        message: "Files uploaded successfully",
        files: [
          {
            filename: "abc123.pdf",
            originalname: "document.pdf",
            mimetype: "application/pdf",
            size: 123456,
          },
        ],
      },
    },
    400: {
      description: "Bad Request: No files uploaded",
      type: "object",
      properties: {
        message: { type: "string" },
      },
      example: { message: "No files uploaded" },
    },
  },
};
