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
          ? "bg-neutral-900 text-white border-neutral-900"
          : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 hover:bg-neutral-50"
      }`}
    >
      <span className={selected ? "font-medium" : ""}>{label}</span>
      {multi && (
        <div className={`w-4 h-4 rounded flex items-center justify-center border flex-shrink-0 transition-all ${
          selected ? "bg-white border-white" : "border-neutral-300 group-hover:border-neutral-500"
        }`}>
          {selected && <Check className="w-2.5 h-2.5 text-neutral-900" />}
        </div>
      )}
    </motion.button>
  );
}
