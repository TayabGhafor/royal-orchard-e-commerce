import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  token: z.string().trim().min(4, "Enter the reset code"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

const ResetPassword = () => {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const resetPassword = useAuth((s) => s.resetPassword);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, token, password, confirm });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const res = resetPassword(email, token, password);
    if (!res.ok) return toast.error(res.error || "Unable to reset password");
    toast.success("Password updated. Please sign in.");
    navigate("/login");
  };

  return (
    <main className="min-h-screen flex flex-col bg-surface text-on-surface">
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-fixed opacity-20 rounded-full blur-[120px] pointer-events-none" />
        <Link to="/login" className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20 hover:text-primary hover:border-primary/40 transition-all">
          <Icon name="arrow_back" className="text-base" />
          <span className="text-sm font-semibold">Back to login</span>
        </Link>
        <div className="w-full max-w-md bg-surface-container-lowest rounded-lg shadow-2xl p-8 md:p-12 border border-outline-variant/10">
          <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-6">
            <Icon name="key" className="text-2xl" />
          </div>
          <h2 className="font-headline text-3xl font-bold mb-2">Reset Password</h2>
          <p className="text-on-surface-variant mb-8">Enter the code we generated and choose a new password.</p>
          <form className="space-y-5" onSubmit={submit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-5 py-4 bg-surface-container-low border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl" />
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Reset code" className="w-full px-5 py-4 bg-surface-container-low border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl tracking-widest font-mono uppercase" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full px-5 py-4 bg-surface-container-low border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl" />
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirm new password" className="w-full px-5 py-4 bg-surface-container-low border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl" />
            <button type="submit" className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;