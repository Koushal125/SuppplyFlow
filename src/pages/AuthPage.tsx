
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ROLES = [
  { key: "store_employee", label: "Employee" },
  { key: "store_manager", label: "Store Manager" },
  { key: "admin", label: "Admin" },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, user, loading } = useAuth();
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ email: "", password: "", role: "store_employee" });
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
        await signIn({ email: form.email, password: form.password });
        toast({ title: "Logged in", description: "Welcome back!" });
      } else {
        await signUp({ 
          email: form.email, 
          password: form.password,
          options: {
            data: { role: form.role }
          }
        });
        toast({
          title: "Account created",
          description: `Please log in to continue as ${form.role.replace("_", " ")}.`,
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
          {tab === "signup" && (
            <Select
              value={form.role}
              onValueChange={(value) => setForm(f => ({ ...f, role: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role.key} value={role.key}>
                    Sign in as {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="text-xs text-muted-foreground text-center">
            {tab === "signup"
              ? `Signing up as: ${form.role.replace("_", " ")}`
              : ""}
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
