"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Session } from "better-auth";
import { Badge } from "@/components/ui/badge";
import { UAParser } from "ua-parser-js";
import { AlertTriangle, Monitor, Smartphone, Trash2 } from "lucide-react";
import AuthActionButton from "@/components/auth/auth-action-button";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function SessionManagement({
  sessions,
  currentSessionToken,
}: {
  sessions: Session[];
  currentSessionToken: string;
}) {
  const router = useRouter();
  const otherSessions = sessions.filter((s) => s.token !== currentSessionToken);
  const currentSession = sessions.find((s) => s.token === currentSessionToken);

  function revokeOtherSessions() {
    return authClient.revokeOtherSessions(undefined, {
      onSuccess: () => {
        router.refresh();
      },
    });
  }

  return (
    <div className="space-y-6">
      {currentSession && <SessionCard session={currentSession} isCurrentSession />}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Other Active Sessions</h3>
          {otherSessions.length > 0 && (
            <AuthActionButton variant="destructive" size="sm" action={revokeOtherSessions}>
              <AlertTriangle className="size-4 mr-2" />
              Revoke All Other Sessions
            </AuthActionButton>
          )}
        </div>

        {otherSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center text-muted-foreground text-lg" style={{ padding: "40px 0" }}>
              No other active sessions
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {otherSessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({ session, isCurrentSession = false }: { session: Session; isCurrentSession?: boolean }) {
  const router = useRouter();
  const userAgentInfo = session.userAgent ? UAParser(session.userAgent) : null;

  function getBrowserInformation() {
    if (!userAgentInfo) return "Unknown Device";
    if (!userAgentInfo.browser.name || !userAgentInfo.os.name) return "Unkown Device";
    if (!userAgentInfo.browser.name) return userAgentInfo.os.name;
    if (!userAgentInfo.os.name) return userAgentInfo.browser.name;

    return `${userAgentInfo.browser.name} ${userAgentInfo.os.name}`;
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  function revokeSession() {
    return authClient.revokeSession(
      { token: session.token },
      {
        onSuccess: () => {
          router.refresh();
        },
      },
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle>{getBrowserInformation()}</CardTitle>
          {isCurrentSession && <Badge>Current Session</Badge>}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {userAgentInfo?.device.type === "mobile" ? <Smartphone /> : <Monitor />}
              <div>
                <p className="text-sm text-muted-foreground">Created: {formatDate(session.createdAt)}</p>
                <p className="text-sm text-muted-foreground">Expires: {formatDate(session.expiresAt)}</p>
              </div>
            </div>

            {!isCurrentSession && (
              <AuthActionButton variant="destructive" size="sm" action={revokeSession} successMessage="Session revoked">
                <Trash2 />
              </AuthActionButton>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
