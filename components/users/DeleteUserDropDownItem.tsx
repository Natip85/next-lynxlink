"use client";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export default function DeleteUserDropDownItem({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: deleteUser, isPending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await axios.delete("/api/user", {
        data: { id },
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

  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        deleteUser({ id });
      }}
    >
      Delete
    </DropdownMenuItem>
  );
}
