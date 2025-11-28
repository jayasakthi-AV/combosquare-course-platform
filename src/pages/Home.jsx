import Hero from "../components/home/Hero";
import CareerTracks from "../components/home/CareerTracks";
import ProgramSlider from "../components/home/ProgramSlider";
import StudentReview from "../components/home/StudentReview";
import WhyChooseUs from "../components/home/WhyChooseUs";
import Achievement from "../components/home/Achievement";
import FAQ from "../components/home/FAQ";



export default function Home() {
  return (
    <>
      <Hero />
      <CareerTracks />
      <ProgramSlider />
      <StudentReview />
      <WhyChooseUs />
      <Achievement /> 
      <FAQ />
    </>
  );
}
