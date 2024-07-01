import { DiscountCodeType } from "@/lib/formatters";
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
  color: z.string().min(1, { message: "Please select a color" }),
  size: z.string().min(1, { message: "Please select a size" }),
});

export const AVAILABLE_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "35",
  "35.5",
  "36",
  "36.5",
  "37.5",
  "38",
  "38.5",
  "39",
  "40",
  "40.5",
  "41",
  "42",
  "42.5",
  "43",
  "44",
  "44.5",
  "46",
  "47",
  "47.5",
  "48",
  "48.5",
  "49.5",
  "50.5",
  "51.5",
  "52.5",
] as const;

export const AVAILABLE_COLORS = [
  "white",
  "beige",
  "green",
  "purple",
  "blue",
  "navy",
  "gray",
  "red",
  "almond",
  "amethyst",
  "amber",
  "antiqueWhite",
  "apricot",
  "aqua",
  "aquamarine",
  "arcticLime",
  "ash",
  "auburn",
  "azure",
  "beige",
  "black",
  "blackberry",
  "blush",
  "blue",
  "brass",
  "bronze",
  "brown",
  "burgundy",
  "byzantine",
  "camel",
  "capri",
  "cardinal",
  "carmine",
  "celadon",
  "cerulean",
  "champagne",
  "charcoal",
  "cherry",
  "chestnut",
  "chocolate",
  "cinnabar",
  "cinnamon",
  "citrine",
  "claret",
  "clover",
  "cobalt",
  "cocoa",
  "coffee",
  "copper",
  "coral",
  "corn",
  "cosmicLatte",
  "crimson",
  "cream",
  "cyan",
  "dandelion",
  "denim",
  "dukeBlue",
  "ecru",
  "ebony",
  "eggplant",
  "electricBlue",
  "emerald",
  "feldspar",
  "flamingo",
  "forest",
  "frost",
  "fuchsia",
  "gainsboro",
  "garnet",
  "ginger",
  "gold",
  "goldFusion",
  "grullo",
  "heliotrope",
  "honeydew",
  "indigo",
  "iris",
  "isabelline",
  "ivory",
  "jade",
  "jasmine",
  "jet",
  "jungleGreen",
  "keppel",
  "khaki",
  "kobe",
  "lava",
  "lavender",
  "lavenderBlush",
  "lemon",
  "lemonLime",
  "licorice",
  "lilac",
  "lime",
  "linen",
  "lightBlue",
  "lightCoral",
  "lightCyan",
  "lightSeaGreen",
  "magenta",
  "mahogany",
  "mango",
  "mantis",
  "marigold",
  "maroon",
  "mauve",
  "mauvelous",
  "midnightBlue",
  "mint",
  "ming",
  "morningBlue",
  "mulberry",
  "mustard",
  "mystic",
  "neonCarrot",
  "oldGold",
  "olive",
  "onyx",
  "opal",
  "orange",
  "orchid",
  "outerSpace",
  "oxfordBlue",
  "paleCerulean",
  "papaya",
  "peach",
  "peacockBlue",
  "pearl",
  "peridot",
  "periwinkle",
  "persimmon",
  "phlox",
  "pink",
  "pistachio",
  "plum",
  "puce",
  "purple",
  "quartz",
  "radicalRed",
  "raspberry",
  "rifleGreen",
  "rose",
  "rosewood",
  "royalBlue",
  "ruby",
  "rust",
  "saffron",
  "sangria",
  "sandyBrown",
  "sapphire",
  "scarlet",
  "seaGreen",
  "seashell",
  "shadow",
  "shockingPink",
  "silver",
  "slate",
  "steelBlue",
  "sunset",
  "sunglow",
  "tan",
  "tangerine",
  "taupe",
  "teal",
  "thistle",
  "tiffanyBlue",
  "topaz",
  "turquoise",
  "tumbleweed",
  "ultramarine",
  "umber",
  "vanilla",
  "vegasGold",
  "verdigris",
  "vermilion",
  "violet",
  "viridian",
  "watermelon",
  "wheat",
  "white",
  "wildStrawberry",
  "wisteria",
  "xanadu",
  "yellow",
  "zaffre",
  "zinnwaldite",
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

export const addDicountCodeSchema = z
  .object({
    code: z.string().min(1),
    discountAmount: z.coerce.number().int().min(1),
    discountType: z.nativeEnum(DiscountCodeType),
    allProducts: z.coerce.boolean(),
    productIds: z.array(z.string()).optional(),
    expiresAt: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.date().min(new Date()).optional()
    ),
    limit: z.preprocess(
      (value) => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).optional()
    ),
  })
  .refine(
    (data) =>
      data.discountAmount <= 100 ||
      data.discountType !== DiscountCodeType.PERCENTAGE,
    {
      message: "Percentage discount must be less than or equal to 100",
      path: ["discountAmount"],
    }
  )
  .refine((data) => !data.allProducts || data.productIds == null, {
    message: "Cannot select products when all products is selected",
    path: ["productIds"],
  })
  .refine((data) => data.allProducts || data.productIds != null, {
    message: "Must select products when all products is not selected",
    path: ["productIds"],
  });
