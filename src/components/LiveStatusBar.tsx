import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface LiveStatusBarProps {
  onManualRefresh?: () => void;
  onOpenHealthModal?: () => void;
}

export const LiveStatusBar: React.FC<LiveStatusBarProps> = ({
  onManualRefresh,
  onOpenHealthModal,
}) => {
  const [secondsAgo, setSecondsAgo] = useState(42);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => {
        if (prev >= 59) {
          return 1;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSecondsAgo(1);
    if (onManualRefresh) {
      onManualRefresh();
    }
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200/80 py-1.5 px-4 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
        {/* Left Live Indicator */}
        <div
          onClick={onOpenHealthModal}
          className="flex items-center gap-2 cursor-pointer group"
          title="Click to view LTA DataMall API health & telemetry"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-700 group-hover:text-[#3525cd] transition-colors">
            Live LTA DataMall &amp; HDB/URA feeds
          </span>
          <span className="text-slate-400">•</span>
          <span className="font-semibold text-slate-800 tabular-nums">
            Synced {secondsAgo}s ago
          </span>
          <span className="hidden sm:inline-block text-[10px] text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded font-semibold ml-1">
            API v2.4
          </span>
        </div>

        {/* Right refresh notice and badges */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer group"
            title="Force refresh carpark availability feed"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-600 transition-transform ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span className="text-xs">Auto-refreshes every 60s</span>
          </button>

          <div className="flex items-center gap-1 text-[10px] font-bold tracking-tight">
            <span className="text-blue-700 bg-blue-100/60 px-1.5 py-0.5 rounded">
              HDB
            </span>
            <span className="text-teal-700 bg-teal-100/60 px-1.5 py-0.5 rounded">
              URA
            </span>
            <span className="text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded">
              LTA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
