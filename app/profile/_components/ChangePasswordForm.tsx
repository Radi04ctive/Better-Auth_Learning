"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { PasswordInput } from "@/components/ui/password-input";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Name  must be at least 6 characters."),
  newPassword: z.string().min(6, "Name  must be at least 6 characters."),
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      newPassword: "",
      currentPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleChangePassword(data: ChangePasswordForm) {
    await authClient.changePassword(
      { ...data, revokeOtherSessions: true },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to change password");
        },
        onSuccess: () => {
          toast.success("Password changed successfully");
          form.reset();
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleChangePassword)} id="update-profile-form">
      <FieldGroup className="space-y-2">
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="old-password-field">Current Password</FieldLabel>
              <PasswordInput {...field} id="old-password-field" aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="new-password-field">New Password</FieldLabel>
              <PasswordInput {...field} id="new-password-field" aria-invalid={fieldState.invalid} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" form="update-profile-form" className="mt-5 w-full" disabled={isSubmitting}>
        <LoadingSwap isLoading={isSubmitting}>Change</LoadingSwap>
      </Button>
    </form>
  );
}
