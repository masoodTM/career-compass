import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Auth from "./pages/Auth";
import StudentInfo from "./pages/StudentInfo";
import CareerVisualization from "./pages/CareerVisualization";
import PersonalityAssessment from "./pages/PersonalityAssessment";
import PersonalityOnboarding from "./pages/PersonalityOnboarding";
import PersonalityAvatar from "./pages/PersonalityAvatar";
import PersonalityTest from "./pages/PersonalityTest";
import PersonalityResults from "./pages/PersonalityResults";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-center" theme="dark" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/student-info" element={<StudentInfo />} />
          <Route path="/career-visualization" element={<CareerVisualization />} />
          <Route path="/personality-assessment" element={<PersonalityAssessment />} />
          <Route path="/personality-onboarding" element={<PersonalityOnboarding />} />
          <Route path="/personality-avatar" element={<PersonalityAvatar />} />
          <Route path="/personality-test" element={<PersonalityTest />} />
          <Route path="/personality-results" element={<PersonalityResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
