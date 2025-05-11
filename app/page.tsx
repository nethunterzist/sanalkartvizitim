import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeedbackCarousel from './components/FeedbackCarousel';
import Footer from './components/Footer';
import TabbedFeatureSection from "./components/TabbedFeatureSection";
import HowItWorksSection from "./components/HowItWorksSection";
import VideoFaqSection from "./components/VideoFaqSection";
import VideoFeatureSection from "./components/VideoFeatureSection";
import SocialMediaBubbles from "./components/SocialMediaBubbles";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full">
      <Navbar />
      <Hero />
      <VideoFeatureSection />
      <HowItWorksSection />
      <TabbedFeatureSection />
      <VideoFaqSection />
      <FeedbackCarousel />
      <SocialMediaBubbles />
      <Footer />
    </main>
  );
}
