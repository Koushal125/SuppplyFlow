
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

const ROLES = [
  { key: "store_employee", label: "Sign in as Employee" },
  { key: "store_manager", label: "Sign in as Store Manager" },
  { key: "admin", label: "Sign in as Admin" },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState<"store_employee" | "store_manager" | "admin">(
    "store_employee"
  );
  const [submitting, setSubmitting] = useState(false);

  if (user && !loading) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (tab === "login") {
        await signIn(form);
        toast({ title: "Logged in", description: "Welcome back!" });
      } else {
        // Pass the role as metadata for sign up
        await signUp({ ...form, data: { role } });
        toast({
          title: "Account created",
          description: `Please log in to continue as ${role.replace("_", " ")}.`,
        });
        setTab("login");
      }
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-sm p-8">
        <h1 className="text-xl font-bold mb-6 text-center">
          {tab === "login"
            ? "Sign In to SupplyFlow"
            : "Create your SupplyFlow account"}
        </h1>
        <div className="mb-4 space-y-2">
          <div className="flex justify-center gap-2">
            {ROLES.map((r) => (
              <Button
                key={r.key}
                variant={role === r.key ? "default" : "outline"}
                type="button"
                className="flex-1"
                onClick={() => setRole(r.key as typeof role)}
              >
                {r.label}
              </Button>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
          <Input
            type="password"
            placeholder="Password"
            autoComplete={tab === "signup" ? "new-password" : "current-password"}
            required
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          {/* Display the current selected role */}
          <div className="text-xs text-muted-foreground text-center">
            {tab === "signup"
              ? `Signing up as: ${role.replace("_", " ")}`
              : `Signing in as: ${role.replace("_", " ")}`}
          </div>
          <Button type="submit" className="w-full" disabled={submitting}>
            {tab === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <div className="text-center mt-4 text-sm">
          {tab === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button onClick={() => setTab("signup")} className="underline text-primary">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setTab("login")} className="underline text-primary">
                Sign in
              </button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
