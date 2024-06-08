import { z } from "zod";

export const messagesSchema = z.object({
  content: z
    .string()
    .min(10, "content must  be at least 10 characters ")
    .min(300, "content must  be not more then  300 characters "),
});
