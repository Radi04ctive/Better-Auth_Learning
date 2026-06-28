"use client";

import AuthActionButton from "@/components/auth/auth-action-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { SUPPORTED_OAUTH_PROVIDERS, SUPPORTED_OAUTH_PROVIDERS_DETAILS } from "@/lib/auth/o-auth-providerss";

export default function SocialAuthButtons() {
  return SUPPORTED_OAUTH_PROVIDERS.map((provider) => {
    const Icon = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].Icon;

    return (
      <AuthActionButton
        key={provider}
        variant="outline"
        action={() => authClient.signIn.social({ provider, callbackURL: "/" })}
      >
        <Icon />
        {SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider].name}
      </AuthActionButton>
    );
  });
}
