import AuthActionButton from "@/components/auth/auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useEffect, useRef, useState } from "react";

export default function EmailVerification({ email }: { email: string }) {
  const [timeToNextResend, setTimeToNextResend] = useState(30);
  const interval = useRef<NodeJS.Timeout>(undefined);

  function startEmailVerificationCountdown(time = 30) {
    setTimeToNextResend(time);
    interval.current = setInterval(() => {
      setTimeToNextResend((prev) => {
        const newT = prev - 1;
        if (newT <= 0) {
          clearInterval(interval.current);
          return 0;
        }
        return newT;
      });
    }, 1000);
  }

  useEffect(() => {
    startEmailVerificationCountdown();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        We sent you a verification link. Please check your email and click the link to verify your account.
      </p>
      <AuthActionButton
        variant="outline"
        className="w-full"
        action={() => {
          startEmailVerificationCountdown();
          return authClient.sendVerificationEmail({ email, callbackURL: "/" });
        }}
        successMessage="Verification email sent!"
        disabled={timeToNextResend > 0}
      >
        {timeToNextResend > 0 ? `Resend Email (${timeToNextResend})` : "Resend Email"}
      </AuthActionButton>
    </div>
  );
}
