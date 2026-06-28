"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/ui/password-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token") || undefined;
  const errorParam = searchParams.get("error");

  const router = useRouter();

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleResetPassword(data: ResetPasswordForm) {
    if (!tokenParam) return;
    await authClient.resetPassword(
      { newPassword: data.password, token: tokenParam },
      {
        onError: () => {
          toast.error("Failed to reset the password, try again.");
        },
        onSuccess: () => {
          toast.success("Password reset successfully", { description: "Redirecting to Login..." });
          setTimeout(() => router.push("/auth/login"), 1000);
        },
      },
    );
  }

  if (!tokenParam || errorParam) {
    return (
      <div className="mt-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>The password reset link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/auth/login">Back to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Your Passworrd</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleResetPassword)} id="reset-password-form" className="space-y-4">
            <FieldGroup className="space-y-2">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                    <PasswordInput {...field} id="new-password" aria-invalid={fieldState.invalid} autoComplete="off" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type="submit" form="reset-password-form" className="flex-1" disabled={isSubmitting}>
              <LoadingSwap isLoading={isSubmitting}>Reset Password</LoadingSwap>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
