import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import { Home, RefreshCw, CheckCircle, TrendingUp, AlertCircle, Lightbulb, MapPin, Quote, Download } from "lucide-react";
import { traitProfiles, getMotivationalQuote } from "@/data/personalityQuestions";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface UserData {
  name: string;
  age: string;
  aim: string;
}

interface Results {
  dominantTrait: string;
  traitScores: Record<string, number>;
  sortedTraits: [string, number][];
  totalScore: number;
  overallPercentage: number;
}

// Profession image mapping - returns image path based on profession
const getProfessionImage = (aim: string): string => {
  const normalizedAim = aim.toLowerCase();
  
  if (normalizedAim.includes("pilot") || normalizedAim.includes("aviation")) {
    return "/profession-images/pilot.png";
  }
  if (normalizedAim.includes("doctor") || normalizedAim.includes("medical") || normalizedAim.includes("surgeon")) {
    return "/profession-images/doctor.png";
  }
  if (normalizedAim.includes("engineer") || normalizedAim.includes("engineering")) {
    return "/profession-images/engineer.png";
  }
  if (normalizedAim.includes("teacher") || normalizedAim.includes("professor")) {
    return "/profession-images/teacher.png";
  }
  if (normalizedAim.includes("lawyer") || normalizedAim.includes("advocate")) {
    return "/profession-images/lawyer.png";
  }
  if (normalizedAim.includes("scientist") || normalizedAim.includes("researcher")) {
    return "/profession-images/scientist.png";
  }
  if (normalizedAim.includes("artist") || normalizedAim.includes("designer")) {
    return "/profession-images/artist.png";
  }
  if (normalizedAim.includes("business") || normalizedAim.includes("entrepreneur")) {
    return "/profession-images/business.png";
  }
  if (normalizedAim.includes("police") || normalizedAim.includes("ips") || normalizedAim.includes("ias")) {
    return "/profession-images/police.png";
  }
  if (normalizedAim.includes("programmer") || normalizedAim.includes("developer") || normalizedAim.includes("software")) {
    return "/profession-images/programmer.png";
  }
  
  return "/profession-images/default.png";
};

// Avatar mapping (same as PersonalityAvatar)
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
  if (normalizedAim.includes("teacher") || normalizedAim.includes("professor")) {
    return { emoji: "📚", color: "from-green-500 to-emerald-400" };
  }
  if (normalizedAim.includes("lawyer") || normalizedAim.includes("advocate")) {
    return { emoji: "⚖️", color: "from-purple-500 to-violet-400" };
  }
  if (normalizedAim.includes("scientist") || normalizedAim.includes("researcher")) {
    return { emoji: "🔬", color: "from-indigo-500 to-blue-400" };
  }
  if (normalizedAim.includes("artist") || normalizedAim.includes("designer")) {
    return { emoji: "🎨", color: "from-pink-500 to-rose-400" };
  }
  if (normalizedAim.includes("business") || normalizedAim.includes("entrepreneur")) {
    return { emoji: "💼", color: "from-amber-500 to-orange-400" };
  }
  if (normalizedAim.includes("police") || normalizedAim.includes("ips") || normalizedAim.includes("ias")) {
    return { emoji: "🛡️", color: "from-slate-500 to-gray-400" };
  }
  if (normalizedAim.includes("programmer") || normalizedAim.includes("developer") || normalizedAim.includes("software")) {
    return { emoji: "💻", color: "from-emerald-500 to-green-400" };
  }
  
  return { emoji: "⭐", color: "from-primary to-secondary" };
};

// Roadmap based on profession
const getRoadmap = (aim: string): string[] => {
  const normalizedAim = aim.toLowerCase();
  
  if (normalizedAim.includes("doctor") || normalizedAim.includes("medical")) {
    return [
      "Complete 10+2 with Physics, Chemistry, Biology",
      "Prepare for and clear NEET examination",
      "Complete MBBS (5.5 years including internship)",
      "Choose specialization and pursue MD/MS",
      "Register with Medical Council of India",
    ];
  }
  if (normalizedAim.includes("engineer")) {
    return [
      "Complete 10+2 with Physics, Chemistry, Mathematics",
      "Prepare for JEE Main/Advanced or state engineering exams",
      "Complete B.Tech/B.E. in your chosen branch",
      "Gain practical experience through internships",
      "Consider M.Tech or professional certifications",
    ];
  }
  if (normalizedAim.includes("pilot")) {
    return [
      "Complete 10+2 with Physics and Mathematics",
      "Pass medical fitness test (Class 1 Medical)",
      "Enroll in DGCA approved flying school",
      "Obtain Commercial Pilot License (CPL)",
      "Build flying hours and apply to airlines",
    ];
  }
  if (normalizedAim.includes("lawyer") || normalizedAim.includes("advocate")) {
    return [
      "Complete 10+2 in any stream",
      "Prepare for CLAT or other law entrance exams",
      "Complete LLB degree (3 or 5 years)",
      "Clear All India Bar Examination",
      "Register with Bar Council and start practice",
    ];
  }
  if (normalizedAim.includes("teacher") || normalizedAim.includes("professor")) {
    return [
      "Complete graduation in your subject area",
      "Pursue B.Ed or M.Ed for teaching certification",
      "Clear CTET/TET for school teaching",
      "For college teaching, complete PhD and clear NET/SET",
      "Gain experience and develop teaching portfolio",
    ];
  }
  if (normalizedAim.includes("ias") || normalizedAim.includes("civil service")) {
    return [
      "Complete graduation in any discipline",
      "Start preparation from final year of graduation",
      "Clear UPSC Prelims examination",
      "Clear UPSC Mains examination",
      "Pass the Interview/Personality Test",
    ];
  }
  
  // Default roadmap
  return [
    "Research and understand your chosen career path",
    "Identify required qualifications and skills",
    "Pursue relevant education and certifications",
    "Gain practical experience through internships",
    "Build network and continuously upgrade skills",
  ];
};

const PersonalityResults = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [results, setResults] = useState<Results | null>(null);
  const [quote, setQuote] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("personalityUserData");
    const storedResults = sessionStorage.getItem("personalityResults");
    
    if (!storedUser || !storedResults) {
      navigate("/personality-assessment");
      return;
    }
    
    const user = JSON.parse(storedUser);
    const res = JSON.parse(storedResults);
    
    setUserData(user);
    setResults(res);
    setQuote(getMotivationalQuote(user.aim));
  }, [navigate]);

  if (!userData || !results) return null;

  const avatar = getAvatarForProfession(userData.aim);
  const professionImage = getProfessionImage(userData.aim);
  const traitProfile = traitProfiles[results.dominantTrait] || traitProfiles["Analytical"];
  const roadmap = getRoadmap(userData.aim);

  const handleTakeAgain = () => {
    sessionStorage.removeItem("personalityUserData");
    sessionStorage.removeItem("personalityResults");
    navigate("/personality-assessment");
  };

  const handleDownloadProfile = async () => {
    if (!profileRef.current) return;
    
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(profileRef.current, {
        scale: 2,
        backgroundColor: '#0a0a0f',
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`${userData.name.replace(/\s+/g, '_')}_Career_Profile.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen relative pb-12">
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

      <main className="relative z-10 px-6 py-8 max-w-4xl mx-auto">
        <div ref={profileRef} className="animate-fadeIn">
          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-8">
            <div className="w-10 h-2 rounded-full bg-primary" />
            <div className="w-10 h-2 rounded-full bg-primary" />
            <div className="w-10 h-2 rounded-full bg-primary" />
            <div className="w-10 h-2 rounded-full bg-secondary" />
          </div>

          {/* Summary Header with Profession Image */}
          <div className="glass-card p-8 text-center mb-8">
            <div className="flex flex-col items-center gap-6">
              {/* Profession Image */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden neon-border">
                <img 
                  src={professionImage} 
                  alt={`${userData.aim} profession`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${avatar.color} opacity-20`} />
              </div>
              
              {/* Summary Sentence */}
              <h1 className="text-2xl lg:text-3xl font-display font-bold">
                I am <span className="neon-text">{userData.name}</span> and I want to become a{" "}
                <span className="neon-text-green">{userData.aim}</span>
              </h1>
            </div>
          </div>

          {/* Main Results Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Personality Score */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <TrendingUp className="text-primary" size={20} />
                </div>
                <h3 className="text-lg font-display font-semibold">Personality Score</h3>
              </div>
              
              <div className="text-center mb-4">
                <div className="text-5xl font-display font-bold neon-text mb-2">
                  {results.overallPercentage}%
                </div>
                <p className="text-muted-foreground">Overall Assessment Score</p>
              </div>

              <div className="space-y-3">
                {results.sortedTraits.slice(0, 4).map(([trait, score]) => (
                  <div key={trait}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground">{trait}</span>
                      <span className="text-primary">{score}%</span>
                    </div>
                    <div className="progress-neon h-2">
                      <div
                        className="progress-neon-bar"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Aspiration */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <CheckCircle className="text-secondary" size={20} />
                </div>
                <h3 className="text-lg font-display font-semibold">Recommended Aspiration</h3>
              </div>
              
              <div className="text-center mb-4">
                <div className="inline-block px-6 py-3 rounded-full glass-card neon-border mb-4">
                  <span className="text-2xl font-display font-bold neon-text">
                    {results.dominantTrait}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {traitProfile.description}
                </p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Suggested Careers:</p>
                <div className="flex flex-wrap gap-2">
                  {traitProfile.careers.slice(0, 4).map((career) => (
                    <span key={career} className="badge-success">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Roadmap Section */}
          <div className="glass-card p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <MapPin className="text-primary" size={20} />
              </div>
              <h3 className="text-lg font-display font-semibold">
                How to Work on My Dream: {userData.aim}
              </h3>
            </div>
            
            <div className="relative">
              {roadmap.map((step, index) => (
                <div key={index} className="flex gap-4 mb-6 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    {index < roadmap.length - 1 && (
                      <div className="w-0.5 h-full bg-primary/30 mt-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p className="text-foreground">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Strengths */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <CheckCircle className="text-secondary" size={20} />
                </div>
                <h3 className="text-lg font-display font-semibold text-secondary">Strengths</h3>
              </div>
              <ul className="space-y-3">
                {traitProfile.strengths.map((strength, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="text-foreground">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                  <AlertCircle className="text-destructive" size={20} />
                </div>
                <h3 className="text-lg font-display font-semibold text-destructive">Areas to Improve</h3>
              </div>
              <ul className="space-y-3">
                {traitProfile.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-foreground">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Motivational Quote */}
          <div className="glass-card p-6 mb-8 neon-border">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Quote className="text-accent" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-display font-semibold mb-3">Inspiration for You</h3>
                <blockquote className="text-lg italic text-muted-foreground border-l-2 border-primary pl-4">
                  "{quote}"
                </blockquote>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/career-visualization">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Lightbulb size={18} />
                Explore More Careers
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={handleDownloadProfile} 
              disabled={isDownloading}
              className="gap-2"
            >
              <Download size={18} />
              {isDownloading ? 'Generating PDF...' : 'Download My Profile'}
            </Button>
            <Button variant="neon" onClick={handleTakeAgain} className="gap-2">
              <RefreshCw size={18} />
              Take Assessment Again
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalityResults;
