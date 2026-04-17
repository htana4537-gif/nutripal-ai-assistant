import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Support from "./pages/Support";
import AIChat from "./pages/AIChat";
import ProgressTracking from "./pages/ProgressTracking";
import Onboarding from "./pages/Onboarding";
import NutritionHub from "./pages/NutritionHub";
import FoodDetails from "./pages/FoodDetails";
import FitnessHub from "./pages/FitnessHub";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/nutrition" element={<NutritionHub />} />
          <Route path="/nutrition/:id" element={<FoodDetails />} />
          <Route path="/fitness" element={<FitnessHub />} />
          {/* Redirects from removed/merged routes */}
          <Route path="/clients" element={<Navigate to="/" replace />} />
          <Route path="/conversations" element={<Navigate to="/" replace />} />
          <Route path="/meal-plans" element={<Navigate to="/nutrition" replace />} />
          <Route path="/workouts" element={<Navigate to="/fitness" replace />} />
          <Route path="/progress" element={<ProgressTracking />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/support" element={<Support />} />
          <Route path="/store" element={<Store />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
