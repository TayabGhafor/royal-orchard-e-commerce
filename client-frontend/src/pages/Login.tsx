import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@/components/Icon";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useAuth } from "@/store/auth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const signIn = useAuth((s) => s.signIn);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
  const adminUrl = import.meta.env.VITE_ADMIN_URL as string | undefined;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    (async () => {
      const result = await signIn(email, password);
      if (!result.ok) {
        toast.error(result.error || "Unable to sign in");
        return;
      }
      if (result.role === "admin") {
        toast.success("Welcome, Admin!");
        if (adminUrl) {
          window.location.assign(adminUrl);
          return;
        }
        navigate("/");
      } else {
        toast.success("Welcome back!");
        navigate(from && !from.startsWith("/login") && !from.startsWith("/signup") ? from : "/");
      }
    })();
  };

  return (
    <main className="min-h-screen flex flex-col bg-surface text-on-surface">
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-fixed opacity-20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary-fixed opacity-15 rounded-full blur-[100px] pointer-events-none" />

        <Link
          to="/"
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-lowest/80 backdrop-blur-md border border-outline-variant/20 text-on-surface hover:text-primary hover:border-primary/40 transition-all shadow-sm"
        >
          <Icon name="arrow_back" className="text-base" />
          <span className="text-sm font-semibold">Back to store</span>
        </Link>

        <ScrollReveal variant="fade-up" duration={0.92} className="w-full max-w-[1100px] grid md:grid-cols-2 bg-surface-container-lowest rounded-lg shadow-2xl shadow-primary/5 overflow-hidden border border-outline-variant/10">
          <div className="hidden md:block relative overflow-hidden group">
            <img
              alt="Premium Royal Orchard"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwDcnMbx1Di2ICXNn8HE6QK13isEFc6pCbVRIoWHzKS8l8oXwOZhgzsp7cb_nax2Kqiuco-sSds98XnRsK24S2xcgx_9TsdjWfG_NcVxNlSyjpBQJQxVmjUnQJ-ss1G6mBJ3OxfvLT7X44pRyrFsGLhDbReEA3FJqBtenCGdivTzEb8kCVvPpUMxGP1jGwuwAxqPZYooAkBK1xku1Uq-J4fZNv09TyBxAotyHYUNfMtTkyXmHdoYwt4dI_6fvUAUqSTWyxm2gyD6cq"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-12">
              <h1 className="font-headline text-5xl font-extrabold text-on-primary tracking-tighter mb-4 leading-tight">
                Experience <br />
                Royal Orchard
              </h1>
              <p className="text-on-primary/90 text-lg max-w-xs leading-relaxed">
                Sign in to access your curated selection of the world's finest tropical harvests.
              </p>
            </div>
            <div className="absolute top-8 left-8 bg-secondary-fixed px-6 py-2 rounded-full flex items-center gap-2">
              <Icon name="local_shipping" className="text-on-secondary-fixed-variant text-lg" />
              <span className="text-on-secondary-fixed-variant text-xs uppercase tracking-widest font-bold">
                Direct from Grove
              </span>
            </div>
          </div>

          <div className="p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10">
              <Link to="/" className="md:hidden mb-6 inline-block">
                <span className="font-headline text-2xl font-extrabold tracking-tighter text-primary">
                  RoyalOrchard
                </span>
              </Link>
              <h2 className="font-headline text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-on-surface-variant">Please enter your details to continue</p>
            </div>
            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-on-surface-variant ml-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@royalorchard.com"
                  className="w-full px-5 py-4 bg-surface-container-low border-0 outline-none focus:ring-2 focus:ring-primary rounded-t-xl"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-on-surface-variant ml-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-5 py-4 bg-surface-container-low border-0 outline-none focus:ring-2 focus:ring-primary rounded-t-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary"
                    aria-label="Toggle password visibility"
                  >
                    <Icon name={showPwd ? "visibility_off" : "visibility"} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-full border-outline-variant text-primary cursor-pointer transition-all duration-300 ease-out hover:scale-110 hover:shadow-[0_0_0_4px_rgba(255,191,0,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low checked:shadow-[0_0_0_4px_rgba(255,191,0,0.18)]"
                  />
                  <span className="text-on-surface-variant group-hover:text-on-surface font-medium">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-primary font-bold hover:underline">
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform"
              >
                Sign In
              </button>
            </form>

            <p className="mt-10 text-center text-on-surface-variant">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Sign Up
              </Link>
            </p>
          </div>
        </ScrollReveal>
      </div>
      <footer className="bg-surface-container-highest flex justify-center items-center px-8 py-12 w-full mt-auto">
        <p className="w-full text-center text-xs uppercase tracking-widest text-outline">
          © 2024 RoyalOrchard. All rights reserved.
        </p>
      </footer>
    </main>
  );
};

export default Login;
