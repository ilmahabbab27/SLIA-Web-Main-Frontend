import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AnnualAwards from "./pages/AnnualAwards";
import ArchitectExhibition from "./pages/ArchitectExhibition";
import DesignCompetition from "./pages/DesignCompetition";
import FindAnArchitect from "./pages/FindAnArchitect";
import ArchitectPractices from "./pages/ArchitectPractices";
import WhyBeAnArchitect from "./pages/WhyBeAnArchitect";
import LatestNews from "./pages/LatestNews";
import UpcomingEvents from "./pages/UpcomingEvents";
import PastEvents from "./pages/PastEvents";
import Events from "./pages/Events";
import SliaAnnualSessions from "./pages/SliaAnnualSessions";
import Courses from "./pages/Courses";
import Examinations from "./pages/Examinations";
import Publications from "./pages/Publications";
import Specifications from "./pages/Specifications";
import History from "./pages/History";
import Council from "./pages/about/Council";
import Objectives from "./pages/Objectives";
import Contact from "./pages/Contact";
import About from "./pages/about/About";
import BoardOfTrustees from "./pages/about/BoardOfTrustees";
import BoardOfManagementAbout from "./pages/about/BoardOfManagement";
import BoardOfManagement from "./pages/boards/BoardOfManagement.tsx";
import BoardOfArchitecturalEducationAbout from "./pages/about/BoardOfArchitecturalEducation";
import BoardOfArchitecturalEducation from "./pages/boards/BoardOfArchitecturalEducation.tsx";
import ProfessionalAffairsBoard from "./pages/boards/ProfessionalAffairsBoard.tsx";
import ProfessionalAffairsBoardAbout from "./pages/about/ProfessionalAffairsBoard";
import BoardOfArchitecturalPublications, {
  BoardOfArchitecturalPublicationsView,
} from "./pages/about/BoardOfArchitecturalPublications";
import BoardOfArchitecturalPublicationsBoards from "./pages/boards/BoardOfArchitecturalPublications";
import Boards from "./pages/Boards";
import SliaAwards from "./pages/SliaAwards";
import BaeAdminLogin from "./pages/baeAdmin/Login";
import BaeAdminDashboard from "./pages/baeAdmin/Dashboard";
import BaeAdminStudents from "./pages/baeAdmin/Students";
import BaeAdminGraduates from "./pages/baeAdmin/Graduates";
import BaeAdminDocuments from "./pages/baeAdmin/Documents";
import RequireBaeAdminAuth from "./pages/baeAdmin/RequireAuth";
import BapAdminLogin from "./pages/bapAdmin/Login";
import BapAdminDashboard from "./pages/bapAdmin/Dashboard";
import BapAdminPublications from "./pages/bapAdmin/Publications";
import RequireBapAdminAuth from "./pages/bapAdmin/RequireAuth";
import BomAdminLogin from "./pages/bomadmin/Login";
import BomAdminDashboard from "./pages/bomadmin/Dashboard";
import BomAdminManagement from "./pages/bomadmin/Management";
import RequireBomAdminAuth from "./pages/bomadmin/RequireAuth";

import PabAdminLogin from "./pages/pabAdmin/Login";
import PabAdminDashboard from "./pages/pabAdmin/Dashboard";
import PabAdminManagement from "./pages/pabAdmin/Management";
import RequirePabAdminAuth from "./pages/pabAdmin/RequireAuth";
import MainAdminLogin from "./pages/mainAdmin/Login";
import MainAdminDashboard from "./pages/mainAdmin/Dashboard";
import RequireMainAdminAuth from "./pages/mainAdmin/RequireAuth";

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
          <Route path="/find-an-architect" element={<FindAnArchitect />} />
          <Route path="/architect-practices" element={<ArchitectPractices />} />
          <Route path="/why-be-an-architect" element={<WhyBeAnArchitect />} />
          <Route path="/latest-news" element={<LatestNews />} />
          <Route path="/events" element={<Events />} />
          <Route path="/slia-annual-sessions" element={<SliaAnnualSessions />} />
          <Route path="/upcoming-events" element={<UpcomingEvents />} />
          <Route path="/past-events" element={<PastEvents />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/examinations" element={<Examinations />} />
          <Route path="/bae-notices" element={<Navigate to="/bae" replace />} />
          <Route path="/publications" element={<Publications />} />
          <Route path="/specifications" element={<Specifications />} />
          <Route path="/downloads" element={<Navigate to="/bae" replace />} />
          <Route path="/history" element={<History />} />
          <Route path="/council" element={<Council />} />
          <Route path="/objectives" element={<Objectives />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/slia-awards" element={<SliaAwards />} />

          {/* BAE Admin */}
          <Route path="/bae-admin/login" element={<BaeAdminLogin />} />
          <Route
            path="/bae-admin"
            element={
              <RequireBaeAdminAuth>
                <BaeAdminDashboard />
              </RequireBaeAdminAuth>
            }
          />
          <Route
            path="/bae-admin/students"
            element={
              <RequireBaeAdminAuth>
                <BaeAdminStudents />
              </RequireBaeAdminAuth>
            }
          />
          <Route
            path="/bae-admin/graduates"
            element={
              <RequireBaeAdminAuth>
                <BaeAdminGraduates />
              </RequireBaeAdminAuth>
            }
          />

          <Route
            path="/bae-admin/documents"
            element={
              <RequireBaeAdminAuth>
                <BaeAdminDocuments />
              </RequireBaeAdminAuth>
            }
          />

          {/* BAP Admin */}
          <Route path="/bap-admin/login" element={<BapAdminLogin />} />
          <Route
            path="/bap-admin"
            element={
              <RequireBapAdminAuth>
                <BapAdminDashboard />
              </RequireBapAdminAuth>
            }
          />
          <Route
            path="/bap-admin/publications"
            element={
              <RequireBapAdminAuth>
                <BapAdminPublications />
              </RequireBapAdminAuth>
            }
          />

          {/* BOM Admin */}
          <Route path="/bom-admin/login" element={<BomAdminLogin />} />
          <Route
            path="/bom-admin"
            element={
              <RequireBomAdminAuth>
                <BomAdminDashboard />
              </RequireBomAdminAuth>
            }
          />
          <Route
            path="/bom-admin/management"
            element={
              <RequireBomAdminAuth>
                <BomAdminManagement />
              </RequireBomAdminAuth>
            }
          />

          {/* PAB Admin */}
          <Route path="/pab-admin/login" element={<PabAdminLogin />} />
          <Route
            path="/pab-admin"
            element={
              <RequirePabAdminAuth>
                <PabAdminDashboard />
              </RequirePabAdminAuth>
            }
          />
          <Route
            path="/pab-admin/management"
            element={
              <RequirePabAdminAuth>
                <PabAdminManagement />
              </RequirePabAdminAuth>
            }
          />

          {/* Main Admin */}
          <Route path="/admin/login" element={<MainAdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireMainAdminAuth>
                <MainAdminDashboard />
              </RequireMainAdminAuth>
            }
          />


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
          <Route path="/pab" element={<ProfessionalAffairsBoard />} />
          <Route path="/bap" element={<BoardOfArchitecturalPublicationsBoards />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
