import { Hero } from "./Hero";
import { ServiceCategories } from "./ServiceCategories";
import { FeaturedNurses } from "./FeaturedNurses";
import { TrustSection } from "./TrustSection";

export function LandingPage() {
  return (
    <>
      <Hero />
      <ServiceCategories />
      <FeaturedNurses />
      <TrustSection />
    </>
  );
}
