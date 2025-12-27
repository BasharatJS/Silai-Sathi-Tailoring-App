"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, Crown, Star } from "lucide-react";

const pricingPlans = [
  {
    name: "Basic",
    price: "650",
    description: "Perfect for simple tailoring needs",
    features: [
      "Single kurta or pyjama",
      "Standard fabric options",
      "Basic measurements",
      "10-12 days delivery",
      "One free alteration",
      "Standard stitching",
    ],
    gradient: "from-gray-400 to-gray-600",
    buttonStyle: "bg-gray-600 hover:bg-gray-700",
  },
  {
    name: "Standard",
    price: "999",
    description: "Most popular choice for complete sets",
    features: [
      "Kurta + Pyjama set",
      "Premium fabric options",
      "Detailed measurements",
      "7-10 days delivery",
      "Two free alterations",
      "Premium stitching",
      "Fabric consultation",
      "Home measurement available",
    ],
    gradient: "from-gold to-orange",
    buttonStyle: "bg-gradient-to-r from-gold to-orange hover:shadow-xl",
    popular: true,
    icon: Crown,
  },
  {
    name: "Premium",
    price: "1,799",
    description: "Luxury tailoring experience",
    features: [
      "Multiple sets discount",
      "Exclusive fabric collection",
      "Expert measurements at home",
      "5-7 days express delivery",
      "Unlimited alterations",
      "Luxury stitching & finishing",
      "Personal style consultation",
      "Priority customer support",
      "Complimentary accessories",
    ],
    gradient: "from-navy to-gold",
    buttonStyle: "bg-gradient-to-r from-navy to-gold hover:shadow-xl",
    icon: Star,
  },
];

export default function Pricing() {
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
    <section className="py-24 bg-gradient-to-br from-cream to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-4">
            Transparent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-orange to-gold">
              Pricing
            </span>
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Choose the perfect plan for your tailoring needs. All prices include
            expert craftsmanship and quality materials.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className={`relative ${plan.popular ? "md:scale-105" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-gold to-orange text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div
                  className={`h-full bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 ${
                    plan.popular ? "border-gold" : "border-gray-100"
                  }`}
                >
                  {/* Header */}
                  <div className="p-8 text-center">
                    {Icon && <Icon className="h-10 w-10 mx-auto mb-4 text-gold" />}
                    <h3 className="text-2xl font-bold text-navy mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-charcoal/70 text-sm mb-6">
                      {plan.description}
                    </p>
                    <div className="mb-6">
                      <span className="text-5xl font-bold text-navy">
                        ₹{plan.price}
                      </span>
                      <span className="text-charcoal/70 text-sm ml-2">
                        starting
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="px-8 pb-8">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div
                            className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}
                          >
                            <Check className="h-3 w-3 text-white" />
                          </div>
                          <span className="text-charcoal text-sm leading-tight">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={scrollToContact}
                      className={`w-full py-4 rounded-xl text-white font-semibold transition-all ${plan.buttonStyle}`}
                    >
                      Choose {plan.name}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-charcoal/80 mb-4">
            All plans include quality assurance and customer satisfaction guarantee
          </p>
          <p className="text-sm text-charcoal/60">
            Need a custom quote? Contact us for bulk orders or special requirements
          </p>
        </motion.div>
      </div>
    </section>
  );
}
