import { Hero } from "./Hero";
import { ServiceCategories } from "./ServiceCategories";
import { FeaturedNurses } from "./FeaturedNurses";
import { StatsCounter } from "./StatsCounter";
import { Testimonials } from "./Testimonials";
import { TrustSection } from "./TrustSection";

export function LandingPage() {
  return (
    <>
      <Hero />
      <StatsCounter />
      <ServiceCategories />
      <FeaturedNurses />
      <Testimonials />
      <TrustSection />
    </>
  );
}
