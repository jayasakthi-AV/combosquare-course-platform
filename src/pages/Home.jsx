import Hero from "../components/home/Hero";
import CareerTracks from "../components/home/CareerTracks";
import ProgramSlider from "../components/home/ProgramSlider";
import StudentReview from "../components/home/StudentReview";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Achievement from "../components/home/Achievement";
import FAQ from "../components/home/FAQ";
import FinalCTA from "../components/home/FinalCTA";
import Footer from "../components/home/Footer";

import FadeOnScroll from "../components/animation/FadeOnScroll";

export default function Home() {
  return (
    <>
      <FadeOnScroll><Hero /></FadeOnScroll>
      <FadeOnScroll><CareerTracks /></FadeOnScroll>
      <FadeOnScroll><ProgramSlider /></FadeOnScroll>
      <FadeOnScroll><StudentReview /></FadeOnScroll>
      <FadeOnScroll><WhyChooseUs /></FadeOnScroll>
      <FadeOnScroll><Achievement /></FadeOnScroll>
      <FadeOnScroll><FAQ /></FadeOnScroll>
      <FadeOnScroll><FinalCTA /></FadeOnScroll>
      <Footer />
    </>
  );
}
