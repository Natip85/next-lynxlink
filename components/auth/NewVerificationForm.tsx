"use client";
import { useCallback, useEffect, useState } from "react";
import CardWrapper from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "../ui/use-toast";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [success, setSuccess] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const { toast } = useToast();

  const { mutate: verifyUser, isPending } = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const response = await axios.patch("/api/newVerification", {
        token,
      });

      return response.data;
    },
  });
  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Missing token");
      return;
    }

    verifyUser(
      { token },
      {
        onError: (error) => {
          if (error instanceof AxiosError) {
            setError("Something went wrong");
          }
        },
        onSuccess: ({ success }: { success: string }) => {
          setSuccess(success);
        },
      }
    );
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className="m-20 h-fit">
      <CardWrapper
        headerLabel="Confirming your verification"
        backButtonLabel="Back to login"
        backButtonHref="/"
      >
        <div className="flex items-center justify-center w-full">
          {!success && !error && <BeatLoader />}
          <div>{success}</div>
        </div>
      </CardWrapper>
    </div>
  );
}
