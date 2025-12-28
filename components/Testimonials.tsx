"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Business Owner",
    rating: 5,
    review:
      "Outstanding craftsmanship! The kurta-pyjama set I ordered was perfectly tailored to my measurements. The fabric quality is excellent and the attention to detail is impressive.",
    avatar: "RK",
  },
  {
    name: "Priya Sharma",
    role: "Teacher",
    rating: 5,
    review:
      "I've been a customer for 3 years now. The team at Silai Sathi never disappoints. Their fabric collection is amazing and the fit is always perfect. Highly recommended!",
    avatar: "PS",
  },
  {
    name: "Amit Patel",
    role: "Engineer",
    rating: 5,
    review:
      "Fast delivery and excellent quality. I ordered a complete set for a wedding and received it within 8 days. The stitching is top-notch and the fit is perfect!",
    avatar: "AP",
  },
  {
    name: "Sunita Verma",
    role: "Designer",
    rating: 5,
    review:
      "As a designer myself, I'm very particular about quality. Silai Sathi exceeded my expectations. The fabric options are diverse and the tailoring is impeccable.",
    avatar: "SV",
  },
  {
    name: "Vikram Singh",
    role: "Entrepreneur",
    rating: 5,
    review:
      "Professional service from start to finish. The measurement guide was easy to follow, and the final product was exactly what I wanted. Will definitely order again!",
    avatar: "VS",
  },
];

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(
      (prev) =>
        (prev + newDirection + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="testimonials"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background */}
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
            What Our{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-navy to-gold">
             Customers Say
            </span>
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied customers
            have to say about their experience.
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Carousel */}
          <div className="relative h-96 flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
                className="absolute w-full"
              >
                <div className="bg-gradient-to-br from-white to-cream rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                  {/* Quote Icon */}
                  <Quote className="h-12 w-12 text-gold/30 mb-6" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: testimonials[currentIndex].rating }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-gold text-gold"
                        />
                      )
                    )}
                  </div>

                  {/* Review */}
                  <p className="text-xl text-charcoal mb-8 leading-relaxed italic">
                    "{testimonials[currentIndex].review}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-navy flex items-center justify-center text-white font-bold text-lg">
                      {testimonials[currentIndex].avatar}
                    </div>
                    <div>
                      <div className="font-bold text-navy text-lg">
                        {testimonials[currentIndex].name}
                      </div>
                      <div className="text-charcoal/70">
                        {testimonials[currentIndex].role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(-1)}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => paginate(1)}
              className="w-12 h-12 rounded-full bg-white shadow-lg hover:shadow-xl flex items-center justify-center text-navy hover:bg-gold hover:text-white transition-all"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`transition-all ${
                  index === currentIndex
                    ? "w-8 h-2 bg-gold"
                    : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
                } rounded-full`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
