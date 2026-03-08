//src/components/v2/MobileHeader.tsx

import { Wrench } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-40 w-full bg-white dark:bg-[#050608] border-b border-slate-100 dark:border-white/5 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1 rounded-lg">
          <Wrench className="h-4 w-4 text-white" />
        </div>
        <span className="font-black italic text-sm dark:text-white">SERVARA</span>
      </div>
      
      <div className="flex items-center gap-3">
        <ThemeToggle /> {/* Reuse the toggle we built */}
        <div className="h-8 w-8 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white">
          MT
        </div>
      </div>
    </header>
  );
}