import { Card, CardContent} from "@/components/ui/card";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import AccountLinking from "./AccountLinking";

export default async function AccountsTab() {
    const accounts = await auth.api.listUserAccounts({ headers: await headers() });
    const nonCriticalAccounts = accounts.filter(account => account.providerId !== "credential");
  return (
    <Card>
      <CardContent>
        <AccountLinking accounts={nonCriticalAccounts}/>
      </CardContent>
    </Card>
  )
}
