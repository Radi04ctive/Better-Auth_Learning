"use client";

import AuthActionButton from "@/components/auth/auth-action-button";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import {
  SUPPORTED_OAUTH_PROVIDERS,
  SUPPORTED_OAUTH_PROVIDERS_DETAILS,
  type SupportedOauthProviders,
} from "@/lib/auth/o-auth-providerss";
import { Plus, Shield, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export default function AccountLinking({ accounts }: { accounts: Account[] }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Linked Accounts</h3>

        {accounts.length === 0 ? (
          <Card>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">
                No linked accounts founds
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <AccountCard key={account.id} provider={account.providerId} account={account} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Link other accounts</h3>
        <div className="grid  gap-3">
          {SUPPORTED_OAUTH_PROVIDERS.filter((provider) => !accounts.find((acc) => acc.providerId === provider)).map(
            (provider) => (
              <AccountCard key={provider} provider={provider} />
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function AccountCard({ provider, account }: { provider: string; account?: Account }) {
  const router = useRouter();
  const providerDetails = SUPPORTED_OAUTH_PROVIDERS_DETAILS[provider as SupportedOauthProviders] ?? {
    name: provider,
    Icon: Shield,
  };

  function linkAccount() {
    return authClient.linkSocial({
      provider,
      callbackURL: "/profile",
    });
  }

  function unlinkAccount() {
    if (!account) return Promise.reject({ error: { message: "Account not found" } });
    return authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <providerDetails.Icon className="size-5" />
            <div className="">
              <p className="text-sm font-medium">{providerDetails.name}</p>
              {!account ? (
                <p className="text-sm text-muted-foreground">Connect your {providerDetails.name} account</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Linked on {new Date(account.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {!account ? (
            <AuthActionButton variant="outline" size="sm" action={linkAccount}>
              <Plus />
              Link
            </AuthActionButton>
          ) : (
            <AuthActionButton variant="destructive" size="sm" action={unlinkAccount}>
              <Trash2 />
              Unlink
            </AuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
