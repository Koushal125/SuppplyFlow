
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "" });
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
        await signUp(form);
        toast({ title: "Account created", description: "Please log in to continue." });
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
          {tab === "login" ? "Sign In to SupplyFlow" : "Create your SupplyFlow account"}
        </h1>
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
