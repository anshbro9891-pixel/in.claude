import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ModelsSection from "@/components/ModelsSection";
import DemoSection from "@/components/DemoSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ModelsSection />
        <DemoSection />
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
