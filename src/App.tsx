import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnnualAwards from "./pages/AnnualAwards";
import ArchitectExhibition from "./pages/ArchitectExhibition";
import DesignCompetition from "./pages/DesignCompetition";
import LatestNews from "./pages/LatestNews";
import UpcomingEvents from "./pages/UpcomingEvents";
import PastEvents from "./pages/PastEvents";
import Courses from "./pages/Courses";
import Examinations from "./pages/Examinations";
import BAENotices from "./pages/BAENotices";
import Publications from "./pages/Publications";
import Specifications from "./pages/Specifications";
import Downloads from "./pages/Downloads";
import History from "./pages/History";
import Council from "./pages/Council";
import Objectives from "./pages/Objectives";
import Contact from "./pages/Contact";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/annual-awards" element={<AnnualAwards />} />
          <Route path="/architect-exhibition" element={<ArchitectExhibition />} />
          <Route path="/design-competition" element={<DesignCompetition />} />
          <Route path="/latest-news" element={<LatestNews />} />
          <Route path="/upcoming-events" element={<UpcomingEvents />} />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/examinations" element={<Examinations />} />
          <Route path="/bae-notices" element={<BAENotices />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/specifications" element={<Specifications />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/history" element={<History />} />
          <Route path="/council" element={<Council />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
