"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ProductState } from "@/validations";
import { ChevronDown, Filter } from "lucide-react";
import { redirect } from "next/navigation";
import { useCallback, useState } from "react";
import debounce from "lodash.debounce";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Product } from "@prisma/client";
import EmptyState from "@/components/products/EmptyState";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";
import ProductCard from "@/components/products/ProductCard";
import { useCurrentUser } from "@/hooks/use-current-User";

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;
const DEFAULT_CUSTOM_PRICE = [0, 1000] as [number, number];
const PRICE_FILTERS = {
  id: "price",
  name: "Price",
  options: [
    { value: [0, 1000], label: "Any price" },
    {
      value: [0, 20],
      label: "Under $20",
    },
    {
      value: [0, 40],
      label: "Under $40",
    },
  ],
} as const;
export const COLOR_FILTERS = {
  id: "color",
  name: "Color",
  options: [
    { value: "beige", label: "Beige" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
    { value: "gray", label: "Gray" },
    { value: "red", label: "Red" },
    { value: "almond", label: "Almond" },
    { value: "amethyst", label: "Amethyst" },
    { value: "amber", label: "Amber" },
    { value: "antiqueWhite", label: "AntiqueWhite" },
    { value: "apricot", label: "Apricot" },
    { value: "aqua", label: "Aqua" },
    { value: "aquamarine", label: "Aquamarine" },
    { value: "arcticLime", label: "ArcticLime" },
    { value: "ash", label: "Ash" },
    { value: "auburn", label: "Auburn" },
    { value: "azure", label: "Azure" },
    { value: "black", label: "Black" },
    { value: "blackberry", label: "Blackberry" },
    { value: "blush", label: "Blush" },
    { value: "brass", label: "Brass" },
    { value: "bronze", label: "Bronze" },
    { value: "brown", label: "Brown" },
    { value: "burgundy", label: "Burgundy" },
    { value: "byzantine", label: "Byzantine" },
    { value: "camel", label: "Camel" },
    { value: "capri", label: "Capri" },
    { value: "cardinal", label: "Cardinal" },
    { value: "carmine", label: "Carmine" },
    { value: "celadon", label: "Celadon" },
    { value: "cerulean", label: "Cerulean" },
    { value: "champagne", label: "Champagne" },
    { value: "charcoal", label: "Charcoal" },
    { value: "cherry", label: "Cherry" },
    { value: "chestnut", label: "Chestnut" },
    { value: "chocolate", label: "Chocolate" },
    { value: "cinnabar", label: "Cinnabar" },
    { value: "cinnamon", label: "Cinnamon" },
    { value: "citrine", label: "Citrine" },
    { value: "claret", label: "Claret" },
    { value: "clover", label: "Clover" },
    { value: "cobalt", label: "Cobalt" },
    { value: "cocoa", label: "Cocoa" },
    { value: "coffee", label: "Coffee" },
    { value: "copper", label: "Copper" },
    { value: "coral", label: "Coral" },
    { value: "corn", label: "Corn" },
    { value: "cosmicLatte", label: "CosmicLatte" },
    { value: "crimson", label: "Crimson" },
    { value: "cream", label: "Cream" },
    { value: "cyan", label: "Cyan" },
    { value: "dandelion", label: "Dandelion" },
    { value: "denim", label: "Denim" },
    { value: "dukeBlue", label: "DukeBlue" },
    { value: "ebony", label: "Ebony" },
    { value: "eggplant", label: "Eggplant" },
    { value: "electricBlue", label: "ElectricBlue" },
    { value: "emerald", label: "Emerald" },
    { value: "feldspar", label: "Feldspar" },
    { value: "flamingo", label: "Flamingo" },
    { value: "forest", label: "Forest" },
    { value: "frost", label: "Frost" },
    { value: "fuchsia", label: "Fuchsia" },
    { value: "gainsboro", label: "Gainsboro" },
    { value: "garnet", label: "Garnet" },
    { value: "ginger", label: "Ginger" },
    { value: "gold", label: "Gold" },
    { value: "goldFusion", label: "GoldFusion" },
    { value: "grullo", label: "Grullo" },
    { value: "heliotrope", label: "Heliotrope" },
    { value: "honeydew", label: "Honeydew" },
    { value: "indigo", label: "Indigo" },
    { value: "iris", label: "Iris" },
    { value: "isabelline", label: "Isabelline" },
    { value: "ivory", label: "Ivory" },
    { value: "jade", label: "Jade" },
    { value: "jasmine", label: "Jasmine" },
    { value: "jet", label: "Jet" },
    { value: "jungleGreen", label: "JungleGreen" },
    { value: "keppel", label: "Keppel" },
    { value: "khaki", label: "Khaki" },
    { value: "kobe", label: "Kobe" },
    { value: "lava", label: "Lava" },
    { value: "lavender", label: "Lavender" },
    { value: "lavenderBlush", label: "LavenderBlush" },
    { value: "lemon", label: "Lemon" },
    { value: "lemonLime", label: "LemonLime" },
    { value: "licorice", label: "Licorice" },
    { value: "lilac", label: "Lilac" },
    { value: "lime", label: "Lime" },
    { value: "linen", label: "Linen" },
    { value: "lightCoral", label: "LightCoral" },
    { value: "lightBlue", label: "LightBlue" },
    { value: "lightCyan", label: "LightCyan" },
    { value: "lightSeaGreen", label: "LightSeaGreen" },
    { value: "magenta", label: "Magenta" },
    { value: "mahogany", label: "Mahogany" },
    { value: "mango", label: "Mango" },
    { value: "mantis", label: "Mantis" },
    { value: "marigold", label: "Marigold" },
    { value: "maroon", label: "Maroon" },
    { value: "mauve", label: "Mauve" },
    { value: "mauvelous", label: "Mauvelous" },
    { value: "midnightBlue", label: "MidnightBlue" },
    { value: "mint", label: "Mint" },
    { value: "ming", label: "Ming" },
    { value: "morningBlue", label: "MorningBlue" },
    { value: "mulberry", label: "Mulberry" },
    { value: "mustard", label: "Mustard" },
    { value: "mystic", label: "Mystic" },
    { value: "navy", label: "Navy" },
    { value: "neonCarrot", label: "NeonCarrot" },
    { value: "oldGold", label: "OldGold" },
    { value: "olive", label: "Olive" },
    { value: "onyx", label: "Onyx" },
    { value: "opal", label: "Opal" },
    { value: "orange", label: "Orange" },
    { value: "orchid", label: "Orchid" },
    { value: "outerSpace", label: "OuterSpace" },
    { value: "oxfordBlue", label: "OxfordBlue" },
    { value: "paleCerulean", label: "PaleCerulean" },
    { value: "papaya", label: "Papaya" },
    { value: "peach", label: "Peach" },
    { value: "peacockBlue", label: "PeacockBlue" },
    { value: "pearl", label: "Pearl" },
    { value: "peridot", label: "Peridot" },
    { value: "periwinkle", label: "Periwinkle" },
    { value: "persimmon", label: "Persimmon" },
    { value: "phlox", label: "Phlox" },
    { value: "pink", label: "Pink" },
    { value: "pistachio", label: "Pistachio" },
    { value: "plum", label: "Plum" },
    { value: "puce", label: "Puce" },
    { value: "quartz", label: "Quartz" },
    { value: "radicalRed", label: "RadicalRed" },
    { value: "raspberry", label: "Raspberry" },
    { value: "rifleGreen", label: "RifleGreen" },
    { value: "rose", label: "Rose" },
    { value: "rosewood", label: "Rosewood" },
    { value: "royalBlue", label: "RoyalBlue" },
    { value: "ruby", label: "Ruby" },
    { value: "rust", label: "Rust" },
    { value: "saffron", label: "Saffron" },
    { value: "sangria", label: "Sangria" },
    { value: "sandyBrown", label: "SandyBrown" },
    { value: "sapphire", label: "Sapphire" },
    { value: "scarlet", label: "Scarlet" },
    { value: "seaGreen", label: "SeaGreen" },
    { value: "seashell", label: "Seashell" },
    { value: "shadow", label: "Shadow" },
    { value: "shockingPink", label: "ShockingPink" },
    { value: "silver", label: "Silver" },
    { value: "slate", label: "Slate" },
    { value: "steelBlue", label: "SteelBlue" },
    { value: "sunset", label: "Sunset" },
    { value: "sunglow", label: "Sunglow" },
    { value: "tan", label: "Tan" },
    { value: "tangerine", label: "Tangerine" },
    { value: "taupe", label: "Taupe" },
    { value: "teal", label: "Teal" },
    { value: "thistle", label: "Thistle" },
    { value: "tiffanyBlue", label: "TiffanyBlue" },
    { value: "topaz", label: "Topaz" },
    { value: "turquoise", label: "Turquoise" },
    { value: "tumbleweed", label: "Tumbleweed" },
    { value: "ultramarine", label: "Ultramarine" },
    { value: "umber", label: "Umber" },
    { value: "vanilla", label: "Vanilla" },
    { value: "vegasGold", label: "VegasGold" },
    { value: "verdigris", label: "Verdigris" },
    { value: "vermilion", label: "Vermilion" },
    { value: "violet", label: "Violet" },
    { value: "viridian", label: "Viridian" },
    { value: "watermelon", label: "Watermelon" },
    { value: "wheat", label: "Wheat" },
    { value: "white", label: "White" },
    { value: "wildStrawberry", label: "WildStrawberry" },
    { value: "wisteria", label: "Wisteria" },
    { value: "xanadu", label: "Xanadu" },
    { value: "yellow", label: "Yellow" },
    { value: "zaffre", label: "Zaffre" },
    { value: "zinnwaldite", label: "Zinnwaldite" },
  ] as const,
};
const SIZE_FILTERS = {
  id: "size",
  name: "Size",
  options: [
    { value: "XS", label: "SX" },
    { value: "S", label: "S" },
    { value: "M", label: "M" },
    { value: "L", label: "L" },
    { value: "XL", label: "XL" },
    { value: "2XL", label: "2XL" },
    { value: "3XL", label: "3XL" },
    { value: "35", label: "35" },
    { value: "35.5", label: "35.5" },
    { value: "36", label: "36" },
    { value: "36.5", label: "36.5" },
    { value: "37.5", label: "37.5" },
    { value: "38", label: "38" },
    { value: "38.5", label: "38.5" },
    { value: "39", label: "39" },
    { value: "40", label: "40" },
    { value: "40.5", label: "40.5" },
    { value: "41", label: "41" },
    { value: "42", label: "42" },
    { value: "42.5", label: "42.5" },
    { value: "43", label: "43" },
    { value: "44", label: "44" },
    { value: "44.5", label: "44.5" },
    { value: "46", label: "46" },
    { value: "47", label: "47" },
    { value: "47.5", label: "47.5" },
    { value: "48", label: "48" },
    { value: "48.5", label: "48.5" },
    { value: "49.5", label: "49.5" },
    { value: "50.5", label: "50.5" },
    { value: "51.5", label: "51.5" },
    { value: "52.5", label: "52.5" },
  ],
} as const;

const SUBCATEGORIES = [
  { name: "T-Shirts", selected: true, href: "#" },
  { name: "Hoodies", selected: true, href: "#" },
  { name: "Sweatshirts", selected: false, href: "#" },
  { name: "Accessories", selected: false, href: "#" },
];
export default function ProductsPage() {
  const user = useCurrentUser();
  if (!user) {
    return redirect("/");
  }
  const [filter, setFilter] = useState<ProductState>({
    color: [
      "beige",
      "blue",
      "green",
      "purple",
      "navy",
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
      "gray",
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
    ],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: [
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
    ],
    sort: "none",
  });
  const { data: products, refetch } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.post<Product[]>("/api/products", {
        filter: {
          sort: filter.sort,
          color: filter.color,
          price: filter.price.range,
          size: filter.size,
        },
      });

      return data;
    },
  });

  const onSubmit = () => refetch();

  const debouncedSubmit = debounce(onSubmit, 400);
  const _debouncedSubmit = useCallback(debouncedSubmit, []);
  const applyArrayFilter = ({
    category,
    value,
  }: {
    category: keyof Omit<typeof filter, "price" | "sort">;
    value: string;
  }) => {
    const isFilterApplied = filter[category].includes(value as never);

    if (isFilterApplied) {
      setFilter((prev) => ({
        ...prev,
        [category]: prev[category].filter((v) => v !== value),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [category]: [...prev[category], value],
      }));
    }

    _debouncedSubmit();
  };
  const minPrice = Math.min(filter.price.range[0], filter.price.range[1]);
  const maxPrice = Math.max(filter.price.range[0], filter.price.range[1]);
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-secondary pb-6 pt-16">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          Product page
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-primary hover:text-primary/50">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-primary group-hover:text-primary/50" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <Button
                  variant={"ghost"}
                  key={option.name}
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-primary bg-secondary": option.value === filter.sort,
                    "text-gray-500": option.value !== filter.sort,
                  })}
                  onClick={() => {
                    setFilter((prev) => ({
                      ...prev,
                      sort: option.value,
                    }));
                    _debouncedSubmit();
                  }}
                >
                  {option.name}
                </Button>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={"ghost"}
            className="-m-2 ml-4 p-2 text-primary hover:text-primary/50 sm:ml-6 lg:hidden"
          >
            <Filter className="size-5" />
          </Button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-secondary pb-6 text-sm font-medium text-primary">
              {SUBCATEGORIES.map((category) => (
                <li key={category.name}>
                  <Button
                    variant={"ghost"}
                    disabled={!category.selected}
                    className="disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {category.name}
                  </Button>
                </li>
              ))}
            </ul>

            <Accordion type="multiple" className="animate-none">
              {/* Color filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-primary hover:text-gray-500">
                  <span className="font-medium text-primary">Color</span>
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="grid grid-cols-3 gap-2 p-2 overflow-y-auto h-[16rem]">
                    {COLOR_FILTERS.options.map((option, optionIdx) => (
                      <li
                        key={option.value}
                        className="flex flex-col items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          id={`color-${optionIdx}`}
                          onChange={() => {
                            applyArrayFilter({
                              category: "color",
                              value: option.value,
                            });
                          }}
                          checked={filter.color.includes(option.value)}
                          className="h-4 w-4 rounded border-secondary text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`color-${optionIdx}`}
                          className=" text-sm text-primary"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Size filters */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-sm text-primary hover:text-gray-500">
                  <span className="font-medium text-primary">Size</span>
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4 overflow-y-auto h-[16rem]">
                    {SIZE_FILTERS.options.map((option, optionIdx) => (
                      <li key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`size-${optionIdx}`}
                          onChange={() => {
                            applyArrayFilter({
                              category: "size",
                              value: option.value,
                            });
                          }}
                          checked={filter.size.includes(option.value)}
                          className="h-4 w-4 rounded border-secondary text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`size-${optionIdx}`}
                          className="ml-3 text-sm text-primary"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Price filter */}
              <AccordionItem value="price">
                <AccordionTrigger className="py-3 text-sm text-primary hover:text-gray-500">
                  <span className="font-medium text-primary">Price</span>
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {PRICE_FILTERS.options.map((option, optionIdx) => (
                      <li key={option.label} className="flex items-center">
                        <input
                          type="radio"
                          id={`price-${optionIdx}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: false,
                                range: [...option.value],
                              },
                            }));
                            _debouncedSubmit();
                          }}
                          checked={
                            !filter.price.isCustom &&
                            filter.price.range[0] === option.value[0] &&
                            filter.price.range[1] === option.value[1]
                          }
                          className="h-4 w-4 rounded border-secondary text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${optionIdx}`}
                          className="ml-3 text-sm text-primary"
                        >
                          {option.label}
                        </label>
                      </li>
                    ))}
                    <li className="flex justify-center flex-col gap-2">
                      <div>
                        <input
                          type="radio"
                          id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            setFilter((prev) => ({
                              ...prev,
                              price: {
                                isCustom: true,
                                range: [0, 100],
                              },
                            }));
                            _debouncedSubmit();
                          }}
                          checked={filter.price.isCustom}
                          className="h-4 w-4 rounded border-secondary text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="ml-3 text-sm text-primary"
                        >
                          Custom
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>
                        <div>
                          {filter.price.isCustom
                            ? minPrice.toFixed(0)
                            : filter.price.range[0].toFixed(0)}{" "}
                          $ -{" "}
                          {filter.price.isCustom
                            ? maxPrice.toFixed(0)
                            : filter.price.range[1].toFixed(0)}{" "}
                          $
                        </div>
                      </div>

                      <Slider
                        className={cn({
                          "opacity-50": !filter.price.isCustom,
                        })}
                        disabled={!filter.price.isCustom}
                        onValueChange={(range) => {
                          const [newMin, newMax] = range;

                          setFilter((prev) => ({
                            ...prev,
                            price: {
                              isCustom: true,
                              range: [newMin, newMax],
                            },
                          }));

                          _debouncedSubmit();
                        }}
                        value={
                          filter.price.isCustom
                            ? filter.price.range
                            : DEFAULT_CUSTOM_PRICE
                        }
                        min={DEFAULT_CUSTOM_PRICE[0]}
                        defaultValue={DEFAULT_CUSTOM_PRICE}
                        max={DEFAULT_CUSTOM_PRICE[1]}
                        step={5}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Product grid */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products && products.length === 0 ? (
              <EmptyState />
            ) : products ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              new Array(12)
                .fill(null)
                .map((_, i) => <ProductCardSkeleton key={i} />)
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
