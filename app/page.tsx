import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyChooseUs from "@/components/WhyChooseUs";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <WhyChooseUs />
        <Gallery />
        <Testimonials />
        {/* <Pricing /> */}
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
