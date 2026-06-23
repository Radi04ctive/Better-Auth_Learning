'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpTab } from "./_components/SignUpTab";
import { SignInTab } from "./_components/SignInTab";
import { Separator } from "@/components/ui/separator";
import SocialAuthButtons from "./_components/SocialAuthButtons";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter()
  useEffect(() => {
    authClient.getSession().then(session => {
      if(session.data !== null) router.push('/')
    })
  }, [router])
  return (
    <Tabs defaultValue="signin" className="max-w-md w-full my-6 px-4 mx-auto">
      <TabsList>
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-medium">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab />
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
            <SignUpTab />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
