import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import { Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getRandomQuestions, PersonalityQuestion } from "@/data/personalityQuestions";
import { toast } from "sonner";

const PersonalityTest = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedValue, setSelectedValue] = useState<number | null>(null);

  // Generate random 20 questions once on mount
  const questions = useMemo(() => getRandomQuestions(), []);

  useEffect(() => {
    const stored = sessionStorage.getItem("personalityUserData");
    if (!stored) {
      navigate("/personality-assessment");
    }
  }, [navigate]);

  const handleSelectAnswer = (value: number) => {
    setSelectedValue(value);
  };

  const handleNext = () => {
    if (selectedValue === null) {
      toast.error("Please select an answer");
      return;
    }

    const newAnswers = { ...answers, [questions[currentQuestion].id]: selectedValue };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedValue(null);
    } else {
      // Calculate and store results
      calculateAndStoreResults(newAnswers, questions);
    }
  };

  const calculateAndStoreResults = (
    allAnswers: Record<number, number>,
    allQuestions: PersonalityQuestion[]
  ) => {
    // Calculate trait scores
    const traitScores: Record<string, { total: number; count: number }> = {};
    
    allQuestions.forEach((q) => {
      const score = allAnswers[q.id] || 0;
      if (!traitScores[q.trait]) {
        traitScores[q.trait] = { total: 0, count: 0 };
      }
      traitScores[q.trait].total += score;
      traitScores[q.trait].count += 1;
    });

    // Calculate averages and find dominant traits
    const traitAverages: Record<string, number> = {};
    Object.entries(traitScores).forEach(([trait, { total, count }]) => {
      traitAverages[trait] = Math.round((total / count) * 20); // Convert to percentage
    });

    // Sort traits by score
    const sortedTraits = Object.entries(traitAverages)
      .sort((a, b) => b[1] - a[1]);

    // Get top trait
    const dominantTrait = sortedTraits[0]?.[0] || "Analytical";
    const totalScore = Object.values(allAnswers).reduce((sum, v) => sum + v, 0);
    const maxPossibleScore = 20 * 5; // 20 questions, max 5 each
    const overallPercentage = Math.round((totalScore / maxPossibleScore) * 100);

    // Store results
    const results = {
      dominantTrait,
      traitScores: traitAverages,
      sortedTraits,
      totalScore,
      overallPercentage,
      answers: allAnswers,
    };
    
    sessionStorage.setItem("personalityResults", JSON.stringify(results));
    navigate("/personality-results");
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const scaleLabels = [
    { value: 1, label: "Strongly Disagree" },
    { value: 2, label: "Disagree" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Agree" },
    { value: 5, label: "Strongly Agree" },
  ];

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

      <main className="relative z-10 px-6 py-8 max-w-2xl mx-auto">
        <div className="animate-fadeIn">
          {/* Step Indicator */}
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-10 h-2 rounded-full bg-primary/50" />
            <div className="w-10 h-2 rounded-full bg-primary/50" />
            <div className="w-10 h-2 rounded-full bg-primary" />
            <div className="w-10 h-2 rounded-full bg-muted" />
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="progress-neon">
              <div
                className="progress-neon-bar"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="glass-card p-8">
            <div className="mb-2 text-sm text-muted-foreground">
              Trait: <span className="text-primary font-medium">{currentQ?.trait}</span>
            </div>
            
            <h2 className="text-xl lg:text-2xl font-display font-semibold mb-8 text-center">
              {currentQ?.question}
            </h2>

            {/* Radio Scale */}
            <div className="space-y-4">
              {scaleLabels.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelectAnswer(option.value)}
                  className={`w-full p-4 text-left rounded-xl glass-card-hover border transition-all group ${
                    selectedValue === option.value
                      ? "border-primary bg-primary/10"
                      : "border-border/30 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedValue === option.value
                          ? "border-primary bg-primary"
                          : "border-muted-foreground group-hover:border-primary"
                      }`}
                    >
                      {selectedValue === option.value && (
                        <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`font-medium ${
                          selectedValue === option.value
                            ? "text-primary"
                            : "text-foreground group-hover:text-primary"
                        }`}
                      >
                        {option.value} - {option.label}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button
              variant="hero"
              size="xl"
              onClick={handleNext}
              className="w-full mt-8"
              disabled={selectedValue === null}
            >
              {currentQuestion < questions.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight size={20} />
                </>
              ) : (
                <>
                  View Results
                  <ArrowRight size={20} />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalityTest;
