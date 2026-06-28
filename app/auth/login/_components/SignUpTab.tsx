"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";

const signUpSchema = z.object({
  name: z.string().min(3, "Name  must be at least 3 characters."),
  email: z.email().min(1, "Mail can not be empty."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUpTab({ openEmailVerificationTab }: { openEmailVerificationTab: (email: string) => void }) {
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleSignUp(data: SignUpForm) {
    const res = await authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          toast.error(error.error.message || "Failed to Sign up");
        },
      },
    );
    if (res.error === null && !res.data.user.emailVerified) {
      openEmailVerificationTab(data.email);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSignUp)} id="signup-form">
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
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password-field">Password</FieldLabel>
              <PasswordInput
                {...field}
                id="password-field"
                aria-invalid={fieldState.invalid}
                placeholder="Your Password"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" form="signup-form" className="mt-5 w-full" disabled={isSubmitting}>
        <LoadingSwap isLoading={isSubmitting}>Submit</LoadingSwap>
      </Button>
    </form>
  );
}
