"use client";
import * as z from "zod";
import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/validations";
import CardWrapper from "./CardWrapper";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

type Inputs = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async ({ email, password }: Inputs) => {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      return response.data;
    },
  });
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = (data: z.infer<typeof LoginSchema>) => {
    login(
      { email: data.email, password: data.password },
      {
        onError: (error: any) => {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });

          if (
            error.response?.status === 500 ||
            error.response?.status === 401 ||
            error.response?.status === 400
          ) {
            toast({
              title: "Error",
              description: error.response?.data.error,
              variant: "destructive",
            });
          }
        },
        onSuccess: ({ success }: { success: string }) => {
          toast({
            title: "Success",
            description: success,
            variant: "success",
          });
          router.push("/home");
          router.refresh();
        },
      }
    );
  };
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Dont't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="john.doe@example.com"
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="******"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                  <Button
                    size={"sm"}
                    variant={"link"}
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href={"/auth/reset"}>Forgot password?</Link>
                  </Button>
                </FormItem>
              )}
            />
          </div>
          {/* <FormError message={error || urlError} />
        <FormSuccess message={success} /> */}
          <Button disabled={isPending} type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}
