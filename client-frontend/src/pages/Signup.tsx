import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { toast } from "sonner";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/store/auth";

const schema = z
  .object({
    name: z.string().trim().min(2, "Enter your name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    address: z.string().trim().min(10, "Enter a full delivery address").max(500),
    password: z.string().min(6, "Password must be at least 6 characters").max(100),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", address: "", password: "", confirm: "" });
  const signUp = useAuth((s) => s.signUp);
  const updateProfile = useAuth((s) => s.updateProfile);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    (async () => {
      const res = await signUp(form.name, form.email, form.password);
      if (!res.ok) {
        toast.error(res.error || "Unable to create account");
        return;
      }
      await updateProfile({ address: form.address });
      toast.success("Welcome to Royal Orchard!");
      navigate(from && !from.startsWith("/login") && !from.startsWith("/signup") ? from : "/");
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

        <div className="w-full max-w-[1100px] grid md:grid-cols-2 bg-surface-container-lowest rounded-lg shadow-2xl shadow-primary/5 overflow-hidden border border-outline-variant/10">
          <div className="hidden md:block relative overflow-hidden group">
            <img
              alt="Royal Orchard"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwDcnMbx1Di2ICXNn8HE6QK13isEFc6pCbVRIoWHzKS8l8oXwOZhgzsp7cb_nax2Kqiuco-sSds98XnRsK24S2xcgx_9TsdjWfG_NcVxNlSyjpBQJQxVmjUnQJ-ss1G6mBJ3OxfvLT7X44pRyrFsGLhDbReEA3FJqBtenCGdivTzEb8kCVvPpUMxGP1jGwuwAxqPZYooAkBK1xku1Uq-J4fZNv09TyBxAotyHYUNfMtTkyXmHdoYwt4dI_6fvUAUqSTWyxm2gyD6cq"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent flex flex-col justify-end p-12">
              <h1 className="font-headline text-5xl font-extrabold text-on-primary tracking-tighter mb-4 leading-tight">
                Experience <br />
                Royal Orchard
              </h1>
              <p className="text-on-primary/90 text-lg max-w-xs leading-relaxed">
                Sign up to access your curated selection of the world's finest tropical harvests.
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
            <div className="mb-8">
              <Link to="/" className="md:hidden mb-6 inline-block">
                <span className="font-headline text-2xl font-extrabold tracking-tighter text-primary">
                  RoyalOrchard
                </span>
              </Link>
              <h2 className="font-headline text-3xl font-bold mb-2">Create Account</h2>
              <p className="text-on-surface-variant">Join Royal Orchard for a premium orchard experience.</p>
            </div>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-5 py-3.5 bg-surface-container-low outline-none focus:ring-2 focus:ring-primary rounded-t-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="hello@royalorchard.com"
                  className="w-full px-5 py-3.5 bg-surface-container-low outline-none focus:ring-2 focus:ring-primary rounded-t-xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-on-surface-variant ml-1">Delivery Address</label>
                <textarea
                  rows={2}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="House, street, area, city"
                  className="w-full px-5 py-3.5 bg-surface-container-low outline-none focus:ring-2 focus:ring-primary rounded-t-xl resize-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 bg-surface-container-low outline-none focus:ring-2 focus:ring-primary rounded-t-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1">Confirm</label>
                  <input
                    type="password"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-5 py-3.5 bg-surface-container-low outline-none focus:ring-2 focus:ring-primary rounded-t-xl"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full editorial-gradient text-on-primary font-headline font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform mt-4"
              >
                Create Account
              </button>
            </form>

            <p className="mt-8 text-center text-on-surface-variant">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4">
                Log In
              </Link>
            </p>
          </div>
        </div>
      </div>
      <footer className="bg-surface-container-highest flex flex-col md:flex-row justify-between items-center px-8 py-12 w-full mt-auto">
        <span className="text-xs uppercase tracking-widest text-outline mb-4 md:mb-0">
          © 2024 ROYAL ORCHARD. ALL RIGHTS RESERVED.
        </span>
        <div className="flex gap-8">
          <a href="#" className="text-xs uppercase tracking-widest text-outline hover:text-primary">PRIVACY</a>
          <a href="#" className="text-xs uppercase tracking-widest text-outline hover:text-primary">TERMS</a>
          <a href="#" className="text-xs uppercase tracking-widest text-outline hover:text-primary">SUPPORT</a>
        </div>
      </footer>
    </main>
  );
};

export default Signup;
