'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

export default function VideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Backdrop with heavy blur */}
      <div
        className="animate-in fade-in absolute inset-0 bg-slate-900/90 backdrop-blur-xl duration-300"
        onClick={onClose}
      />

      {/* Video Container */}
      <div className="animate-in zoom-in-95 relative aspect-video w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
        >
          <X size={20} />
        </button>

        {/* Replace the src with your actual demo video link */}
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
          title="Zidro Demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
