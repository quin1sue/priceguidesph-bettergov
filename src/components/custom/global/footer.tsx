// Footer.tsx
"use client";
import { FaDiscord, FaGithub } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-black text-white py-8 h-full px-6  mt-[5.4px]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-lg font-semibold">Join our Community</p>
        <div className="flex items-center gap-6">
          {/* Discord */}
          <a
            href="https://discord.gg/RpYZyCupuj"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-300 transition"
          >
            <FaDiscord size={24} />
            <span>Discord</span>
          </a>

          <a
            href="https://github.com/quin1sue/ekonotrack-ph.bettergov"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-gray-300 transition"
          >
            <FaGithub size={24} />
            <span>GitHub</span>
          </a>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-4 text-center">
        &copy; {new Date().getFullYear()} EkonoTrack. All rights reserved.
      </p>
    </footer>
  );
};
