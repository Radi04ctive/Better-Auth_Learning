"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
  email: z.email().min(1, "Mail can not be empty."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type SignInForm = z.infer<typeof signInSchema>;

export function SignInTab({
  openEmailVerificationTab,
  openForgotPassword,
}: {
  openEmailVerificationTab: (email: string) => void;
  openForgotPassword: () => void;
}) {
  const router = useRouter();
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function handleSignIn(data: SignInForm) {
    await authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        onError: (error) => {
          if (error.error.code === "EMAIL_NOT_VERIFIED") {
            openEmailVerificationTab(data.email);
          }

          toast.error(error.error.message || "Failed to Sign In");
        },
        onSuccess: () => {
          toast.success("Sign In successfullay");
          router.push("/");
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(handleSignIn)} id="signup-form">
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
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex justify-between items-center">
                <FieldLabel htmlFor="password-field">Password</FieldLabel>
                <Button
                  onClick={openForgotPassword}
                  type="button"
                  variant="link"
                  size="xs"
                >
                  Forgot Password?
                </Button>
              </div>
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
        <LoadingSwap isLoading={isSubmitting}>Sign In</LoadingSwap>
      </Button>
    </form>
  );
}
