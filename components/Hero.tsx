"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const fabricPatterns = [
  { x: "10%", y: "20%", size: 60, rotation: 15, delay: 0 },
  { x: "80%", y: "15%", size: 80, rotation: -20, delay: 0.2 },
  { x: "15%", y: "70%", size: 70, rotation: 30, delay: 0.4 },
  { x: "85%", y: "75%", size: 90, rotation: -15, delay: 0.6 },
  { x: "50%", y: "50%", size: 100, rotation: 45, delay: 0.3 },
];

export default function Hero() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-white to-gold/10"
    >
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {fabricPatterns.map((pattern, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{
              opacity: 0.1,
              scale: 1,
              rotate: pattern.rotation,
            }}
            transition={{
              delay: pattern.delay,
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2,
            }}
            style={{
              position: "absolute",
              left: pattern.x,
              top: pattern.y,
              width: pattern.size,
              height: pattern.size,
            }}
            className="rounded-lg bg-gradient-to-br from-gold to-orange"
          />
        ))}
      </div>

      {/* Floating Fabric Swatches */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute top-32 left-10 w-24 h-24 bg-gradient-to-br from-orange to-gold rounded-2xl rotate-12 opacity-20 blur-sm"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute bottom-32 right-10 w-32 h-32 bg-gradient-to-br from-gold to-navy rounded-2xl -rotate-12 opacity-20 blur-sm"
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <Sparkles className="h-5 w-5 text-gold" />
          <span className="text-sm font-medium text-charcoal tracking-wide uppercase">
            Premium Tailoring Services
          </span>
          <Sparkles className="h-5 w-5 text-gold" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold text-navy mb-6 leading-tight"
        >
          Perfect Fit,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-orange to-gold">
            Perfectly Crafted
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl sm:text-2xl text-charcoal/80 mb-12 max-w-3xl mx-auto"
        >
          Traditional tailoring meets modern convenience. Experience the art of
          custom-made clothing with our expert craftsmanship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/customer/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gold text-white rounded-full font-semibold text-lg hover:bg-primary-dark transition-all shadow-lg hover:shadow-2xl flex items-center gap-2"
            >
              Start Your Order
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection("#gallery")}
            className="px-8 py-4 bg-white text-navy rounded-full font-semibold text-lg hover:bg-gray-50 transition-all shadow-lg hover:shadow-2xl border-2 border-navy"
          >
            View Collections
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-gold rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-gold rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
