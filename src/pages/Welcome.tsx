import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import { ArrowRight, Sparkles, Brain, Target, Mic } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden">
      <ParticleBackground />
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-fadeIn">
          <Logo size="lg" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm mb-8 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <Sparkles size={16} className="text-primary" />
          <span className="text-muted-foreground">
            AI-Powered Career Guidance for Indian Students
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <span className="text-foreground">Discover Your</span>
          <br />
          <span className="neon-text">Perfect Career</span>
          <br />
          <span className="text-foreground">Path</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          CareerViz helps you explore career options through intelligent personality assessments, 
          voice-powered interactions, and AI-driven recommendations tailored specifically for Indian students.
        </p>

        {/* Features Preview */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mic size={20} className="text-primary" />
            <span>Voice Input</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain size={20} className="text-primary" />
            <span>Personality Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target size={20} className="text-primary" />
            <span>Career Matching</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.5s" }}>
          <Link to="/auth">
            <Button variant="hero" size="xl" className="gap-3 group">
              Login / Get Started
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-sm text-muted-foreground animate-fadeIn" style={{ animationDelay: "0.6s" }}>
          <p>© 2024 CareerViz. Empowering Indian Students to Dream Big.</p>
        </footer>
      </main>
    </div>
  );
};

export default Welcome;
