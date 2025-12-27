"use client";

import { motion } from "framer-motion";
import {
  Scissors,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

const footerLinks = {
  services: [
    { name: "Kurta Tailoring", href: "#services" },
    { name: "Pyjama Tailoring", href: "#services" },
    { name: "Complete Set", href: "#services" },
    { name: "Custom Designs", href: "#services" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Our Process", href: "#process" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ],
  support: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Shipping Policy", href: "#" },
    { name: "Return Policy", href: "#" },
  ],
};

export default function Footer() {
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
    <footer className="bg-gradient-to-br from-navy to-charcoal text-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="relative">
                <Scissors className="h-8 w-8 text-gold rotate-45" />
                <motion.div
                  className="absolute -top-1 -right-1 w-2 h-2 bg-orange rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <span className="text-2xl font-bold">
                Silai <span className="text-gold">Sathi</span>
              </span>
            </motion.div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Crafting perfect fits with traditional expertise and modern
              convenience. Your trusted partner for premium tailoring services
              since 2000.
            </p>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gold flex items-center justify-center transition-all"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gold flex items-center justify-center transition-all"
              >
                <Instagram className="h-5 w-5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href="#"
                className="w-10 h-10 rounded-lg bg-white/10 hover:bg-gold flex items-center justify-center transition-all"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12 pb-12 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
              <Phone className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs text-white/60">Call Us</p>
              <p className="text-sm font-medium">+91 9000004928</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs text-white/60">Email Us</p>
              <p className="text-sm font-medium">info@silaistudio.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-gold" />
            </div>
            <div>
              <p className="text-xs text-white/60">Visit Us</p>
              <p className="text-sm font-medium">Coimbtore, Tamilnadu</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-sm text-white/60">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>&copy; {new Date().getFullYear()} Silai Sathi.</span>
            <span>All rights reserved.</span>
            <span className="flex items-center gap-1">
              Powered by{" "}
              <a
                href="https://www.codewithbasharat.com/projects"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-orange transition-colors cursor-pointer font-semibold"
              >
                Code With Basharat
              </a>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
