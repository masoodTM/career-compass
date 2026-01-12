import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  Loader2,
  Building,
  Shield
} from "lucide-react";
import { toast } from "sonner";

type LoginType = "institution" | "admin";

const Auth = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState<LoginType>("institution");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (loginType === "institution") {
      toast.success("Institution login successful!");
      navigate("/student-info");
    } else {
      toast.success("Admin login successful!");
      // Admin can go to a different dashboard if needed
      navigate("/student-info");
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6">
      <ParticleBackground />
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="lg" />
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8">
          <h2 className="text-2xl font-display font-bold text-center mb-6">
            Welcome Back
          </h2>

          {/* Login Type Tabs */}
          <div className="flex mb-8 p-1 rounded-lg bg-muted/30">
            <button
              onClick={() => setLoginType("institution")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                loginType === "institution" 
                  ? "bg-primary text-primary-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building size={18} />
              Institution
            </button>
            <button
              onClick={() => setLoginType("admin")}
              className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                loginType === "admin" 
                  ? "bg-accent text-accent-foreground shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield size={18} />
              Admin
            </button>
          </div>

          {/* Login Type Description */}
          <div className="mb-6 p-3 rounded-lg bg-muted/20 border border-border/30">
            <p className="text-sm text-muted-foreground text-center">
              {loginType === "institution" 
                ? "Login as an institution to manage student profiles and assessments"
                : "Login as admin to access the administration dashboard"
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 h-12 bg-muted/30 border-border/50 focus:border-primary input-glow"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12 bg-muted/30 border-border/50 focus:border-primary input-glow"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant={loginType === "institution" ? "neon" : "admin"}
              size="lg"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>
                  {loginType === "institution" ? "Login as Institution" : "Login as Admin"}
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
