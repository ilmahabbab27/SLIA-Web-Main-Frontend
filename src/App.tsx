import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import SplashScreen from "./components/SplashScreen";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnnualAwards from "./pages/AnnualAwards";
import ArchitectExhibition from "./pages/ArchitectExhibition";
import DesignCompetition from "./pages/DesignCompetition";
import FindAnArchitect from "./pages/FindAnArchitect";
import MemberPortal from "./pages/MemberPortal";
import ArchitectPractices from "./pages/ArchitectPractices";
import WhyBeAnArchitect from "./pages/WhyBeAnArchitect";
import LatestNews from "./pages/LatestNews";
import UpcomingEvents from "./pages/UpcomingEvents";
import PastEvents from "./pages/PastEvents";
import Events from "./pages/Events";
import EventsCalander from "./pages/EventsCalander";
import LineArtReview from "./pages/LineArtReview";
import EventDetail from "./pages/EventDetail";
import SliaAnnualSessions from "./pages/SliaAnnualSessions";
import Courses from "./pages/Courses";
import Examinations from "./pages/Examinations";
import Publications from "./pages/Publications";
import Specifications from "./pages/Specifications";
import History from "./pages/History";
import Council from "./pages/about/Council";
import Objectives from "./pages/Objectives";
import Contact from "./pages/Contact";
import Complaints from "./pages/Complaints";
import About from "./pages/about/About";
import BoardOfTrustees from "./pages/about/BoardOfTrustees";
import BoardOfManagementAbout from "./pages/about/BoardOfManagement";
import BoardOfManagement from "./pages/boards/BoardOfManagement.tsx";
import BoardOfArchitecturalEducationAbout from "./pages/about/BoardOfArchitecturalEducation";
import BoardOfArchitecturalEducation from "./pages/boards/BoardOfArchitecturalEducation.tsx";
import BaeStudentMembers from "./pages/boards/BaeStudentMembers";
import BaeGraduateMembers from "./pages/boards/BaeGraduateMembers";
import BaeAssociateMembers from "./pages/boards/BaeAssociateMembers";
import ProfessionalAffairsBoard from "./pages/boards/ProfessionalAffairsBoard.tsx";
import ProfessionalAffairsBoardAbout from "./pages/about/ProfessionalAffairsBoard";
import BoardOfArchitecturalPublications, {
  BoardOfArchitecturalPublicationsView,
} from "./pages/about/BoardOfArchitecturalPublications";
import BoardOfArchitecturalPublicationsBoards from "./pages/boards/BoardOfArchitecturalPublications";
import Boards from "./pages/Boards";
import AdminLayout from "./components/admin/AdminLayout";
import RequireAdminAuth from "./components/admin/RequireAdminAuth";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import HeroManager from "./pages/admin/HeroManager";
import EventManager from "./pages/admin/EventManager";
import AnnualEventsManager from "./pages/admin/AnnualEventsManager";
import BoardManager from "./pages/admin/BoardManager";
import BoardMembersManager from "./pages/admin/BoardMembersManager";
import CouncilManager from "./pages/admin/CouncilManager";
import ContactManager from "./pages/admin/ContactManager";
import FAQManager from "./pages/admin/FAQManager";
import TickerManager from "./pages/admin/TickerManager";
import ContentManager from "./pages/admin/ContentManager";
import AdminUsersManager from "./pages/admin/AdminUsersManager";
import SliaAwards from "./pages/SliaAwards";
import AwardCategoriesManager from "./pages/admin/AwardCategoriesManager";
import BapManager from "./pages/admin/BapManager";
import BomManager from "./pages/admin/BomManager";
import BaeManager from "./pages/admin/BaeManager";
import PabManager from "./pages/admin/PabManager";
import SliaManager from "./pages/admin/SliaManager";
import ComplaintsManager from "./pages/admin/ComplaintsManager";
import FloatingChatbot from "./components/FloatingChatbot";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/annual-awards" element={<AnnualAwards />} />
          <Route path="/architect-exhibition" element={<ArchitectExhibition />} />
          <Route path="/design-competition" element={<DesignCompetition />} />
          <Route path="/find-an-architect" element={<FindAnArchitect />} />
          <Route path="/member-portal" element={<MemberPortal />} />
          <Route path="/architect-practices" element={<ArchitectPractices />} />
          <Route path="/why-be-an-architect" element={<WhyBeAnArchitect />} />
          <Route path="/latest-news" element={<LatestNews />} />
          <Route path="/events" element={<Events />} />
          <Route path="/eventscalander" element={<EventsCalander />} />
          <Route path="/line-art-review" element={<LineArtReview />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/slia-annual-sessions" element={<SliaAnnualSessions />} />
          <Route path="/upcoming-events" element={<UpcomingEvents />} />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/examinations" element={<Examinations />} />
          <Route path="/bae-notices" element={<Navigate to="/bae?section=notices#bae-documents" replace />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/specifications" element={<Specifications />} />
          <Route path="/downloads" element={<Navigate to="/bae#bae-documents" replace />} />
          <Route path="/history" element={<History />} />
          <Route path="/council" element={<Council />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<RequireAdminAuth />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="hero" element={<HeroManager />} />
              <Route path="events" element={<EventManager />} />
              <Route path="annual-events" element={<AnnualEventsManager />} />
              <Route path="council" element={<CouncilManager />} />
              <Route path="board-members" element={<BoardMembersManager />} />
              <Route path="boards" element={<BoardManager />} />
              <Route path="bom" element={<BomManager />} />
              <Route path="bae" element={<BaeManager />} />
              <Route path="bap" element={<BapManager />} />
              <Route path="pab" element={<PabManager />} />
              <Route path="slia" element={<SliaManager />} />
              <Route path="contact" element={<ContactManager />} />
              <Route path="complaints" element={<ComplaintsManager />} />
              <Route path="faqs" element={<FAQManager />} />
              <Route path="ticker" element={<TickerManager />} />
              <Route path="award-categories" element={<AwardCategoriesManager />} />
              <Route path="content" element={<ContentManager />} />
              <Route path="users" element={<AdminUsersManager />} />
            </Route>
          </Route>

          <Route path="/boards" element={<Boards />} />

          <Route path="/slia-awards" element={<SliaAwards />} />



          {/* Friendly aliases: About Us */}
          <Route path="/about-trustees" element={<BoardOfTrustees />} />
          <Route path="/about-management" element={<BoardOfManagementAbout />} />
          <Route path="/about-bae" element={<BoardOfArchitecturalEducationAbout />} />
          <Route path="/about-pab" element={<ProfessionalAffairsBoardAbout />} />
          <Route path="/about-bap" element={<BoardOfArchitecturalPublications />} />

          {/* Friendly aliases: Boards */}
          <Route path="/trustees" element={<BoardOfTrustees />} />
          <Route path="/management" element={<BoardOfManagement />} />
          <Route path="/bae" element={<BoardOfArchitecturalEducation />} />
          <Route path="/bae/student-members" element={<BaeStudentMembers />} />
          <Route path="/bae/graduate-members" element={<BaeGraduateMembers />} />
          <Route path="/bae/associate-members" element={<BaeAssociateMembers />} />
          <Route path="/pab" element={<ProfessionalAffairsBoard />} />
          <Route path="/bap" element={<BoardOfArchitecturalPublicationsBoards />} />
          <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowSplash(false), 1400);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AnimatePresence mode="wait">{showSplash && <SplashScreen />}</AnimatePresence>
        <AppRoutes />
        <FloatingChatbot />
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
