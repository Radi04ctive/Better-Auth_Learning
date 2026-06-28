"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.email().min(1, "Mail can not be empty."),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPassword({ openSignInTab }: { openSignInTab: () => void }) {
  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleResetPassword(data: ForgotPasswordForm) {
    await authClient.requestPasswordReset(
      { email: data.email, redirectTo: "/auth/reset-password" },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to send reset password email");
        },
        onSuccess: () => {
          toast.success("Password reset email sent");
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleResetPassword)} id="signup-form">
      <FieldGroup className="space-y-2">
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email-field">Email</FieldLabel>
              <Input
                {...field}
                id="email-field"
                aria-invalid={fieldState.invalid}
                placeholder="me@example.com"
                autoComplete="off"
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex gap-2 items-center mt-5">
        <Button type="button" variant="outline" onClick={openSignInTab}>
          Back
        </Button>
        <Button type="submit" form="signup-form" className="flex-1" disabled={isSubmitting}>
          <LoadingSwap isLoading={isSubmitting}>Send Email</LoadingSwap>
        </Button>
      </div>
    </form>
  );
}
