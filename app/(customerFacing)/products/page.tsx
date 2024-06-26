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
const COLOR_FILTERS = {
  id: "color",
  name: "Color",
  options: [
    { value: "white", label: "White" },
    { value: "beige", label: "Beige" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "purple", label: "Purple" },
  ] as const,
};
// export const metadata = {
//   title: "Products | lynxlink",
//   description: "lynxlink products page",
// };
export default function ProductsPage() {
  const user = useCurrentUser();
  if (!user) {
    redirect("/");
  }
  const [filter, setFilter] = useState<ProductState>({
    color: ["beige", "blue", "green", "purple", "white"],
    price: { isCustom: false, range: DEFAULT_CUSTOM_PRICE },
    size: ["L", "M", "S"],
    sort: "none",
  });
  const { data: products, refetch } = useQuery({
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
      <div className="flex items-baseline justify-between border-b border-secondary pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-primary">
          High-quality cotton selection
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-primary hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-primary group-hover:text-gray-900" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((option) => (
                <Button
                  variant={"ghost"}
                  key={option.name}
                  className={cn("text-left w-full block px-4 py-2 text-sm", {
                    "text-gray-900 bg-gray-100": option.value === filter.sort,
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

          <button className="-m-2 ml-4 p-2 text-secondary hover:text-gray-500 sm:ml-6 lg:hidden">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-secondary pb-6 text-sm font-medium text-primary">
              {/* {SUBCATEGORIES.map((category) => ( */}
              <li key={"d"}>
                <button
                  // disabled={!category.selected}
                  className="disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {/* {category.name} */}
                  category name here
                </button>
              </li>
              {/* ))} */}
            </ul>

            <Accordion type="multiple" className="animate-none">
              {/* Color filter */}
              <AccordionItem value="color">
                <AccordionTrigger className="py-3 text-sm text-primary hover:text-gray-500">
                  <span className="font-medium text-primary">Color</span>
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {COLOR_FILTERS.options.map((option, optionIdx) => (
                      <li key={option.value} className="flex items-center">
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
                          className="ml-3 text-sm text-primary"
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
                  <ul className="space-y-4">
                    {/* {SIZE_FILTERS.options.map((option, optionIdx) => ( */}
                    <li key={"f"} className="flex items-center">
                      <input
                        type="checkbox"
                        // id={`size-${optionIdx}`}
                        onChange={() => {
                          // applyArrayFilter({
                          //   category: "size",
                          //   value: option.value,
                          // });
                        }}
                        // checked={filter.size.includes(option.value)}
                        className="h-4 w-4 rounded border-secondary text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        // htmlFor={`size-${optionIdx}`}
                        className="ml-3 text-sm text-primary"
                      >
                        {/* {option.label} */}
                        option label here
                      </label>
                    </li>
                    {/* ))} */}
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
