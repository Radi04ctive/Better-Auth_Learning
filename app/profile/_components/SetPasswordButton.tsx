"use client";

import AuthActionButton from "@/components/auth/auth-action-button";
import { authClient } from "@/lib/auth/auth-client";

export default function SetPasswordButton({ email }: { email: string }) {
  return (
    <AuthActionButton
      variant="outline"
      successMessage="Password reset email sent."
      action={() => {
        return authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/reset-password",
        });
      }}
    >
      Send Password Reset email
    </AuthActionButton>
  );
}
