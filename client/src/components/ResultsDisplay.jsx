"use client";
import { useState } from "react";

const RISK_CONFIG = {
  Safe: {
    bg: "bg-emerald-500/8",
    border: "border-emerald-500/30",
    headerBg: "bg-emerald-500/10",
    text: "text-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  "Adjust Dosage": {
    bg: "bg-amber-500/8",
    border: "border-amber-500/30",
    headerBg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    dot: "bg-amber-400",
    glow: "shadow-amber-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path
          fillRule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  Toxic: {
    bg: "bg-red-500/8",
    border: "border-red-500/30",
    headerBg: "bg-red-500/10",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-300 border border-red-500/30",
    dot: "bg-red-400",
    glow: "shadow-red-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path
          fillRule="evenodd"
          d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  Ineffective: {
    bg: "bg-orange-500/8",
    border: "border-orange-500/30",
    headerBg: "bg-orange-500/10",
    text: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-300 border border-orange-500/30",
    dot: "bg-orange-400",
    glow: "shadow-orange-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  Unknown: {
    bg: "bg-slate-500/8",
    border: "border-slate-500/30",
    headerBg: "bg-slate-500/10",
    text: "text-slate-400",
    badge: "bg-slate-500/20 text-slate-300 border border-slate-600/30",
    dot: "bg-slate-400",
    glow: "shadow-slate-500/10",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path
          fillRule="evenodd"
          d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-1.21-3.628-1.21-1.61 0-3.51.86-3.51 2.967 0 1.61 1.19 2.348 2.082 2.816l.84.472c.35.197.609.36.609.723 0 .434-.416.73-1.004.73-.807 0-1.541-.328-2.038-.99a.75.75 0 00-1.21.882c.726.995 1.917 1.608 3.248 1.608 1.764 0 2.882-1.105 2.882-2.52 0-1.297-.72-1.978-1.716-2.515l-.84-.473c-.392-.22-.574-.382-.574-.696 0-.38.403-.587.888-.587.532 0 1.04.196 1.406.55a.75.75 0 001.043-1.078zM12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

function getRiskConfig(risk) {
  return RISK_CONFIG[risk] || RISK_CONFIG["Unknown"];
}

export default function ResultsDisplay({ results }) {
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState(false);

  const toggleExpand = (index) =>
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));

  // Normalize results shape: backend may return { results: [...] } or directly an array
  const analysisResults = Array.isArray(results)
    ? results
    : Array.isArray(results?.results)
      ? results.results
      : [];

  const patientId = results?.patient_id || results?.sample_id || null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(results, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pharmaguard-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Risk summary counts
  const riskCounts = Object.fromEntries(
    Object.keys(RISK_CONFIG).map((r) => [
      r,
      analysisResults.filter((x) => x.risk === r).length,
    ]),
  );

  if (analysisResults.length === 0) {
    return (
      <div className="mt-8 p-6 bg-[#0d1526] border border-[#1e3a5f] rounded-2xl text-center">
        <p className="text-slate-500 text-sm">No results to display.</p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {/* ── Header row ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-white font-extrabold text-2xl">
            Analysis Results
          </h3>
          {patientId && (
            <p className="text-slate-500 text-sm mt-1">
              Patient ID:{" "}
              <span className="font-mono text-slate-400">{patientId}</span>
            </p>
          )}
          <p className="text-slate-600 text-xs mt-0.5">
            {analysisResults.length} drug
            {analysisResults.length !== 1 ? "s" : ""} analyzed
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0d1526] hover:bg-[#111e35] border border-[#1e3a5f] hover:border-teal-500/30 text-slate-400 hover:text-teal-400 rounded-xl transition-all text-xs font-semibold"
          >
            {copied ? (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-3.5 h-3.5 text-teal-400"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-teal-400">Copied!</span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-3.5 h-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                  />
                </svg>
                Copy JSON
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 hover:border-teal-500/50 text-teal-400 rounded-xl transition-all text-xs font-semibold"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-3.5 h-3.5"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download JSON
          </button>
        </div>
      </div>

      {/* ── Risk Summary Bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-6">
        {Object.entries(RISK_CONFIG).map(([risk, config]) => (
          <div
            key={risk}
            className={`p-3 rounded-xl border ${config.bg} ${config.border} text-center`}
          >
            <div className={`text-3xl font-extrabold ${config.text}`}>
              {riskCounts[risk] || 0}
            </div>
            <div className="text-slate-500 text-[10px] mt-0.5 font-medium leading-tight">
              {risk}
            </div>
          </div>
        ))}
      </div>

      {/* ── Individual Result Cards ── */}
      <div className="space-y-3">
        {analysisResults.map((result, index) => {
          const config = getRiskConfig(result.risk);
          const isOpen = expanded[index];
          const variantList = result.variants
            ? Array.isArray(result.variants)
              ? result.variants
              : [result.variants]
            : [];

          return (
            <div
              key={index}
              className={`border rounded-2xl overflow-hidden shadow-lg ${config.border} ${config.bg} ${config.glow}`}
            >
              {/* Card header (click to expand) */}
              <button
                onClick={() => toggleExpand(index)}
                className={`w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:opacity-90 transition-opacity ${config.headerBg}`}
              >
                <div className="flex items-center gap-3 flex-wrap min-w-0">
                  {/* Risk badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${config.badge}`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${config.dot} shrink-0`}
                    />
                    {result.risk || "Unknown"}
                  </span>

                  {/* Drug name */}
                  <span className="text-white font-bold text-base">
                    {result.drug || "—"}
                  </span>

                  {/* Gene */}
                  {result.gene && (
                    <span className="text-slate-500 text-xs font-mono bg-[#060b18]/50 px-2 py-0.5 rounded-md border border-white/5">
                      {result.gene}
                    </span>
                  )}

                  {/* Phenotype pill */}
                  {result.phenotype && (
                    <span className="hidden sm:inline text-slate-400 text-xs border border-[#1e3a5f] bg-[#060b18]/50 px-2 py-0.5 rounded-md">
                      {result.phenotype}
                    </span>
                  )}
                </div>

                {/* Chevron */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`w-5 h-5 shrink-0 ${config.text} transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {/* Expandable content */}
              {isOpen && (
                <div className="px-5 pb-5 pt-4 space-y-4 border-t border-white/5">
                  {/* Variants */}
                  {variantList.length > 0 && (
                    <div>
                      <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-2">
                        Variants Detected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variantList.map((v, vi) => (
                          <span
                            key={vi}
                            className="text-xs font-mono bg-[#111e35] border border-[#1e3a5f] text-slate-300 px-2.5 py-1 rounded-lg"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phenotype (mobile) */}
                  {result.phenotype && (
                    <div className="sm:hidden">
                      <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-1">
                        Phenotype
                      </p>
                      <p className="text-slate-200 text-sm">
                        {result.phenotype}
                      </p>
                    </div>
                  )}

                  {/* Explanation */}
                  {result.explanation && (
                    <div>
                      <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-2">
                        Clinical Explanation
                      </p>
                      <div className="bg-[#060b18]/60 border border-white/5 rounded-xl p-4">
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {result.recommendation && (
                    <div>
                      <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-2">
                        CPIC Recommendation
                      </p>
                      <div
                        className={`border rounded-xl p-4 ${config.border} ${config.bg}`}
                      >
                        <div className="flex gap-3">
                          <div className={`shrink-0 mt-0.5 ${config.text}`}>
                            {config.icon}
                          </div>
                          <p
                            className={`text-sm leading-relaxed ${config.text}`}
                          >
                            {result.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity score / additional fields */}
                  {result.activity_score != null && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-medium">Activity Score:</span>
                      <span className="font-mono text-slate-300">
                        {result.activity_score}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 bg-[#0d1526] border border-[#1e3a5f] rounded-xl flex gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-slate-600 shrink-0 mt-0.5"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-slate-600 text-xs leading-relaxed">
          <span className="text-slate-500 font-semibold">
            Clinical Disclaimer:
          </span>{" "}
          This analysis is intended for research and educational purposes only.
          All clinical decisions should be made in consultation with a licensed
          healthcare professional. Results are based on available
          pharmacogenomic databases and may not account for all factors
          affecting drug response.
        </p>
      </div>
    </div>
  );
}
