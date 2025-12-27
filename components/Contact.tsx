"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    alert("Thank you! We'll contact you soon.");
    setFormData({ name: "", phone: "", service: "", message: "" });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="contact"
      className="py-24 bg-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-navy mb-4">
            Get In{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-orange to-gold">
              Touch
            </span>
          </h2>
          <p className="text-lg text-charcoal/80 max-w-2xl mx-auto">
            Ready to start your tailoring journey? Contact us today and let's
            create something perfect together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-white to-cream rounded-3xl shadow-xl p-8 border border-gray-100">
              <h3 className="text-2xl font-bold text-navy mb-6">
                Book Your Appointment
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-charcoal mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-charcoal mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-medium text-charcoal mb-2"
                  >
                    Service Type
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all bg-white"
                  >
                    <option value="">Select a service</option>
                    <option value="kurta">Kurta Tailoring</option>
                    <option value="pyjama">Pyjama Tailoring</option>
                    <option value="complete">Complete Set</option>
                    <option value="custom">Custom Request</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-charcoal mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all resize-none"
                    placeholder="Tell us about your requirements..."
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-gold to-orange text-white rounded-xl font-semibold text-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2"
                >
                  Send Message
                  <Send className="h-5 w-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-orange flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Phone</h4>
                    <p className="text-charcoal/80">+91 98765 43210</p>
                    <p className="text-charcoal/80">+91 98765 43211</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange to-gold flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Email</h4>
                    <p className="text-charcoal/80">info@silaistudio.com</p>
                    <p className="text-charcoal/80">orders@silaistudio.com</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-gold flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy mb-1">Address</h4>
                    <p className="text-charcoal/80">
                      123 Fashion Street, Textile Market
                      <br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-64 flex items-center justify-center overflow-hidden shadow-lg">
              <div className="text-center text-charcoal/60">
                <MapPin className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">Map Location</p>
                <p className="text-sm">Visit us at our store</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-white to-cream rounded-2xl shadow-lg p-6 border border-gray-100">
              <h4 className="font-bold text-navy mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-orange flex items-center justify-center text-white hover:shadow-lg transition-all"
                >
                  <Facebook className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange to-gold flex items-center justify-center text-white hover:shadow-lg transition-all"
                >
                  <Instagram className="h-5 w-5" />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href="#"
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy to-gold flex items-center justify-center text-white hover:shadow-lg transition-all"
                >
                  <Twitter className="h-5 w-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
