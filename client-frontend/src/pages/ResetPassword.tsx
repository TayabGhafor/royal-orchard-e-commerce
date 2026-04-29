import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";
import { PASSWORD_RESET_TOKEN_KEY } from "@/lib/password-reset";

const schema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

const ResetPassword = () => {
  const [params] = useSearchParams();
  const emailHint = params.get("email") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tokenReady] = useState(() => {
    try {
      return Boolean(sessionStorage.getItem(PASSWORD_RESET_TOKEN_KEY));
    } catch {
      return false;
    }
  });
  const resetPasswordWithToken = useAuth((s) => s.resetPasswordWithToken);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ password, confirm });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    let resetToken = "";
    try {
      resetToken = sessionStorage.getItem(PASSWORD_RESET_TOKEN_KEY) || "";
    } catch {
      toast.error("Unable to read reset session.");
      return;
    }
    if (!resetToken) {
      toast.error("Your reset session expired. Start again from forgot password.");
      navigate("/forgot-password");
      return;
    }

    setLoading(true);
    const res = await resetPasswordWithToken(resetToken, password, confirm);
    setLoading(false);
    if (!res.ok) return toast.error(res.error || "Unable to reset password");

    try {
      sessionStorage.removeItem(PASSWORD_RESET_TOKEN_KEY);
    } catch {
      // ignore
    }
    toast.success("Password updated. Please sign in.");
    navigate("/login");
  };

  if (!tokenReady) {
    return (
      <main className="min-h-screen flex flex-col bg-surface text-on-surface">
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4 max-w-md mx-auto text-center">
          <Icon name="lock_reset" className="text-5xl text-primary-fixed-dim" />
          <p className="text-on-surface-variant">
            Complete the code verification step first, or your session expired.
          </p>
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-bold text-sm"
          >
            Forgot password
          </Link>
          <Link to="/login" className="text-primary font-semibold text-sm hover:underline">
            Sign in
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
          to="/login"
          className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20 hover:text-primary hover:border-primary/40 transition-all shadow-sm"
        >
          <Icon name="arrow_back" className="text-base" />
          <span className="text-sm font-semibold">Back to login</span>
        </Link>

        <div className="w-full max-w-md relative z-10">
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl shadow-primary/5 border border-outline-variant/15 p-8 sm:p-10 md:p-12">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary-container/80 text-primary flex items-center justify-center mb-6 ring-4 ring-primary-fixed/15 shadow-inner">
                <Icon name="key" className="text-3xl" />
              </div>
              <h2 className="font-headline text-3xl font-bold text-on-surface mb-2 tracking-tight">New password</h2>
              <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-sm mx-auto">
                {emailHint ? (
                  <>
                    Choose a new password for{" "}
                    <span className="font-semibold text-on-surface break-all">{emailHint}</span>
                  </>
                ) : (
                  "Choose a strong password for your account."
                )}
              </p>
            </div>

            <form className="space-y-5" onSubmit={submit}>
              <div className="space-y-2 text-left">
                <label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant ml-1">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    className="w-full px-5 py-4 bg-surface-container-low border border-transparent outline-none focus:ring-2 focus:ring-primary rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                    aria-label="Toggle new password visibility"
                  >
                    <Icon name={showPassword ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-left">
                <label htmlFor="confirm" className="block text-sm font-semibold text-on-surface-variant ml-1">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    autoComplete="new-password"
                    placeholder="Repeat password"
                    className="w-full px-5 py-4 bg-surface-container-low border border-transparent outline-none focus:ring-2 focus:ring-primary rounded-xl pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                    aria-label="Toggle confirm password visibility"
                  >
                    <Icon name={showConfirm ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform disabled:opacity-60"
              >
                {loading ? "Updating…" : "Update password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
