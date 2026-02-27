import SiteHeader from "@/components/SiteHeader";
import HeroCarousel from "@/components/HeroCarousel";
import EventsCarousel from "@/components/EventsCarousel";
import AboutSection from "@/components/AboutSection";
import VideoSection from "@/components/VideoSection";
import NewsSection from "@/components/NewsSection";
import BecomeArchitect from "@/components/BecomeArchitect";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroCarousel />
        <EventsCarousel />
        <AboutSection />
        <VideoSection />
        <NewsSection />
        <BecomeArchitect />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
