import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaEnvelope,
  FaHeart,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#why-choose-us" },
      { label: "How it Works", href: "#why-mket" },
      { label: "FAQ", href: "#faq" },
      { label: "Pricing", href: "#" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Community Guidelines", href: "/guidelines" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: "#", label: "Facebook" },
    { icon: <FaTwitter />, href: "#", label: "Twitter" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-[#111827] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="font-zen text-3xl bg-linear-to-r from-[#7E22CE] to-[#14B8A6] text-transparent bg-clip-text mb-4">
                MKET
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6 font-instrument max-w-sm">
                The trusted student marketplace for buying and selling on
                campus. Safe, simple, and built for students, by students.
              </p>

              {/* Newsletter */}
              <div className="mb-6">
                <p className="text-sm text-gray-400 mb-3 font-inter">
                  Stay updated with MKET
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-4 py-2 bg-[#1F2937] text-white rounded-lg border border-gray-700 focus:border-[#7E22CE] focus:outline-none transition-colors"
                  />
                  <button className="px-6 py-2 bg-linear-to-r from-[#7E22CE] to-[#14B8A6] rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                    <FaEnvelope className="inline" />
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 flex items-center justify-center bg-[#1F2937] rounded-full text-gray-400 hover:text-white hover:bg-linear-to-r hover:from-[#7E22CE] hover:to-[#14B8A6] transition-all duration-300"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-bold text-white mb-4 font-inter">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#14B8A6] transition-colors font-instrument"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-bold text-white mb-4 font-inter">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#14B8A6] transition-colors font-instrument"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-bold text-white mb-4 font-inter">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[#14B8A6] transition-colors font-instrument"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm font-instrument">
              © {currentYear} MKET. All rights reserved. Built with{" "}
              <FaHeart className="inline text-red-500" /> for students.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-500 font-instrument">
                Made in Nigeria 🇳🇬
              </span>
              <span className="text-gray-500 font-instrument">•</span>
              <span className="text-gray-400 font-instrument">
                For Students, By Students
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
