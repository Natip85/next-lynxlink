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
import { useEffect, useState } from "react";
import { Prisma, Product } from "@prisma/client";
import { UploadDropzone } from "../uploadthing";
import Image from "next/image";
import { Check, ChevronsUpDown, Minus } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import LoadingCreateProduct from "./LoadingCreateProduct";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { COLOR_FILTERS } from "@/app/(customerFacing)/products/page";
export type ImageType = {
  key: string;
  name: string;
  url: string;
  size: number;
  serverData: ServerData;
};
type ServerData = {
  uploadedBy: string;
};
const colors = COLOR_FILTERS.options.map((color) => {
  return color;
});
const AVAIBLE_SIZES = [
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

export default function AddProductForm({
  product,
}: {
  product?: Product | null;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [imageData, setImageData] = useState<ImageType[] | undefined>();
  const [productName, setProductName] = useState(product?.name || "");
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents || undefined
  );
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(
    product?.size
  );

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: async ({
      name,
      description,
      priceInCents,
      images,
      color,
      size,
    }: z.infer<typeof addProductSchema>) => {
      const response = await axios.post("/api/product", {
        name,
        description,
        priceInCents,
        images,
        color,
        size,
      });

      return response.data;
    },
  });
  const { mutate: editProduct, isPending: editPending } = useMutation({
    mutationFn: async ({
      name,
      description,
      priceInCents,
      images,
      id,
      color,
      size,
    }: z.infer<typeof addProductSchema> & { id: string }) => {
      const response = await axios.patch("/api/product", {
        name,
        description,
        priceInCents,
        images,
        id,
        color,
        size,
      });

      return response.data;
    },
  });
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      images: imageData || undefined,
      priceInCents: product?.priceInCents || 0,
      color: product?.color || undefined,
      size: product?.size || undefined,
    },
  });
  useEffect(() => {
    if (product?.images) {
      setImageData(product?.images as ImageType[]);
      form.setValue("images", product?.images as any);
    }
  }, [product?.images]);
  const onSubmit = async (data: z.infer<typeof addProductSchema>) => {
    if (product) {
      //EDIT
      setShowLoader(true);

      if (!product.id) return null;
      editProduct(
        { ...data, id: product.id },
        {
          onError: (error) => {
            setShowLoader(false);
            toast({
              title: "Error",
              description: "Something went wrong, please try again.",
              variant: "destructive",
            });
          },
          onSuccess: ({ message }: { message: string }) => {
            setFinishedLoading(true);
            setShowLoader(false);

            toast({
              title: "Success",
              description: message,
              variant: "success",
            });
            router.push(`/admin/products/${product.id}/edit`);
            router.refresh();
          },
        }
      );
    } else {
      //CREATE
      setShowLoader(true);

      createProduct(data, {
        onError: (error) => {
          setShowLoader(false);
          toast({
            title: "Error",
            description: "Something went wrong, please try again.",
            variant: "destructive",
          });
        },
        onSuccess: ({
          product,
          message,
        }: {
          product: Product;
          message: string;
        }) => {
          setFinishedLoading(true);
          toast({
            title: "Success",
            description: message,
            variant: "success",
          });
          router.push(`/admin/products/${product.id}/edit`);
          router.refresh();
        },
      });
    }
  };
  form.watch();

  if (showLoader) {
    return <LoadingCreateProduct finished={finishedLoading} />;
  }
  // TODO: add loading state for img upload
  // TODO: delete images in uplloadthing when clearing img state
  // TODO: create functioanlity to remove selected imgs only instead of removing all imags as is now
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <h2 className="text-4xl font-bold mb-6 mx-auto max-w-5xl p-5">
          {productName ? productName : "Add a product"}{" "}
        </h2>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-5 p-5">
          <div className="flex flex-col flex-1 space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name">Product name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Enter a product name..."
                      value={productName}
                      onChange={(e) => {
                        const value = e.target.value || "";
                        setProductName(value);
                        field.onChange(value);
                      }}
                    />
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
                  <FormLabel htmlFor="description">
                    Product description
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="description"
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
              name="images"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    Product images
                    {imageData && imageData.length > 0 && (
                      <Button
                        variant={"outline"}
                        size={"sm"}
                        type="button"
                        onClick={() => {
                          setImageData(undefined);
                          form.resetField("images");
                        }}
                        className="flex items-center gap-2"
                      >
                        <Minus /> Remove images
                      </Button>
                    )}
                  </div>
                  <FormControl>
                    <>
                      {imageData && imageData.length > 0 ? (
                        <div className="items-center p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                          {imageData?.map((img) => (
                            <div
                              key={img.key}
                              className="border-2 rounded-lg w-auto relative aspect-video flex justify-center items-center shadow"
                            >
                              <Image
                                src={img.url}
                                alt="productImage"
                                fill
                                sizes="30"
                                className="object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <UploadDropzone
                          className="border-primary"
                          endpoint={"imageUploader"}
                          onClientUploadComplete={(url: any) => {
                            setImageData(url);
                            field.onChange(url);
                            setIsImageLoading(false);
                          }}
                          onUploadError={(error) => {
                            window.alert(`${error?.message}`);
                          }}
                          onUploadProgress={() => {
                            setIsImageLoading(true);
                          }}
                        />
                      )}
                    </>
                  </FormControl>
                  <FormDescription>
                    Please upload an image of the product. Accepted formats are
                    .jpg, .png, .jpeg, and .gif.
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
                  <FormLabel htmlFor="price">
                    Product price (in cents)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Enter the product price in cents"
                      value={priceInCents}
                      onChange={(e) => {
                        setPriceInCents(Number(e.target.value) || undefined);
                        field.onChange(e.target.value);
                      }}
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
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Product color</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? colors.find(
                                (color) => color.value === field.value
                              )?.label
                            : "Select a color"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 ">
                      <Command>
                        <CommandInput placeholder="Search colors..." />
                        <CommandEmpty>No color found.</CommandEmpty>
                        <CommandGroup className="h-[20rem] overflow-y-auto">
                          {colors.map((color) => (
                            <CommandList key={color.value}>
                              <CommandItem
                                value={color.label}
                                onSelect={() => {
                                  form.setValue("color", color.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    color.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {color.label}
                              </CommandItem>
                            </CommandList>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    This is the color that will be displayed to the user.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="size">Select a size</FormLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {AVAIBLE_SIZES.map((size, inx) => (
                      <Button
                        key={size}
                        type="button"
                        onClick={() => {
                          field.onChange(size);
                          setSelectedSize(size);
                        }}
                        variant={selectedSize === size ? "default" : "outline"}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                  <FormDescription>
                    Choose a size for the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:w-1/3 md:max-w-80">second section</div>
        </div>
        <div className="mx-auto max-w-5xl p-5 flex items-center justify-end">
          <Button
            disabled={isPending || isImageLoading || editPending}
            type="submit"
          >
            {product ? "Update product" : "Create product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
