"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shirt, FileText, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Shirt,
    title: "Kurta Tailoring",
    description:
      "Expertly crafted kurtas with custom measurements and premium fabrics. Choose from traditional to contemporary designs.",
    price: "₹650",
    features: ["Custom Measurements", "Premium Fabrics", "Traditional & Modern Designs"],
    gradient: "from-gold to-orange",
  },
  {
    icon: FileText,
    title: "Pyjama Tailoring",
    description:
      "Comfortable and perfectly fitted pyjamas tailored to your exact specifications. Multiple style options available.",
    price: "₹450",
    features: ["Perfect Fit", "Comfortable Designs", "Multiple Styles"],
    gradient: "from-orange to-gold",
    popular: true,
  },
  {
    icon: Package,
    title: "Complete Set",
    description:
      "Get the perfect kurta-pyjama combination with special pricing. Complete outfit solution for any occasion.",
    price: "₹999",
    features: ["Kurta + Pyjama", "Matching Set", "Special Pricing"],
    gradient: "from-navy to-gold",
  },
];

export default function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const scrollToContact = () => {
    const element = document.querySelector("#contact");
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
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-4">
            Our Tailoring{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-orange to-gold">
              Services
            </span>
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Choose from our range of premium tailoring services designed to give
            you the perfect fit every time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-orange to-gold text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                  {/* Card Header with Gradient */}
                  <div
                    className={`bg-gradient-to-br ${service.gradient} p-8 text-white relative`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <Icon className="h-12 w-12 mb-4 relative z-10" />
                    <h3 className="text-2xl font-bold mb-2 relative z-10">
                      {service.title}
                    </h3>
                    <div className="text-3xl font-bold relative z-10">
                      {service.price}
                      <span className="text-sm font-normal opacity-90">
                        {" "}
                        starting
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <p className="text-charcoal/80 mb-6">{service.description}</p>

                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                          <span className="text-sm text-charcoal">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link href="/customer/dashboard">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy/90 transition-colors flex items-center justify-center gap-2 group"
                      >
                        Order Now
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
