import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Clients from "./pages/Clients";
import Conversations from "./pages/Conversations";
import MealPlans from "./pages/MealPlans";
import Workouts from "./pages/Workouts";
import Support from "./pages/Support";
import AIChat from "./pages/AIChat";
import ProgressTracking from "./pages/ProgressTracking";
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
          <Route path="/clients" element={<Clients />} />
          <Route path="/conversations" element={<Conversations />} />
          <Route path="/meal-plans" element={<MealPlans />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/progress" element={<ProgressTracking />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/support" element={<Support />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

