import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/faqData';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-12 border-t border-slate-200">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          FREQUENTLY ASKED QUESTIONS
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Everything you need to know
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Straightforward answers regarding data sources, accuracy tolerances, and usage.
        </p>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-slate-200 border-y border-slate-200">
        {FAQ_ITEMS.map((faq) => {
          const isOpen = openIds.includes(faq.id);
          return (
            <div key={faq.id} className="py-4">
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full flex items-center justify-between text-left group focus:outline-hidden cursor-pointer"
              >
                <span className="text-sm sm:text-base font-semibold text-slate-900 group-hover:text-[#3525cd] transition-colors pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ${
                    isOpen ? 'rotate-180 text-[#3525cd]' : ''
                  }`}
                />
              </button>
              {isOpen && (
                <div className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
