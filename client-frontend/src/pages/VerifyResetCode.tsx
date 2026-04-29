import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";
import { PASSWORD_RESET_TOKEN_KEY } from "@/lib/password-reset";

const VerifyResetCode = () => {
  const [params] = useSearchParams();
  const email = useMemo(() => params.get("email")?.trim() ?? "", [params]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const verifyResetCode = useAuth((s) => s.verifyResetCode);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const digits = code.replace(/\D/g, "").slice(0, 6);
    if (digits.length !== 6) {
      toast.error("Enter the 6-digit code");
      return;
    }
    if (!email) {
      toast.error("Missing email. Start from forgot password.");
      navigate("/forgot-password");
      return;
    }
    setLoading(true);
    const res = await verifyResetCode(email, digits);
    setLoading(false);
    if (!res.ok || !res.resetToken) {
      toast.error(res.error || "Invalid code");
      return;
    }
    try {
      sessionStorage.setItem(PASSWORD_RESET_TOKEN_KEY, res.resetToken);
    } catch {
      toast.error("Could not save reset session. Allow storage or try another browser.");
      return;
    }
    toast.success("Code verified");
    navigate(`/reset-password?email=${encodeURIComponent(email)}`);
  };

  if (!email) {
    return (
      <main className="min-h-screen flex flex-col bg-surface text-on-surface">
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
          <p className="text-on-surface-variant text-center">No email provided.</p>
          <Link to="/forgot-password" className="text-primary font-bold hover:underline">
            Request a reset code
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-surface text-on-surface">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-fixed opacity-20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-fixed opacity-15 rounded-full blur-[100px] pointer-events-none" />
        <Link
          to="/forgot-password"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20 text-on-surface hover:text-primary hover:border-primary/40 transition-all shadow-sm"
        >
          <Icon name="arrow_back" className="text-base" />
          <span className="text-sm font-semibold">Back</span>
        </Link>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl shadow-primary/5 border border-outline-variant/15 p-8 sm:p-10 md:p-12">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary-container/80 text-primary flex items-center justify-center mb-6 ring-4 ring-primary-fixed/15 shadow-inner">
                <Icon name="verified_user" className="text-3xl" />
              </div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2 tracking-tight">Verify your email</h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                Enter the 6-digit code we sent to{" "}
                <span className="font-semibold text-on-surface break-all">{email}</span>
              </p>
            </div>

            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-2 text-left">
                <label htmlFor="code" className="block text-sm font-semibold text-on-surface-variant ml-1">
                  6-digit code
                </label>
                <input
                  id="code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full px-5 py-4 bg-surface-container-low border border-transparent outline-none focus:ring-2 focus:ring-primary focus:border-primary/30 rounded-xl text-on-surface text-center text-2xl tracking-[0.5em] font-mono placeholder:text-on-surface-variant/40 placeholder:tracking-normal"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] active:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {loading ? "Verifying…" : "Continue"}
              </button>
            </form>

            {import.meta.env.DEV && (
              <p className="mt-6 text-center text-xs text-on-surface-variant">
                Dev: test code <span className="font-mono font-bold text-on-surface">424242</span> (registered email only).
              </p>
            )}

            <p className="mt-8 text-center text-on-surface-variant text-sm">
              <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-2">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default VerifyResetCode;
