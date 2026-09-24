"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const authFailed = searchParams.get("error") === "auth-failed";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    });

    setStatus(error ? "error" : "sent");
  }

  return (
    <div className="wrap">
      <div className="auth-card">
        <span className="tag">Decision Coach</span>
        <h1>Sign in</h1>
        <p className="subhead">
          Enter your email and we&apos;ll send you a link to sign in, no
          password needed.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending" || status === "sent"}
            />
          </div>

          <button
            type="submit"
            className="btn primary"
            style={{ width: "100%" }}
            disabled={status === "sending" || status === "sent"}
          >
            {status === "sending" ? "Sending link..." : "Send magic link"}
          </button>
        </form>

        {status === "sent" && (
          <div className="notice success">
            Check your inbox, we sent a sign-in link to {email}.
          </div>
        )}
        {status === "error" && (
          <div className="notice error">
            Something went wrong sending the link. Try again.
          </div>
        )}
        {authFailed && status === "idle" && (
          <div className="notice error">
            That sign-in link expired or was already used. Request a new one.
          </div>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
