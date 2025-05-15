import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import LandingPage from "@/pages/landing-page";
import AuthPage from "@/pages/auth-page";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <ProtectedRoute path="/dashboard" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <div className="bg-black text-white font-sans min-h-screen flex flex-col">
          <Router />
          <Toaster />
        </div>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
