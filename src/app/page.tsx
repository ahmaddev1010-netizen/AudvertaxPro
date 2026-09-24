import HeroSection from "@/components/HeroSection";
import HomeMotion from "@/components/HomeMotion";
import VSLSection from "@/components/VSLSection";
import ProblemsSolutions from "@/components/ProblemsSolutions";
import PricingSection from "@/components/PricingSection";
import DashboardSection from "@/components/DashboardSection";
import ProcessSection from "@/components/ProcessSection";
import StateExplorerSection from "@/components/StateExplorerSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div>
      <HomeMotion>
        <main>
          <HeroSection />
          {/* <VSLSection /> */}
          <ProblemsSolutions />
          <PricingSection />
          <DashboardSection />
          <ProcessSection />
          {/* <StateExplorerSection /> */}
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
        </main>
      </HomeMotion>
      <Footer />
    </div>
  );
}
