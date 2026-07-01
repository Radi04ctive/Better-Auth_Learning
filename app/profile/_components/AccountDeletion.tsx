"use client";

import AuthActionButton from "@/components/auth/auth-action-button";
import { authClient } from "@/lib/auth/auth-client";

export default function AccountDeletion() {
  return (
    <AuthActionButton
      requireAreYouSure
      variant="destructive"
      className="w-full"
      successMessage="Account deletion initiate. Please check your email to confirm"
      action={() => authClient.deleteUser({ callbackURL: "/" })}
    >
      Delete Account Permanatly
    </AuthActionButton>
  );
}
