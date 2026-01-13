import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import { ArrowRight, Home, User, Calendar, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const PersonalityOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    aim: "",
  });

  const handleNext = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.age || parseInt(formData.age) < 5 || parseInt(formData.age) > 100) {
      toast.error("Please enter a valid age (5-100)");
      return;
    }
    if (!formData.aim.trim()) {
      toast.error("Please enter your career goal/aim");
      return;
    }

    // Store data in sessionStorage for the flow
    sessionStorage.setItem("personalityUserData", JSON.stringify(formData));
    navigate("/personality-avatar");
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <Logo size="md" />
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <Home size={18} />
            <span className="hidden sm:inline">Home</span>
          </Button>
        </Link>
      </nav>

      <main className="relative z-10 px-6 py-12 max-w-xl mx-auto">
        <div className="text-center animate-fadeIn">
          <div className="glass-card p-8 lg:p-12">
            {/* Step Indicator */}
            <div className="flex justify-center gap-2 mb-8">
              <div className="w-10 h-2 rounded-full bg-primary" />
              <div className="w-10 h-2 rounded-full bg-muted" />
              <div className="w-10 h-2 rounded-full bg-muted" />
              <div className="w-10 h-2 rounded-full bg-muted" />
            </div>

            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 mb-6">
              <User size={40} className="text-primary" />
            </div>

            <h1 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              <span className="neon-text">Tell Us</span> About You
            </h1>
            <p className="text-muted-foreground mb-8">
              Let's start by getting to know you better
            </p>

            <div className="space-y-6 text-left">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
                  <User size={16} className="text-primary" />
                  Your Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 input-glow"
                />
              </div>

              {/* Age Field */}
              <div className="space-y-2">
                <Label htmlFor="age" className="flex items-center gap-2 text-foreground">
                  <Calendar size={16} className="text-primary" />
                  Your Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  min="5"
                  max="100"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 input-glow"
                />
              </div>

              {/* Aim/Career Goal Field */}
              <div className="space-y-2">
                <Label htmlFor="aim" className="flex items-center gap-2 text-foreground">
                  <Target size={16} className="text-primary" />
                  Career Goal / Aim
                </Label>
                <Input
                  id="aim"
                  type="text"
                  placeholder="e.g., Pilot, Doctor, Engineer, Teacher"
                  value={formData.aim}
                  onChange={(e) => setFormData({ ...formData, aim: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 input-glow"
                />
              </div>
            </div>

            <Button variant="hero" size="xl" onClick={handleNext} className="mt-8 w-full">
              Next
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalityOnboarding;
