"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { DiscountCode } from "@prisma/client";

export function ActiveDiscountCodeToggleDropdownItem({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: toggleDiscountCodeActive, isPending } = useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: Pick<DiscountCode, "id" | "isActive">) => {
      const response = await axios.patch("/api/discountCodes/active-toggle", {
        id,
        isActive,
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
    onSuccess: ({ isActive }: { isActive: boolean }) => {
      toast({
        title: "Success",
        description: `${
          isActive ? "Discount code active" : "Discount code deactivated"
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
        toggleDiscountCodeActive({ id, isActive: !isActive });
        router.refresh();
      }}
    >
      {isActive ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
}

export function DeleteDiscountCodeDropdownItem({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: deleteDiscountCode, isPending: isPending2 } = useMutation({
    mutationFn: async ({ id }: Pick<DiscountCode, "id">) => {
      const response = await axios.delete("/api/discountCodes/active-toggle", {
        data: { id },
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
    onSuccess: ({ code }: DiscountCode) => {
      toast({
        title: "Success",
        description: `${
          code ? "Discount code deleted" : "Something went wrong."
        }`,
        variant: "success",
      });
      router.refresh();
    },
  });
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending2}
      onClick={() => {
        deleteDiscountCode({ id });
        router.refresh();
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
