import { auth } from "@/lib/auth/auth";
import { ArrowLeft, Key, LinkIcon, Loader2Icon, Shield, Trash2, User } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import ProfileUpdateForm from "./_components/ProfileUpdateForm";
import EmailVerificationBanner from "./_components/EmailVerificationBanner";
import { Suspense, type ReactNode } from "react";
import SecurityTab from "./_components/SecurityTab";
import SessionsTab from "./_components/SessionsTab";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return redirect("/auth/login");

  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center  mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Link>
        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <Image width={64} height={64} src={session.user.image} alt="user avatar" className="object-cover" />
            ) : (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1">
            <div className="flex gap-1 justify-between items-center">
              <h1 className="text-3xl font-bold">{session.user.name || "User Profile"}</h1>
              {/* <Badge>{session.user.role}</Badge> */}
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      <EmailVerificationBanner currentEmail={session.user.email} />

      <Tabs className="space-y-2 mt-4" defaultValue="profile">
        <TabsList className="grrid grid-cols-5 w-full">
          <TabsTrigger value="profile">
            <User />
            <span className="max-sm:hidden">Profile</span>
          </TabsTrigger>

          <TabsTrigger value="security">
            <Shield />
            <span className="max-sm:hidden">Security</span>
          </TabsTrigger>

          <TabsTrigger value="sessions">
            <Key />
            <span className="max-sm:hidden">Sessions</span>
          </TabsTrigger>

          <TabsTrigger value="accounts">
            <LinkIcon />
            <span className="max-sm:hidden">Accounts</span>
          </TabsTrigger>

          <TabsTrigger value="danger">
            <Trash2 />
            <span className="max-sm:hidden">Danger</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              <ProfileUpdateForm user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <LoadingSuspense>
            <SecurityTab email={session.user.email} />
          </LoadingSuspense>
        </TabsContent>

        <TabsContent value="sessions">
          <LoadingSuspense>
            <SessionsTab currentSessionToken={session.session.token}/>
          </LoadingSuspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>{children}</Suspense>;
}
