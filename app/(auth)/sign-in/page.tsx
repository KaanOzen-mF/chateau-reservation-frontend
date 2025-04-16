"use client";

import apiClient from "@/lib/api";
import { AuthResponse } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuthStore } from "@/store/authStore";

const signInSchema = z.object({
  email: z.string().email({ message: "Email is not valid" }),
  password: z.string().min(8, { message: "Password is required" }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const loginAction = useAuthStore((state) => state.login);
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true);
    console.log("Login Form Sending...", values);
    try {
      const response = await apiClient<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
      });
      console.log("Login Success response", response);

      if (response?.accessToken) {
        // --- LocalStorage yerine Zustand store'daki login eylemini çağır ---
        loginAction(response.accessToken); // Token'ı store'a gönder
        // --------------------------------------------------------------------

        toast.success("Login successfully...");
        router.push("/");
      } else {
        throw new Error("Login failed. No access token received.");
      }
    } catch (error) {
      console.error("Login Error response", error);
      toast.error(
        error instanceof Error ? error.message : "Error while logging in"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Enter Your Account for Access</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      {...field}
                      disabled={isLoading}
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
                      type="password"
                      placeholder="••••••"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing" : "Sign In"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm">
        Don&apos;t have an account?
        <Link
          href="/sign-up"
          className="ml-1 font-medium text-primary hover:underline"
        >
          Sign Up
        </Link>
      </CardFooter>
    </Card>
  );
}
