import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import { 
  Mic,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";

const CareerVisualization = () => {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [userName, setUserName] = useState("");
  const [userProfession, setUserProfession] = useState("");
  const [inputCaptured, setInputCaptured] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);

  useEffect(() => {
    // Check if we have selected student data
    const stored = sessionStorage.getItem("selectedStudents");
    if (stored) {
      const students = JSON.parse(stored);
      if (students.length > 0) {
        setStudentData(students[0]);
        setUserName(students[0].name || "");
      }
    }
  }, []);

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

  const handleProceedToAssessment = () => {
    if (!userName) {
      toast.error("Please speak or enter your name");
      return;
    }
    if (!userProfession) {
      toast.error("Please speak or enter your profession");
      return;
    }

    setIsProcessing(true);

    // Store the collected data for the personality test
    const userData = {
      name: userName,
      aim: userProfession,
      age: studentData?.age_group?.split("-")[0] || "16", // Extract age from age_group
      studentId: studentData?.student_id || null,
      photoUrl: studentData?.photo_url || null,
    };

    sessionStorage.setItem("personalityUserData", JSON.stringify(userData));

    // Show processing state then navigate directly to 20 assessments
    setTimeout(() => {
      toast.success("Profile Complete → Starting 20 Assessments");
      navigate("/personality-test");
    }, 1500);
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <Logo size="md" />
        <Link to="/student-info">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </Link>
      </nav>

      <main className="relative z-10 px-6 py-12 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="neon-text">Student</span> Profile Setup
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tell us about yourself to begin the 20-question assessment
          </p>
        </div>

        {/* Student Info Card (if available) */}
        {studentData && (
          <div className="glass-card p-4 mb-8 flex items-center gap-4 animate-fadeIn">
            {studentData.photo_url ? (
              <img
                src={studentData.photo_url}
                alt={studentData.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-primary/30"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center text-2xl">
                👤
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{studentData.name}</h3>
              <p className="text-sm text-muted-foreground">
                {studentData.student_id} • Class {studentData.class}-{studentData.section}
              </p>
            </div>
          </div>
        )}

        {/* Voice Input Section */}
        <div className="glass-card p-8 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
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
              disabled={isProcessing}
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
                disabled={isProcessing}
              />
              <input
                type="text"
                placeholder="Your profession..."
                value={userProfession}
                onChange={(e) => setUserProfession(e.target.value)}
                className="flex-1 h-12 px-4 rounded-lg bg-muted/30 border border-border/50 focus:border-accent focus:outline-none input-glow text-foreground"
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Proceed Button - Goes directly to 20 Assessments */}
          <Button
            variant="hero"
            size="lg"
            className="w-full mt-6"
            onClick={handleProceedToAssessment}
            disabled={!userName || !userProfession || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Profile Complete → Starting 20 Assessments
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Start 20 Assessments
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        </div>

        {/* Flow Indicator */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary">1. Profile</span>
          <ArrowRight size={16} />
          <span className="px-3 py-1 rounded-full bg-muted/30">2. 20 Questions</span>
          <ArrowRight size={16} />
          <span className="px-3 py-1 rounded-full bg-muted/30">3. Results</span>
        </div>
      </main>
    </div>
  );
};

export default CareerVisualization;
