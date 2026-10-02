import React from 'react';
import { X, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
import { DrivingGuide } from '../types';

interface GuideModalProps {
  guide: DrivingGuide | null;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ guide, onClose }) => {
  if (!guide) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50">
          <div>
            <span className="text-[10px] font-extrabold uppercase bg-indigo-50 text-[#3525cd] px-2 py-0.5 rounded border border-indigo-200">
              {guide.badge}
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">{guide.title}</h3>
            <p className="text-xs text-slate-500 mt-1">{guide.summary}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition-colors cursor-pointer shrink-0 ml-3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {guide.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3525cd]"></span>
                <span>{sec.heading}</span>
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{sec.body}</p>

              {sec.highlights && sec.highlights.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 mt-2">
                  {sec.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-[#3525cd] hover:bg-[#2b1ea6] font-bold text-xs sm:text-sm text-white transition-colors cursor-pointer"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  );
};
