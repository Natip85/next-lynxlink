"use client";
import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { addDicountCodeSchema } from "@/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { DiscountCodeType } from "@/lib/formatters";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

export default function DiscountCodeForm({
  products,
}: {
  products: { name: string; id: string }[];
}) {
  const [allProducts, setAllProducts] = useState(true);
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const form = useForm<z.infer<typeof addDicountCodeSchema>>({
    resolver: zodResolver(addDicountCodeSchema),
    defaultValues: {
      code: "",
      discountType: DiscountCodeType.PERCENTAGE,
      limit: undefined,
      expiresAt: undefined,
      allProducts: true,
      productIds: undefined,
    },
  });
  const onSubmit = async (data: z.infer<typeof addDicountCodeSchema>) => {
    console.log("DATA>>>", data);
  };
  form.watch();
  console.log(form.watch());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="code">Code name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter a discount code name..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="discountType">Discount type</FormLabel>
                <FormControl>
                  <RadioGroup
                    id="discountType"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    // defaultValue={DiscountCodeType.PERCENTAGE}
                  >
                    <div className="flex gap-2 items-center">
                      <RadioGroupItem
                        id="percentage"
                        value={DiscountCodeType.PERCENTAGE}
                      />
                      <Label htmlFor="percentage">Percentage</Label>
                    </div>
                    <div className="flex gap-2 items-center">
                      <RadioGroupItem
                        id="fixed"
                        value={DiscountCodeType.FIXED}
                      />
                      <Label htmlFor="fixed">Fixed</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="discountAmount">Discount amount</FormLabel>
                <FormControl>
                  <Input {...field} type="number" min={0} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="limit"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="limit">Limit</FormLabel>
                <FormControl>
                  <Input {...field} type="number" id="limit" min={0} />
                </FormControl>
                <FormDescription>
                  Leave blank for infinite uses.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Expiration</Label>
            <Input
              type="datetime-local"
              id="expiresAt"
              name="expiresAt"
              className="w-max"
              min={today.toJSON().split(":").slice(0, -1).join(":")}
              onChange={(e) =>
                form.setValue("expiresAt", new Date(e.target.value))
              }
            />
            <div className="text-muted-foreground">
              Leave blank for no expiration
            </div>
          </div>
          <FormField
            control={form.control}
            name="allProducts"
            render={({ field }) => (
              <FormItem>
                <div className="space-y-2">
                  <Label>Allowed Products</Label>
                  <div className="flex gap-3 items-center">
                    <Checkbox
                      id="allProducts"
                      checked={field.value}
                      onCheckedChange={(e) => {
                        field.onChange(e);
                        setAllProducts(e === true);
                        if (e === true) {
                          form.setValue("productIds", []);
                        }
                      }}
                    />
                    <Label htmlFor="allProducts">All Products</Label>
                  </div>
                  {!allProducts &&
                    products.map((product) => (
                      <FormField
                        key={product.id}
                        control={form.control}
                        name={`productIds`}
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-2 items-center">
                              <Checkbox
                                id={product.id}
                                name="productIds"
                                value={product.id}
                                onCheckedChange={(checked) => {
                                  const currentProductIds =
                                    form.getValues("productIds") || [];
                                  const updatedProductIds = checked
                                    ? [...currentProductIds, product.id]
                                    : currentProductIds.filter(
                                        (id: string) => id !== product.id
                                      );
                                  form.setValue(
                                    "productIds",
                                    updatedProductIds
                                  );
                                }}
                              />
                              <Label htmlFor={product.id}>{product.name}</Label>
                            </div>
                          </FormItem>
                        )}
                      />
                    ))}
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="my-5 flex items-center justify-end">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}
