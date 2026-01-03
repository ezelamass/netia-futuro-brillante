import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <ErrorState
        variant="not-found"
        onGoHome={() => navigate('/')}
      />
    </div>
  );
};

export default NotFound;
