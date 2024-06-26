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
  });

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        toggleProductAvailability({
          id,
          isAvailableForPurchase: !isAvailableForPurchase,
        });
      }}
    >
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}
type DeleteProductParams = {
  id: string;
  imageKeys: string[];
};
export function DeleteProductDropdownItem({
  id,
  images,
  disabled,
}: {
  id: string;
  images: ImageType[];
  disabled?: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: deleteProduct, isPending } = useMutation({
    mutationFn: async ({ id, imageKeys }: DeleteProductParams) => {
      const response = await axios.delete("/api/product/delete-product", {
        data: { id, imageKeys },
      });

      return response.data;
    },

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
  });

  if (!id) return null;

  const imageKeys = images.map((img) => {
    return img.key;
  });
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={disabled || isPending}
      onClick={() => {
        deleteProduct({ id, imageKeys });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
