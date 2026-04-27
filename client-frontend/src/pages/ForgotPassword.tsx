import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";

const schema = z.object({ email: z.string().trim().email("Enter a valid email") });

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [issuedToken, setIssuedToken] = useState<string | null>(null);
  const requestPasswordReset = useAuth((s) => s.requestPasswordReset);
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    const res = requestPasswordReset(email);
    if (!res.ok) return toast.error(res.error || "Unable to issue reset code");
    setIssuedToken(res.token!);
    toast.success("Reset code generated");
  };

  return (
    <main className="min-h-screen flex flex-col bg-surface text-on-surface">
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-fixed opacity-20 rounded-full blur-[120px] pointer-events-none" />
        <Link to="/login" className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20 hover:text-primary hover:border-primary/40 transition-all">
          <Icon name="arrow_back" className="text-base" />
          <span className="text-sm font-semibold">Back to login</span>
        </Link>
        <div className="w-full max-w-md bg-surface-container-lowest rounded-lg shadow-2xl p-8 md:p-12 border border-outline-variant/10 relative">
          <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-6">
            <Icon name="lock_reset" className="text-2xl" />
          </div>
          <h2 className="font-headline text-3xl font-bold mb-2">Forgot your password?</h2>
          <p className="text-on-surface-variant mb-8">Enter your email and we'll generate a one-time reset code.</p>
          {!issuedToken ? (
            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant ml-1">Email Address</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@royalorchard.com" className="w-full px-5 py-4 bg-surface-container-low border-0 outline-none focus:ring-2 focus:ring-primary rounded-xl" />
              </div>
              <button type="submit" className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform">
                Send Reset Code
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="bg-secondary-container text-on-secondary-container p-5 rounded-xl">
                <p className="text-xs font-bold uppercase tracking-widest mb-2">Your reset code</p>
                <p className="font-headline text-3xl font-extrabold tracking-widest">{issuedToken}</p>
                <p className="text-xs mt-3 opacity-80">In a real backend this would be emailed. Code expires in 30 minutes.</p>
              </div>
              <button onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)} className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform">
                Continue to Reset
              </button>
            </div>
          )}
          <p className="mt-8 text-center text-on-surface-variant text-sm">
            Remembered it? <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;