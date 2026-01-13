import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import { ArrowRight, Home, Sparkles, User } from "lucide-react";
import { Link } from "react-router-dom";

// Avatar mapping based on profession keywords
const getAvatarForProfession = (aim: string): { emoji: string; color: string } => {
  const normalizedAim = aim.toLowerCase();
  
  if (normalizedAim.includes("pilot") || normalizedAim.includes("aviation")) {
    return { emoji: "✈️", color: "from-blue-500 to-cyan-400" };
  }
  if (normalizedAim.includes("doctor") || normalizedAim.includes("medical") || normalizedAim.includes("surgeon")) {
    return { emoji: "🩺", color: "from-red-500 to-pink-400" };
  }
  if (normalizedAim.includes("engineer") || normalizedAim.includes("engineering")) {
    return { emoji: "⚙️", color: "from-orange-500 to-yellow-400" };
  }
  if (normalizedAim.includes("teacher") || normalizedAim.includes("professor") || normalizedAim.includes("educator")) {
    return { emoji: "📚", color: "from-green-500 to-emerald-400" };
  }
  if (normalizedAim.includes("lawyer") || normalizedAim.includes("advocate") || normalizedAim.includes("judge")) {
    return { emoji: "⚖️", color: "from-purple-500 to-violet-400" };
  }
  if (normalizedAim.includes("scientist") || normalizedAim.includes("researcher")) {
    return { emoji: "🔬", color: "from-indigo-500 to-blue-400" };
  }
  if (normalizedAim.includes("artist") || normalizedAim.includes("designer") || normalizedAim.includes("creative")) {
    return { emoji: "🎨", color: "from-pink-500 to-rose-400" };
  }
  if (normalizedAim.includes("business") || normalizedAim.includes("entrepreneur") || normalizedAim.includes("ceo")) {
    return { emoji: "💼", color: "from-amber-500 to-orange-400" };
  }
  if (normalizedAim.includes("police") || normalizedAim.includes("ips") || normalizedAim.includes("ias")) {
    return { emoji: "🛡️", color: "from-slate-500 to-gray-400" };
  }
  if (normalizedAim.includes("chef") || normalizedAim.includes("cook")) {
    return { emoji: "👨‍🍳", color: "from-red-500 to-orange-400" };
  }
  if (normalizedAim.includes("athlete") || normalizedAim.includes("sport") || normalizedAim.includes("player")) {
    return { emoji: "🏆", color: "from-yellow-500 to-amber-400" };
  }
  if (normalizedAim.includes("astronaut") || normalizedAim.includes("space")) {
    return { emoji: "🚀", color: "from-violet-500 to-purple-400" };
  }
  if (normalizedAim.includes("army") || normalizedAim.includes("military") || normalizedAim.includes("soldier")) {
    return { emoji: "🎖️", color: "from-green-600 to-emerald-500" };
  }
  if (normalizedAim.includes("nurse") || normalizedAim.includes("healthcare")) {
    return { emoji: "💉", color: "from-teal-500 to-cyan-400" };
  }
  if (normalizedAim.includes("architect")) {
    return { emoji: "🏛️", color: "from-stone-500 to-zinc-400" };
  }
  if (normalizedAim.includes("musician") || normalizedAim.includes("singer") || normalizedAim.includes("music")) {
    return { emoji: "🎵", color: "from-fuchsia-500 to-pink-400" };
  }
  if (normalizedAim.includes("actor") || normalizedAim.includes("actress") || normalizedAim.includes("film")) {
    return { emoji: "🎬", color: "from-red-600 to-rose-500" };
  }
  if (normalizedAim.includes("journalist") || normalizedAim.includes("writer") || normalizedAim.includes("author")) {
    return { emoji: "✍️", color: "from-cyan-500 to-teal-400" };
  }
  if (normalizedAim.includes("programmer") || normalizedAim.includes("developer") || normalizedAim.includes("software") || normalizedAim.includes("coder")) {
    return { emoji: "💻", color: "from-emerald-500 to-green-400" };
  }
  if (normalizedAim.includes("accountant") || normalizedAim.includes("ca") || normalizedAim.includes("finance")) {
    return { emoji: "📊", color: "from-blue-600 to-indigo-500" };
  }
  
  // Default
  return { emoji: "⭐", color: "from-primary to-secondary" };
};

const PersonalityAvatar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ name: string; age: string; aim: string } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("personalityUserData");
    if (!stored) {
      navigate("/personality-assessment");
      return;
    }
    setUserData(JSON.parse(stored));
  }, [navigate]);

  if (!userData) return null;

  const avatar = getAvatarForProfession(userData.aim);

  const handleBeginTest = () => {
    navigate("/personality-test");
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
              <div className="w-10 h-2 rounded-full bg-primary/50" />
              <div className="w-10 h-2 rounded-full bg-primary" />
              <div className="w-10 h-2 rounded-full bg-muted" />
              <div className="w-10 h-2 rounded-full bg-muted" />
            </div>

            {/* Avatar Display */}
            <div className="relative mb-8">
              <div className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center float pulse-glow`}>
                <span className="text-7xl">{avatar.emoji}</span>
              </div>
              
              {/* Decorative rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-primary/30 animate-pulse" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-56 h-56 rounded-full border border-primary/20" />
              </div>
            </div>

            <h1 className="text-2xl lg:text-3xl font-display font-bold mb-4">
              Meet your future self,{" "}
              <span className="neon-text">{userData.name}!</span>
            </h1>
            
            <p className="text-muted-foreground mb-2">
              Your dream career:{" "}
              <span className="text-secondary font-semibold">{userData.aim}</span>
            </p>
            
            <p className="text-sm text-muted-foreground mb-8">
              Let's discover your personality traits to see how well you match this career path.
            </p>

            <Button variant="hero" size="xl" onClick={handleBeginTest} className="w-full">
              <Sparkles size={20} />
              Begin Personality Test
              <ArrowRight size={20} />
            </Button>

            <p className="text-sm text-muted-foreground mt-6">
              ⏱️ Takes about 5 minutes • 20 questions
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalityAvatar;
