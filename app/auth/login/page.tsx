"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpTab } from "./_components/SignUpTab";
import { SignInTab } from "./_components/SignInTab";
import { Separator } from "@/components/ui/separator";
import SocialAuthButtons from "./_components/SocialAuthButtons";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import EmailVerification from "./_components/EmailVerification";
import { ForgotPassword } from "./_components/ForgotPassword";

type Tab = "signin" | "signup" | "emailVerification" | "forgotPassword";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [selectedTab, setSelectedTab] = useState<Tab>("signin");

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data !== null) router.push("/");
    });
  }, [router]);

  function openEmailVerificationTab(email: string) {
    setEmail(email);
    setSelectedTab("emailVerification");
  }

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(t) => setSelectedTab(t as Tab)}
      className="max-w-md w-full my-6 px-4 mx-auto"
    >
      {(selectedTab === "signin" || selectedTab === "signup") && (
        <TabsList className="w-full">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-medium">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab
              openEmailVerificationTab={openEmailVerificationTab}
              openForgotPassword={() => setSelectedTab("forgotPassword")}
            />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-medium">Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpTab openEmailVerificationTab={openEmailVerificationTab} />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="emailVerification">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-medium">Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerification email={email} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="forgotPassword">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-medium">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <ForgotPassword openSignInTab={() => setSelectedTab("signin")} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
