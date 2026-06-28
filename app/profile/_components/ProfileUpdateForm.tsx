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
import { useRouter } from "next/navigation";
import { markEmailChangeStarted } from "./EmailVerificationBanner";

const profileUpdateSchema = z.object({
  name: z.string().min(3, "Name  must be at least 3 characters."),
  email: z.email().min(1, "Mail can not be empty."),
  nickName: z.string().min(3, "Your nick name is too short").max(9, "Your nick name is too long"),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export default function ProfileUpdateForm({
  user,
}: {
  user: { id: string; name: string; email: string; nickName: string };
}) {
  
  const router = useRouter();
  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: user,
  });

  const { isSubmitting } = form.formState;

  async function handleUpdateProfile(data: ProfileUpdateForm) {
    const promises = [
      authClient.updateUser({
        name: data.name,
        nickName: data.nickName,
      }),
    ];

    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "/profile",
        }),
      );
    }

    const res = await Promise.all(promises);
    const userUpdateResult = res[0];
    const emailChangeResult = res[1] ?? { error: false };

    if (userUpdateResult.error) {
      toast.error(userUpdateResult.error.message || "Failed to update profile");
    } else if (emailChangeResult.error) {
      toast.error(emailChangeResult.error.message || "Failed to change email");
    } else {
      if (data.email !== user.email) {
        markEmailChangeStarted(user.email, data.email);
        toast.success("Confirm the email change from your old email address.");
      } else {
        toast.success("Profile updated successfully");
      }

      router.refresh();
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleUpdateProfile)} id="update-profile-form">
      <FieldGroup className="space-y-2">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name-field">Name</FieldLabel>
              <Input
                {...field}
                id="name-field"
                aria-invalid={fieldState.invalid}
                placeholder="User Name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
        <Controller
          name="nickName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="nickname-field">Nick Name</FieldLabel>
              <Input
                {...field}
                id="nickname-field"
                aria-invalid={fieldState.invalid}
                placeholder="your favorite nick name"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" form="update-profile-form" className="mt-5 w-full" disabled={isSubmitting}>
        <LoadingSwap isLoading={isSubmitting}>Update</LoadingSwap>
      </Button>
    </form>
  );
}
