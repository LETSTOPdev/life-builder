"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface ChoiceCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}

export function ChoiceCard({ label, selected, onClick, multi = false }: ChoiceCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`w-full text-left px-4 py-3 rounded-xl border text-sm cursor-pointer transition-all duration-150 flex items-center justify-between group ${
        selected
          ? "bg-white text-black border-white"
          : "bg-[#161616] text-[#bbb] border-white/18 hover:border-white/40 hover:text-white hover:bg-[#1c1c1c]"
      }`}
    >
      <span className={selected ? "font-medium" : ""}>{label}</span>
      {multi && (
        <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-all ${
          selected ? "bg-black border-black" : "border-white/20 group-hover:border-white/40"
        }`}>
          {selected && <Check className="w-2.5 h-2.5 text-white" />}
        </div>
      )}
    </motion.button>
  );
}
