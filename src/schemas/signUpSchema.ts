import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be more then 2 character")
  .max(20, "username must be not more then 20 character")
  .regex(/^[a-zA-Z0-9_]+$/, "user name must not spesial character ");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "invelid email addres" }),
  password: z.string().min(6, { message: "password must be 6 character" }),
});
