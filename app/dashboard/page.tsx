import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "./sign-out-button";

// Protected page. Middleware already redirects signed-out visitors to
// /login, but we re-check here too since this runs server-side and is the
// authoritative check.
export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="wrap">
      <div className="nav-row">
        <SignOutButton />
      </div>
      <div className="dashboard-card">
        <span className="tag">Signed in</span>
        <h1>Welcome back</h1>
        <p className="subhead">
          You&apos;re signed in as <strong>{user.email}</strong>.
        </p>
        <p className="subhead">
          This is a placeholder home base. The actual decision-reflection
          conversation flow (Step 1 from the landing page) plugs in here
          next.
        </p>
      </div>
    </div>
  );
}
