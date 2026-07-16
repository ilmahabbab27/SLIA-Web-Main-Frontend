import SiteHeader from "@/components/SiteHeader";
import HeroCarousel from "@/components/HeroCarousel";
import AboutSection from "@/components/AboutSection";
import BoardsSection from "@/components/BoardsSection";
import WhyArchitectSection from "@/components/WhyArchitectSection";
import SliaEventsSection from "@/components/SliaEventsSection";
import KeyHighlightsSection from "@/components/KeyHighlightsSection";
import NewsSection from "@/components/NewsSection";
import BecomeArchitect from "@/components/BecomeArchitect";
import FAQSection from "@/components/FAQSection";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <HeroCarousel />
        <KeyHighlightsSection />
        <NewsSection />

        <AboutSection />
        <WhyArchitectSection />
        <BoardsSection />
        <SliaEventsSection />
        <BecomeArchitect />
        <FAQSection />
      </main>
      <SiteFooter />
    </div>
  );
};

export default Index;
