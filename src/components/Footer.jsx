import React from "react";
import { Code2, Globe, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 bg-base-100/40 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-base-content/70">
        <p className="flex items-center gap-1.5">
          Made with <Heart size={14} className="text-rose-400 fill-rose-400" /> ·
          © {new Date().getFullYear()} Pairly
        </p>
        <div className="flex items-center gap-3">
          <a className="hover:text-white transition" aria-label="Source" href="#">
            <Code2 size={18} />
          </a>
          <a className="hover:text-white transition" aria-label="Website" href="#">
            <Globe size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
