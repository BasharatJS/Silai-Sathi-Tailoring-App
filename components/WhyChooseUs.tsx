"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Award, Layers, CheckCircle, Zap } from "lucide-react";

const benefits = [
  {
    icon: Award,
    title: "Expert Craftsmanship",
    stat: "20+",
    suffix: "Years",
    description: "Two decades of experience in traditional and modern tailoring",
    color: "bg-navy",
    solid: true,
  },
  {
    icon: Layers,
    title: "Premium Fabrics",
    stat: "100+",
    suffix: "Options",
    description: "Extensive collection of high-quality fabrics from around India",
    color: "from-navy to-gold",
    solid: false,
  },
  {
    icon: CheckCircle,
    title: "Perfect Fit Guarantee",
    stat: "100%",
    suffix: "Satisfaction",
    description: "Free alterations until you're completely satisfied with the fit",
    color: "from-navy to-gold",
    solid: false,
  },
  {
    icon: Zap,
    title: "Quick Delivery",
    stat: "7-10",
    suffix: "Days",
    description: "Fast turnaround without compromising on quality or attention to detail",
    color: "bg-navy",
    solid: true,
  },
];

function Counter({ target, suffix, inView }: { target: string; suffix: string; inView: boolean }) {
  const [count, setCount] = useState("0");

  useEffect(() => {
    if (!inView) return;

    // Parse the target value
    const isNumeric = /^\d+$/.test(target);

    if (isNumeric) {
      const targetNum = parseInt(target);
      const duration = 2000;
      const steps = 60;
      const increment = targetNum / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targetNum) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current).toString());
        }
      }, duration / steps);

      return () => clearInterval(timer);
    } else {
      // For non-numeric values like "7-10"
      setCount(target);
    }
  }, [inView, target]);

  return (
    <div className="text-4xl font-bold mb-2">
      {count}
      <span className="text-2xl ml-1">{suffix}</span>
    </div>
  );
}

export default function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-4">
            Why Choose{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-navy to-gold">
              Silai Sathi?
            </span>
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Experience the difference with our commitment to quality,
            craftsmanship, and customer satisfaction.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 p-6">
                  {/* Icon with Gradient Background */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.15 + 0.2,
                      type: "spring",
                    }}
                    className={`w-16 h-16 rounded-xl ${benefit.solid ? benefit.color : `bg-gradient-to-br ${benefit.color}`} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </motion.div>

                  {/* Counter */}
                  <div className="text-navy mb-2">
                    <Counter
                      target={benefit.stat}
                      suffix={benefit.suffix}
                      inView={isInView}
                    />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-navy mb-3">
                    {benefit.title}
                  </h3>

                  {/* Description */}
                  <p className="text-charcoal/80 text-sm leading-relaxed">
                    {benefit.description}
                  </p>

                  {/* Decorative Element */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${benefit.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { value: "5000+", label: "Happy Customers" },
            { value: "98%", label: "Return Rate" },
            { value: "4.9/5", label: "Average Rating" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={stat.label} className="group">
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-3xl font-bold text-gold mb-2 group-hover:scale-110 transition-transform"
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-charcoal/70">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
