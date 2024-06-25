"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Product } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ActiveToggleDropdownItem({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) {
  console.log({ id, isAvailableForPurchase });
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
      onClick={async () => {
        toggleProductAvailability(
          { id, isAvailableForPurchase: !isAvailableForPurchase },
          {
            onError: (error) => {
              console.log("TOGGLEERROR>", error);
              router.refresh();
            },
            onSuccess: ({ message }: { message: string }) => {
              console.log("TOGGLE SUCCESS>", message);
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
