import React, { useState, useEffect } from 'react';
import { X, Activity, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink, ShieldAlert, Cpu } from 'lucide-react';

interface HealthMonitorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HealthMonitorModal: React.FC<HealthMonitorModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [healthData, setHealthData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/apt/health');
      if (res.ok) {
        const json = await res.json();
        setHealthData(json);
      } else {
        setError(`Health API returned HTTP ${res.status}`);
      }
    } catch (err: any) {
      setError(`Failed to query /apt/health: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isHealthy = healthData?.status === 'healthy';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[#3525cd]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-slate-900">
                  LTA DataMall &amp; API Health Monitor
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-200 text-slate-700">
                  /apt/health
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitoring live CarParkAvailabilityv2 &amp; backend services
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm">
          {/* Status banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between ${
              isHealthy
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-3">
              {isHealthy ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              )}
              <div>
                <span className="font-extrabold uppercase tracking-wide text-xs block">
                  SYSTEM STATUS: {healthData?.status ? healthData.status.toUpperCase() : 'CHECKING...'}
                </span>
                <span className="text-xs text-slate-600 mt-0.5 block">
                  {healthData?.ltaDataMall?.connectivity?.message ||
                    'Probing LTA DataMall v2 endpoints...'}
                </span>
              </div>
            </div>

            <button
              onClick={fetchHealth}
              disabled={loading}
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shrink-0 transition-colors cursor-pointer"
              title="Refresh health check"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* LTA Endpoint details */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-3.5 py-2 font-bold text-xs text-slate-700 flex items-center justify-between">
              <span>LTA DataMall v2 Endpoint Configuration</span>
              <span className="text-emerald-700 font-extrabold">Active Target</span>
            </div>
            <div className="p-3.5 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Target URL</span>
                <span className="font-mono text-slate-800 text-[11px] truncate max-w-[280px]">
                  https://datamall2.mytransport.sg/ltaodataservice/CarParkAvailabilityv2
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">LTA_ACCOUNT_KEY Status</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                    healthData?.ltaDataMall?.keyConfigured
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {healthData?.ltaDataMall?.maskedKey || 'Checking...'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Response Latency</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {healthData?.ltaDataMall?.connectivity?.latencyMs ?? 0} ms
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Live Ingest Records</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {healthData?.ltaDataMall?.connectivity?.recordCount ?? 0} lots returned
                </span>
              </div>
            </div>
          </div>

          {/* Configured API Routes Checklist */}
          <div className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50">
            <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider block">
              Configured API Endpoints &amp; File Structure
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <a
                href="/apt/carparks"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#3525cd] flex items-center justify-between group transition-all"
              >
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-[#3525cd]">
                    /apt/carparks
                  </span>
                  <span className="text-[10px] text-slate-500 block">LTA DataMall Feed JSON</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#3525cd]" />
              </a>

              <a
                href="/apt/health"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#3525cd] flex items-center justify-between group transition-all"
              >
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-[#3525cd]">
                    /apt/health
                  </span>
                  <span className="text-[10px] text-slate-500 block">Health Monitor Diagnostic</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#3525cd]" />
              </a>

              <a
                href="/a/apt/heath.js"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#3525cd] flex items-center justify-between group transition-all"
              >
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-[#3525cd]">
                    /a/apt/heath.js
                  </span>
                  <span className="text-[10px] text-slate-500 block">Requested Path Alias</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#3525cd]" />
              </a>

              <a
                href="/api/carparks"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white border border-slate-200 hover:border-[#3525cd] flex items-center justify-between group transition-all"
              >
                <div>
                  <span className="font-bold text-slate-800 group-hover:text-[#3525cd]">
                    /api/carparks
                  </span>
                  <span className="text-[10px] text-slate-500 block">Vercel Serverless Route</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#3525cd]" />
              </a>
            </div>
          </div>

          {/* Vercel Environment Instructions */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 leading-relaxed">
            <span className="font-bold text-blue-900 block mb-1">
              🔑 Vercel Environment Variable Instructions:
            </span>
            To connect live production LTA DataMall data in your Vercel deployment:
            <ol className="list-decimal list-inside mt-1.5 space-y-1 text-slate-700">
              <li>Open your project in the Vercel Dashboard.</li>
              <li>Go to <strong>Settings</strong> &rarr; <strong>Environment Variables</strong>.</li>
              <li>
                Add Key: <code className="bg-white px-1.5 py-0.5 rounded border border-blue-200 font-mono font-bold text-blue-800">LTA_ACCOUNT_KEY</code>
              </li>
              <li>Paste your 32-character key from LTA DataMall.</li>
              <li>Redeploy or promote to production. The app will immediately ingest full live telemetry.</li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-[#3525cd] hover:bg-[#2b1ea6] font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
