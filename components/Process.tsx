"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, Ruler, Truck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Palette,
    title: "Choose & Customize",
    description:
      "Browse our extensive collection and select your preferred style, fabric, and design. Customize every detail to match your vision.",
    color: "bg-navy",
    solid: true,
  },
  {
    number: "02",
    icon: Ruler,
    title: "Get Measured",
    description:
      "Provide your measurements through our simple guide, or book a home visit for professional measurement by our expert tailors.",
    color: "from-navy to-gold",
    solid: false,
  },
  {
    number: "03",
    icon: Truck,
    title: "Receive & Enjoy",
    description:
      "Relax while we craft your perfect outfit. Get it delivered to your doorstep within 7-10 days with free alterations guaranteed.",
    color: "bg-navy",
    solid: true,
  },
];

export default function Process() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      id="process"
      className="py-24 bg-gradient-to-br from-cream to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-1/4 left-0 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-orange/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-4">
            Simple 3-Step{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-navy to-gold">
              Process
            </span>
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Getting your perfect outfit is easier than ever. Just follow these
            simple steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-1/4 right-1/4 h-1 bg-gradient-to-r from-gold via-orange to-gold">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5 }}
              className="h-full bg-gradient-to-r from-transparent via-white to-transparent origin-left"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.3 }}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Number Badge */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : {}}
                    transition={{
                      duration: 0.5,
                      delay: index * 0.3 + 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                    className={`relative w-24 h-24 mb-6 rounded-full ${step.solid ? step.color : `bg-gradient-to-br ${step.color}`} flex items-center justify-center shadow-xl`}
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
                    <Icon className="h-12 w-12 text-white relative z-10" />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-navy">
                        {step.number}
                      </span>
                    </div>
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-navy mb-3">
                    {step.title}
                  </h3>
                  <p className="text-charcoal/80 max-w-sm">{step.description}</p>

                  {/* Decorative Line - Mobile */}
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={isInView ? { scaleY: 1 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.3 + 0.6 }}
                      className="lg:hidden w-0.5 h-16 bg-gradient-to-b from-navy to-gold mt-8 origin-top"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-center mt-16"
        >
          <p className="text-charcoal/80 mb-6">
            Ready to get started with your custom outfit?
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.querySelector("#contact");
              if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition =
                  elementPosition + window.pageYOffset - offset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
              }
            }}
            className="px-8 py-4 bg-navy text-white rounded-full font-semibold text-lg hover:bg-gold hover:shadow-2xl transition-all cursor-pointer"
          >
            Start Your Journey
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
