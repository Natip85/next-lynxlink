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
import { Product } from "@prisma/client";
import { UploadDropzone } from "../uploadthing";
import Image from "next/image";
import { Minus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import LoadingCreateProduct from "./LoadingCreateProduct";
import { useRouter } from "next/navigation";
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
  const [productName, setProductName] = useState("");
  const [priceInCents, setPriceInCents] = useState<number | undefined>(
    product?.priceInCents
  );
  const [isImageLoading, setIsImageLoading] = useState(false);

  const { mutate: createProduct, isPending } = useMutation({
    mutationFn: async ({
      name,
      description,
      priceInCents,
      images,
    }: z.infer<typeof addProductSchema>) => {
      const response = await axios.post("/api/product", {
        name,
        description,
        priceInCents,
        images,
      });

      return response.data;
    },
  });
  const form = useForm<z.infer<typeof addProductSchema>>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: "",
      description: "",
      priceInCents: 0,
      images: undefined,
    },
  });
  const onSubmit = async (data: z.infer<typeof addProductSchema>) => {
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
  };
  form.watch();
  if (showLoader) {
    return <LoadingCreateProduct finished={finishedLoading} />;
  }
  // TODO: add loading state for img upload
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
                          setImageData([]);
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
                        const value = Number(e.target.value) || 0;
                        setPriceInCents(value);
                        field.onChange(value);
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
          </div>
          <div className="md:w-1/3 md:max-w-80">second section</div>
        </div>
        <div className="mx-auto max-w-5xl p-5 flex items-center justify-end">
          <Button disabled={isPending || isImageLoading} type="submit">
            {isPending ? "Creating product..." : "Create product"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
