// This page now redirects to the new onboarding flow
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PersonalityAssessment = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the new onboarding page
    navigate("/personality-onboarding", { replace: true });
  }, [navigate]);

  return null;
};

export default PersonalityAssessment;
