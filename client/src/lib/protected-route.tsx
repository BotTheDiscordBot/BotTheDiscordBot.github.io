import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : user ? (
        <Component />
      ) : (
        <Redirect to="/auth" />
      )}
    </Route>
  );
}