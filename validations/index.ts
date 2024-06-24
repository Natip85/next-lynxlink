import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(1, {
    message: "Password required",
  }),
});
export const RegisterSchema = z.object({
  experience: z.optional(z.string()),
  productsToSell: z.optional(
    z.array(z.object({ id: z.number(), value: z.string() }))
  ),
  businessLocation: z.optional(z.string()),
  email: z.string().email({ message: "Valid email required" }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
});

// export const ResetSchema = z.object({
//   email: z.string().email({ message: "Valid email required" }),
// });
// export const NewPasswordSchema = z.object({
//   password: z.string().min(6, { message: "Minimum of 6 characters required" }),
// });