"use client";
import * as z from "zod";
import { addProductSchema } from "@/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatPrice } from "@/lib/formatters";
import { useState } from "react";

export default function AddProductForm() {
  const [priceInCents, setPriceInCents] = useState<number | undefined>();
  // product?.priceInCents
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      description: "",
      priceInCents: 0,
    },
  });
  const onSubmit = async (data: z.infer<typeof addProductSchema>) => {
    console.log("addprdData>>>", data);
  };
  // form.watch();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="text-4xl font-bold mb-6 mx-auto max-w-5xl p-5">
          Add a product
        </h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-5 p-5">
          <div className="flex flex-col flex-1 space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a product name..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide the name of the product. This will be
                    displayed to customers.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a product description..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the product in detail. This helps customers
                    understand what the product is about.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceInCents"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product price (in cents)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter the product price in cents"
                      value={priceInCents}
                      onChange={(e) => {
                        const value = Number(e.target.value) || 0;
                        setPriceInCents(value);
                        field.onChange(value);
                      }}
                      // {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the price of the product in cents. For example, $1.00
                    should be entered as 100 cents.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-muted-foreground">
              {formatPrice((priceInCents || 0) / 100)}
            </div>
          </div>
          <div className="md:w-1/3 md:max-w-80">second side</div>
        </div>
        <div className="mx-auto max-w-5xl p-5 flex items-center justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
