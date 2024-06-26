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

export const addProductSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  priceInCents: z.coerce
    .number()
    .int()
    .min(1, { message: "Price must be at least 1 cent" }),
  images: z
    .array(
      z.object({
        key: z.string(),
        name: z.string(),
        url: z.string(),
        size: z.number(),
        serverData: z.object({
          uploadedBy: z.string(),
        }),
      })
    )
    .nonempty(),
});
export const AVAILABLE_SIZES = ["S", "M", "L"] as const;
export const AVAILABLE_COLORS = [
  "white",
  "beige",
  "green",
  "purple",
  "blue",
] as const;
export const AVAILABLE_SORT = ["none", "price-asc", "price-desc"] as const;

export const ProductFilterValidator = z.object({
  size: z.array(z.enum(AVAILABLE_SIZES)),
  color: z.array(z.enum(AVAILABLE_COLORS)),
  sort: z.enum(AVAILABLE_SORT),
  price: z.tuple([z.number(), z.number()]),
});

export type ProductState = Omit<
  z.infer<typeof ProductFilterValidator>,
  "price"
> & {
  price: { isCustom: boolean; range: [number, number] };
};
