import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/lib/stores/auth-store";
import { LoaderCircle } from "lucide-react";

export function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      navigate("/auth/login?error=google_failed");
      return;
    }

    if (token) {
      checkAuth().then(() => {
        navigate("/account");
      });
    } else {
      navigate("/auth/login");
    }
  }, [searchParams, checkAuth, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <LoaderCircle className="h-8 w-8 animate-spin mx-auto text-[color:var(--color-brand-primary)]" />
        <p className="text-sm text-[color:var(--color-text-secondary)]">
          Signing you in with Google...
        </p>
      </div>
    </div>
  );
}
