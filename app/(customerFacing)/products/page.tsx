"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { currentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { ChevronDown, Filter } from "lucide-react";
import { redirect } from "next/navigation";
// export const metadata = {
//   title: "Products | lynxlink",
//   description: "lynxlink products page",
// };
export default function ProductsPage() {
  // const user = await currentUser();
  // if (!user) {
  //   redirect("/");
  // }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          High-quality cotton selection
        </h1>

        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
              Sort
              <ChevronDown className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {/* {SORT_OPTIONS.map((option) => ( */}
              <button
                key={"d"}
                className={cn("text-left w-full block px-4 py-2 text-sm", {
                  // "text-gray-900 bg-gray-100": option.value === filter.sort,
                  // "text-gray-500": option.value !== filter.sort,
                })}
                onClick={() => {
                  // setFilter((prev) => ({
                  //   ...prev,
                  //   sort: option.value,
                  // }));
                  // _debouncedSubmit();
                }}
              >
                {/* {option.name} */}
                option name here
              </button>
              {/* ))} */}
            </DropdownMenuContent>
          </DropdownMenu>

          <button className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <section className="pb-24 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Filters */}
          <div className="hidden lg:block">
            <ul className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
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
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Color</span>
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {/* {COLOR_FILTERS.options.map((option, optionIdx) => ( */}
                    <li key={"f"} className="flex items-center">
                      <input
                        type="checkbox"
                        // id={`color-${optionIdx}`}
                        onChange={() => {
                          // applyArrayFilter({
                          //   category: "color",
                          //   value: option.value,
                          // });
                        }}
                        // checked={filter.color.includes(option.value)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        // htmlFor={`color-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {/* {option.label} */}
                        option label here
                      </label>
                    </li>
                    {/* ))} */}
                  </ul>
                </AccordionContent>
              </AccordionItem>

              {/* Size filters */}
              <AccordionItem value="size">
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Size</span>
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
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        // htmlFor={`size-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
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
                <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">Price</span>
                </AccordionTrigger>

                <AccordionContent className="pt-6 animate-none">
                  <ul className="space-y-4">
                    {/* {PRICE_FILTERS.options.map((option, optionIdx) => ( */}
                    <li key={"m"} className="flex items-center">
                      <input
                        type="radio"
                        // id={`price-${optionIdx}`}
                        onChange={() => {
                          // setFilter((prev) => ({
                          //   ...prev,
                          //   price: {
                          //     isCustom: false,
                          //     range: [...option.value],
                          //   },
                          // }));
                          // _debouncedSubmit();
                        }}
                        // checked={
                        //   !filter.price.isCustom &&
                        //   filter.price.range[0] === option.value[0] &&
                        //   filter.price.range[1] === option.value[1]
                        // }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        // htmlFor={`price-${optionIdx}`}
                        className="ml-3 text-sm text-gray-600"
                      >
                        {/* {option.label} */}
                        option label here
                      </label>
                    </li>
                    {/* ))} */}
                    <li className="flex justify-center flex-col gap-2">
                      <div>
                        <input
                          type="radio"
                          // id={`price-${PRICE_FILTERS.options.length}`}
                          onChange={() => {
                            // setFilter((prev) => ({
                            //   ...prev,
                            //   price: {
                            //     isCustom: true,
                            //     range: [0, 100],
                            //   },
                            // }));
                            // _debouncedSubmit();
                          }}
                          // checked={filter.price.isCustom}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label
                          // htmlFor={`price-${PRICE_FILTERS.options.length}`}
                          className="ml-3 text-sm text-gray-600"
                        >
                          Custom
                        </label>
                      </div>

                      <div className="flex justify-between">
                        <p className="font-medium">Price</p>
                        <div>
                          money stuff here
                          {/* {filter.price.isCustom
                            ? minPrice.toFixed(0)
                            : filter.price.range[0].toFixed(0)}{" "}
                          € -{" "}
                          {filter.price.isCustom
                            ? maxPrice.toFixed(0)
                            : filter.price.range[1].toFixed(0)}{" "} */}
                          €
                        </div>
                      </div>

                      <Slider
                        // className={cn({
                        //   "opacity-50":
                        //   !filter.price.isCustom,
                        // })}
                        // disabled={!filter.price.isCustom}
                        onValueChange={(range) => {
                          const [newMin, newMax] = range;

                          // setFilter((prev) => ({
                          //   ...prev,
                          //   price: {
                          //     isCustom: true,
                          //     range: [newMin, newMax],
                          //   },
                          // }));

                          // _debouncedSubmit();
                        }}
                        // value={
                        //   filter.price.isCustom
                        //     ? filter.price.range
                        //     : DEFAULT_CUSTOM_PRICE
                        // }
                        // min={DEFAULT_CUSTOM_PRICE[0]}
                        // defaultValue={DEFAULT_CUSTOM_PRICE}
                        // max={DEFAULT_CUSTOM_PRICE[1]}
                        // step={5}
                      />
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Product grid */}
          <ul className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {/* {products && products.length === 0 ? (
              <EmptyState />
            ) : products ? (
              products.map((product) => (
                <Product key={product.id} product={product.metadata!} />
              ))
            ) : (
              new Array(12)
                .fill(null)
                .map((_, i) => <ProductSkeleton key={i} />)
            )} */}
            product will go here
          </ul>
        </div>
      </section>
    </main>
  );
}
