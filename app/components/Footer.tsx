'use client';

import { usePathname } from 'next/navigation';
import { Bug, Heart } from 'lucide-react';
import { trackFeedbackLinkClicked } from '@/lib/analytics';

export default function Footer() {
  const pathname = usePathname();

  const handleFeedbackClick = () => {
    trackFeedbackLinkClicked({
      source: 'footer',
      current_page: pathname || '/',
    });
  };

  return (
    <footer className="border-t border-white/5 bg-[#0c1220] px-6 py-3">
      <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <span>Made with</span>
          <Heart size={14} className="text-red-500" fill="currentColor" />
          <span>for poker players</span>
        </div>

        <a
          href="https://rangedeck.canny.io/feature-requests"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleFeedbackClick}
          className="flex items-center gap-2 text-slate-400 hover:text-[#3b82f6] transition-colors"
        >
          <Bug size={16} />
          <span>Report Bug / Request Feature</span>
        </a>

        <div className="text-slate-500 text-xs">
          © {new Date().getFullYear()} RangeDeck
        </div>
      </div>
    </footer>
  );
}
