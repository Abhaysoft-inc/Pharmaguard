"use client";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Analyze", href: "#analyze" },
  { label: "Genes & Drugs", href: "#genes" },
  { label: "Contact", href: "#contact" },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("Home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/98 backdrop-blur-sm border-b border-[#dde8f4] shadow-sm"
          : "bg-white border-b border-[#dde8f4]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1356be] flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-4.5 h-4.5 text-white" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[#0b1e40] text-base font-bold tracking-tight" style={{fontFamily:"var(--font-oxanium),Oxanium,sans-serif"}}>
                PHARMA<span className="text-[#1356be]">GUARD</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium tracking-[0.2em] uppercase">AI Genomics</span>
            </div>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActive(link.label)}
                className={`relative text-sm font-semibold transition-colors pb-0.5 ${
                  active === link.label
                    ? "text-[#1356be]"
                    : "text-[#0b1e40] hover:text-[#1356be]"
                }`}
              >
                {link.label}
                {active === link.label && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1356be] rounded-full" />
                )}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#analyze"
            className="hidden md:inline-flex items-center border border-[#0b1e40] text-[#0b1e40] hover:bg-[#0b1e40] hover:text-white font-semibold text-sm px-5 py-1.5 rounded-full transition-all duration-200"
          >
            Let's Start
          </a>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#0b1e40] p-2 rounded-lg hover:bg-blue-50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#dde8f4] py-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => { setActive(link.label); setMenuOpen(false); }}
                className="block px-4 py-2.5 text-[#0b1e40] hover:text-[#1356be] hover:bg-blue-50 rounded-lg text-sm font-semibold transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 pt-2">
              <a href="#analyze" onClick={() => setMenuOpen(false)} className="block text-center border border-[#0b1e40] text-[#0b1e40] font-semibold text-sm px-4 py-2 rounded-full hover:bg-[#0b1e40] hover:text-white transition-all">
                Let's Start
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
