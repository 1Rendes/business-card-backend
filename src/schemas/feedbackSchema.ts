export const feedbackSchema = {
  description: "Отправка обратной связи через email",
  tags: ["feedback"],
  summary: "Отправка сообщения с визитки на почту",
  consumes: ["application/json"],
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      comment: { type: "string" },
    },
    required: ["email", "comment"],
  },
  response: {
    200: {
      description: "Сообщение отправлено успешно",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    400: {
      description: "Ошибка валидации",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    500: {
      description: "Ошибка сервера",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

