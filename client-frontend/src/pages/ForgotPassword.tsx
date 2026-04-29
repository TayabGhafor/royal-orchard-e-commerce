import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";

const schema = z.object({ email: z.string().trim().email("Enter a valid email") });

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const forgotPassword = useAuth((s) => s.forgotPassword);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setLoading(true);
    const res = await forgotPassword(email.trim());
    setLoading(false);
    if (!res.ok) return toast.error(res.error || "Unable to send reset code");
    toast.success("Code sent. Check your email, then enter it below.");
    navigate(`/verify-reset-code?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <main className="min-h-screen flex flex-col bg-surface text-on-surface">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-fixed opacity-20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-fixed opacity-15 rounded-full blur-[100px] pointer-events-none" />
        <Link
          to="/login"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20 text-on-surface hover:text-primary hover:border-primary/40 transition-all shadow-sm"
        >
          <Icon name="arrow_back" className="text-base" />
          <span className="text-sm font-semibold">Back to login</span>
        </Link>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl shadow-primary/5 border border-outline-variant/15 p-8 sm:p-10 md:p-12">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary-container/80 text-primary flex items-center justify-center mb-6 ring-4 ring-primary-fixed/15 shadow-inner">
                <Icon name="lock_reset" className="text-3xl" />
              </div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2 tracking-tight">Forgot your password?</h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                Enter your email and we&apos;ll send you a one-time 6-digit code.
              </p>
            </div>

            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-2 text-left">
                <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant ml-1">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@royalorchard.com"
                  autoComplete="email"
                  className="w-full px-5 py-4 bg-surface-container-low border border-transparent outline-none focus:ring-2 focus:ring-primary focus:border-primary/30 rounded-xl text-on-surface placeholder:text-on-surface-variant/70 transition-shadow"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send reset code"}
              </button>
            </form>

            <p className="mt-8 text-center text-on-surface-variant text-sm">
              Remembered it?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-2">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
