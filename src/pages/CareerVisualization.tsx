import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mic,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Stethoscope,
  Code,
  Palette,
  Scale,
  Calculator,
  Building,
  ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

const ageCategories = [
  { value: "10-14", label: "10-14 years (Middle School)" },
  { value: "15-18", label: "15-18 years (High School)" },
  { value: "19-24", label: "19-24 years (College/University)" },
];

const careerPreviews = [
  {
    id: 1,
    title: "Software Engineer",
    icon: Code,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    description: "Build innovative tech solutions",
    salary: "₹6-25 LPA",
    growth: "High",
  },
  {
    id: 2,
    title: "Doctor / Medical",
    icon: Stethoscope,
    color: "from-red-500/20 to-pink-500/20",
    borderColor: "border-red-500/30",
    description: "Heal and care for patients",
    salary: "₹8-30 LPA",
    growth: "Stable",
  },
  {
    id: 3,
    title: "IAS Officer",
    icon: Building,
    color: "from-amber-500/20 to-orange-500/20",
    borderColor: "border-amber-500/30",
    description: "Serve the nation in administration",
    salary: "₹10-20 LPA",
    growth: "Prestigious",
  },
  {
    id: 4,
    title: "Chartered Accountant",
    icon: Calculator,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    description: "Master the world of finance",
    salary: "₹7-25 LPA",
    growth: "High",
  },
  {
    id: 5,
    title: "Lawyer / Advocate",
    icon: Scale,
    color: "from-purple-500/20 to-violet-500/20",
    borderColor: "border-purple-500/30",
    description: "Fight for justice",
    salary: "₹5-30 LPA",
    growth: "Growing",
  },
  {
    id: 6,
    title: "Creative Designer",
    icon: Palette,
    color: "from-pink-500/20 to-rose-500/20",
    borderColor: "border-pink-500/30",
    description: "Create visual experiences",
    salary: "₹4-15 LPA",
    growth: "Rising",
  },
];

const CareerVisualization = () => {
  const [isListening, setIsListening] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfession, setUserProfession] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [showCareers, setShowCareers] = useState(false);
  const [inputCaptured, setInputCaptured] = useState(false);

  const parseNameAndProfession = (transcript: string): { name: string; profession: string } => {
    const patterns = [
      /my name is (.+?) and (?:i am|i'm) (?:a |an )?(.+)/i,
      /(?:i am|i'm) (.+?) and (?:i am|i'm) (?:a |an )?(.+)/i,
      /(.+?) (?:and )?(?:i am|i'm) (?:a |an )?(.+)/i,
      /(.+?),?\s+(?:a |an )?(.+)/i,
    ];

    for (const pattern of patterns) {
      const match = transcript.match(pattern);
      if (match && match[1] && match[2]) {
        return {
          name: match[1].trim(),
          profession: match[2].trim().replace(/\.$/, ""),
        };
      }
    }

    const words = transcript.split(/\s+/);
    if (words.length >= 2) {
      const midPoint = Math.ceil(words.length / 2);
      return {
        name: words.slice(0, midPoint).join(" "),
        profession: words.slice(midPoint).join(" "),
      };
    }

    return { name: transcript, profession: "" };
  };

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      toast.error("Voice input is not supported in your browser");
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening... Please speak your name and profession");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      const { name, profession } = parseNameAndProfession(transcript);
      
      setUserName(name);
      setUserProfession(profession);
      setInputCaptured(true);
      
      if (profession) {
        toast.success(`Hello ${name}! Your profession: ${profession}`);
      } else {
        toast.warning(`Got your name: ${name}. Please also mention your profession.`);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Could not recognize speech. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleStartAssessment = () => {
    if (!userName) {
      toast.error("Please speak or enter your name");
      return;
    }
    if (!userProfession) {
      toast.error("Please speak or enter your profession");
      return;
    }
    if (!ageCategory) {
      toast.error("Please select your age category");
      return;
    }
    setShowCareers(true);
    toast.success(`Starting assessment for ${userName} - ${userProfession}`);
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Link to="/student-info">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </Link>
          <Link to="/personality-assessment">
            <Button variant="outline" size="sm" className="gap-2">
              <GraduationCap size={18} />
              Take Assessment
            </Button>
          </Link>
        </div>
      </nav>

      <main className="relative z-10 px-6 py-12 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="neon-text">Explore</span> Your Career Path
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tell us about yourself and discover careers that match your potential
          </p>
        </div>

        {/* Voice Input Section */}
        <div className="glass-card p-8 mb-12 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <div className="text-center mb-8">
            {/* Main Prompt Message */}
            <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/30">
              <p className="text-xl font-display font-semibold neon-text">
                Please speak your name and profession
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Example: "My name is Rahul and I am a Software Developer"
              </p>
            </div>

            {/* Captured Info Display */}
            {inputCaptured && (
              <div className="mb-6 p-4 rounded-xl bg-accent/10 border border-accent/30 text-left">
                <p className="text-foreground">
                  <span className="text-muted-foreground">Name:</span>{" "}
                  <span className="font-semibold neon-text">{userName || "Not captured"}</span>
                </p>
                <p className="text-foreground mt-2">
                  <span className="text-muted-foreground">Profession:</span>{" "}
                  <span className="font-semibold neon-text-green">{userProfession || "Not captured"}</span>
                </p>
              </div>
            )}

            {/* Voice Button */}
            <button
              onClick={handleVoiceInput}
              className={`voice-button mx-auto ${isListening ? "listening" : ""}`}
              aria-label="Voice input"
            >
              {isListening ? (
                <Mic size={32} className="text-primary-foreground animate-pulse" />
              ) : (
                <Mic size={32} className="text-primary-foreground" />
              )}
            </button>

            <p className="text-sm text-muted-foreground mt-4">
              {isListening ? "Listening... Speak your name and profession" : "Click to speak"}
            </p>
          </div>

          {/* Manual Input Alternative */}
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">Or enter manually:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Your name..."
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="flex-1 h-12 px-4 rounded-lg bg-muted/30 border border-border/50 focus:border-primary focus:outline-none input-glow text-foreground"
              />
              <input
                type="text"
                placeholder="Your profession..."
                value={userProfession}
                onChange={(e) => setUserProfession(e.target.value)}
                className="flex-1 h-12 px-4 rounded-lg bg-muted/30 border border-border/50 focus:border-accent focus:outline-none input-glow text-foreground"
              />
            </div>
            
            <Select value={ageCategory} onValueChange={setAgeCategory}>
              <SelectTrigger className="w-full h-12 bg-muted/30 border-border/50">
                <SelectValue placeholder="Select age group" />
              </SelectTrigger>
              <SelectContent>
                {ageCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="neon"
            size="lg"
            className="w-full mt-6"
            onClick={handleStartAssessment}
            disabled={!userName || !userProfession}
          >
            <Briefcase size={20} />
            Start Assessment
            <ArrowRight size={20} />
          </Button>
        </div>

        {/* Assessment Section - Based on User's Profession */}
        {showCareers && (
          <div className="animate-fadeIn">
            <div className="glass-card p-6 mb-8 text-center">
              <h2 className="text-2xl font-display font-bold mb-2">
                Assessment for <span className="neon-text">{userName}</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Profession: <span className="neon-text-green font-semibold">{userProfession}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Age Category: {ageCategories.find(c => c.value === ageCategory)?.label}
              </p>
            </div>

            <h2 className="text-2xl font-display font-bold text-center mb-8">
              Career paths related to <span className="neon-text-green">{userProfession}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerPreviews.map((career, index) => (
                <div
                  key={career.id}
                  className="career-card group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${career.color} opacity-50 rounded-xl`} />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${career.color} border ${career.borderColor} mb-4`}>
                      <career.icon size={28} className="text-foreground" />
                    </div>

                    <h3 className="font-display font-semibold text-xl mb-2">
                      {career.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {career.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="badge-neon">{career.salary}</span>
                      <span className="badge-success">{career.growth}</span>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border/30">
                      <Link to="/personality-assessment">
                        <Button variant="ghost" size="sm" className="w-full gap-2 group-hover:text-primary">
                          Take Assessment
                          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CareerVisualization;
