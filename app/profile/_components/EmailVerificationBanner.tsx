"use client";

import { MailWarning } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "pendingEmailChange";

type PendingChange = { oldEmail: string; newEmail: string };

function getPendingChange(): PendingChange | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingChange;
    if (!parsed.oldEmail || !parsed.newEmail) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearPendingChange() {
  localStorage.removeItem(STORAGE_KEY);
}

function setPendingChange(value: PendingChange) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

/**
 * Call this from the profile form right after `changeEmail()` succeeds (step 1).
 */
export function markEmailChangeStarted(oldEmail: string, newEmail: string) {
  setPendingChange({ oldEmail, newEmail });
}

/**
 * Shows a banner while a two-step email change is in progress.
 *
 * Better Auth's `changeEmail` flow is stateless on the DB between steps 2 and 3:
 * the user record is only updated when the NEW email link is clicked. So while
 * the user waits, `session.user.email` is still the old one and `emailVerified`
 * is still `true` — there is no server signal to gate on. We instead track the
 * pending change client-side and auto-clear it once the session email finally
 * matches the new one (step 3 done).
 */
export default function EmailVerificationBanner({
  currentEmail,
}: {
  currentEmail: string;
}) {
  const [pending, setPending] = useState<PendingChange | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const change = getPendingChange();
    // Once the session email matches the new email, step 3 is done — clear the flag.
    if (change && change.newEmail.toLowerCase() === currentEmail.toLowerCase()) {
      clearPendingChange();
      setPending(null);
    } else {
      setPending(change);
    }
  }, [currentEmail]);

  // Avoid rendering on the server / first paint to prevent hydration mismatch.
  if (!mounted || !pending) return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300/60 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-950/30">
      <MailWarning className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div className="space-y-1 text-sm">
        <p className="font-medium text-amber-800 dark:text-amber-200">
          Verify your new email address
        </p>
        <p className="text-muted-foreground">
          We sent a verification link to{" "}
          <span className="font-semibold text-foreground">{pending.newEmail}</span>. Check
          your inbox and click the link to finish changing your email from{" "}
          <span className="font-semibold text-foreground">{pending.oldEmail}</span>.
        </p>
        <p className="text-muted-foreground">
          Didn&apos;t get it? Re-enter the new email in the form and save again to resend.
        </p>
      </div>
    </div>
  );
}
