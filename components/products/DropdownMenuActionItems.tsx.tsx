"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Product } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { ImageType } from "../forms/AddProductForm";

export function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: toggleProductAvailability, isPending } = useMutation({
    mutationFn: async ({
      id,
      isAvailableForPurchase,
    }: Pick<Product, "id" | "isAvailableForPurchase">) => {
      const response = await axios.patch("/api/product/activate-toggle", {
        id,
        isAvailableForPurchase,
      });

      return response.data;
    },
  });

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        toggleProductAvailability(
          { id, isAvailableForPurchase: !isAvailableForPurchase },
          {
            onError: (error) => {
              console.log("TOGGLEERROR>", error);
              toast({
                title: "Error",
                description: "Something went wrong, please try again.",
                variant: "destructive",
              });
              router.refresh();
            },
            onSuccess: ({ isAvailable }: { isAvailable: boolean }) => {
              toast({
                title: "Success",
                description: `${
                  isAvailable ? "Product now active" : "Product deactived"
                }`,
                variant: "success",
              });
              router.refresh();
            },
          }
        );
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}
export function DeleteDropdownItem({
  id,
  images,
}: {
  id: string;
  images: ImageType[];
}) {
  console.log("IMGS>>>", images);

  if (!id) return;
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: deleteProduct, isPending } = useMutation({
    mutationFn: async ({ id }: Pick<Product, "id">) => {
      const response = await axios.delete("/api/product/delete-product", {
        data: { id },
      });

      return response.data;
    },
  });
  const { mutate: imagesDelete, isPending: isImagePending } = useMutation({
    mutationFn: async ({ key }: ImageType) => {
      const response = await axios.delete("/api/product/delete-product", {
        data: { key },
      });

      return response.data;
    },
  });
  // function handleImageDelete() {
  //   console.log("clicked");
  //   imagesDelete(images.keys)
  // }
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        deleteProduct(
          { id },
          {
            onError: (error) => {
              console.log("DELETEERROR>", error);
              toast({
                title: "Error",
                description: "Something went wrong, please try again.",
                variant: "destructive",
              });
              router.refresh();
            },
            onSuccess: ({ message }: { message: string }) => {
              toast({
                title: "Success",
                description: message,
                variant: "success",
              });
              router.refresh();
            },
          }
        );
        // handleImageDelete();
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
