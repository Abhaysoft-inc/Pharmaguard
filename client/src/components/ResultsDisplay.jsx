"use client";
import { useState } from "react";

const RISK_CONFIG = {
  Safe: {
    accentBg: "bg-[#a9bb9d]/10",
    accentBorder: "border-[#a9bb9d]/40",
    accentText: "text-[#5a7a52]",
    dot: "bg-[#a9bb9d]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
      </svg>
    ),
  },
  "Adjust Dosage": {
    accentBg: "bg-[#a9bb9d]/10",
    accentBorder: "border-[#a9bb9d]/40",
    accentText: "text-[#5a7a52]",
    dot: "bg-[#a9bb9d]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  Toxic: {
    accentBg: "bg-[#a9bb9d]/10",
    accentBorder: "border-[#a9bb9d]/40",
    accentText: "text-[#5a7a52]",
    dot: "bg-[#a9bb9d]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
      </svg>
    ),
  },
  Ineffective: {
    accentBg: "bg-[#a9bb9d]/10",
    accentBorder: "border-[#a9bb9d]/40",
    accentText: "text-[#5a7a52]",
    dot: "bg-[#a9bb9d]",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  Unknown: {
    accentBg: "bg-[#a9bb9d]/5",
    accentBorder: "border-[#a9bb9d]/20",
    accentText: "text-[#a9bb9d]",
    dot: "bg-[#a9bb9d]/50",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-1.21-3.628-1.21-1.61 0-3.51.86-3.51 2.967 0 1.61 1.19 2.348 2.082 2.816l.84.472c.35.197.609.36.609.723 0 .434-.416.73-1.004.73-.807 0-1.541-.328-2.038-.99a.75.75 0 00-1.21.882c.726.995 1.917 1.608 3.248 1.608 1.764 0 2.882-1.105 2.882-2.52 0-1.297-.72-1.978-1.716-2.515l-.84-.473c-.392-.22-.574-.382-.574-.696 0-.38.403-.587.888-.587.532 0 1.04.196 1.406.55a.75.75 0 001.043-1.078zM12 18.75a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
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
    } catch {}
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

  const riskCounts = Object.fromEntries(
    Object.keys(RISK_CONFIG).map((r) => [
      r,
      analysisResults.filter((x) => x.risk === r).length,
    ]),
  );

  if (analysisResults.length === 0) {
    return (
      <div className="mt-8 p-6 bg-white border border-[#a9bb9d]/20 text-center">
        <p className="text-[#a9bb9d] text-sm">No results to display.</p>
      </div>
    );
  }

  return (
    <div className="mt-2">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="block w-6 h-px bg-[#a9bb9d]" />
            <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#a9bb9d]">
              CPIC Analysis
            </span>
          </div>
          <h3 className="text-[#000000] font-light text-2xl tracking-tight">
            Analysis Results
          </h3>
          {patientId && (
            <p className="text-[#a9bb9d]/70 text-xs mt-1">
              Patient ID:{" "}
              <span className="font-mono text-[#5a7a52]">{patientId}</span>
            </p>
          )}
          <p className="text-[#a9bb9d]/60 text-xs mt-0.5">
            {analysisResults.length} drug
            {analysisResults.length !== 1 ? "s" : ""} analyzed
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#a9bb9d]/40 hover:border-[#a9bb9d] text-[#a9bb9d]/70 hover:text-[#5a7a52] transition-all text-[0.75rem] font-medium tracking-[0.08em] uppercase"
          >
            {copied ? (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#a9bb9d]">
                  <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                </svg>
                <span className="text-[#a9bb9d]">Copied</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                </svg>
                Copy JSON
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#a9bb9d] text-white hover:bg-[#8faa82] transition-all text-[0.75rem] font-medium tracking-[0.08em] uppercase"
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download
          </button>
        </div>
      </div>

      {/* ── Risk Summary ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
        {Object.entries(RISK_CONFIG).map(([risk]) => (
          <div
            key={risk}
            className="p-3 border border-[#a9bb9d]/30 bg-white text-center"
          >
            <div className="text-2xl font-light text-[#a9bb9d] tracking-tight">
              {riskCounts[risk] || 0}
            </div>
            <div className="text-[#a9bb9d]/60 text-[10px] mt-0.5 tracking-widest uppercase">
              {risk}
            </div>
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-linear-to-r from-[#a9bb9d]/10 via-[#a9bb9d]/40 to-transparent mb-6" />

      {/* ── Result Cards ── */}
      <div className="space-y-2">
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
              className="border border-[#a9bb9d]/20 bg-white overflow-hidden transition-shadow hover:shadow-sm hover:border-[#a9bb9d]/40"
            >
              {/* Card header / toggle */}
              <button
                onClick={() => toggleExpand(index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 hover:bg-[#a9bb9d]/5 transition-colors"
              >
                <div className="flex items-center gap-3 flex-wrap min-w-0">
                  {/* Risk badge */}
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 border border-[#a9bb9d]/40 bg-[#a9bb9d]/10 text-[#5a7a52]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#a9bb9d] shrink-0" />
                    {result.risk || "Unknown"}
                  </span>

                  {/* Drug name */}
                  <span className="text-[#5a7a52] font-medium text-sm tracking-wide">
                    {result.drug || "—"}
                  </span>

                  {/* Gene tag */}
                  {result.gene && (
                    <span className="text-[#a9bb9d] text-[11px] font-mono bg-white border border-[#a9bb9d]/30 px-2 py-0.5">
                      {result.gene}
                    </span>
                  )}

                  {/* Phenotype (desktop) */}
                  {result.phenotype && (
                    <span className="hidden sm:inline text-[#a9bb9d]/80 text-[11px] border border-[#a9bb9d]/20 bg-[#a9bb9d]/5 px-2 py-0.5">
                      {result.phenotype}
                    </span>
                  )}
                </div>

                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className={`w-4 h-4 shrink-0 text-[#a9bb9d]/60 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {/* Expandable content */}
              {isOpen && (
                <div className="px-5 pb-5 pt-4 space-y-5 border-t border-[#a9bb9d]/20 bg-[#a9bb9d]/5">
                  {/* Variants */}
                  {variantList.length > 0 && (
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#a9bb9d]/70 mb-2">
                        Variants Detected
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {variantList.map((v, vi) => (
                          <span
                            key={vi}
                            className="text-[11px] font-mono bg-white border border-[#a9bb9d]/30 text-[#5a7a52] px-2.5 py-1"
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
                      <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#a9bb9d]/70 mb-1">
                        Phenotype
                      </p>
                      <p className="text-[#5a7a52] text-sm">{result.phenotype}</p>
                    </div>
                  )}

                  {/* Explanation */}
                  {result.explanation && (
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#a9bb9d]/70 mb-2">
                        Clinical Explanation
                      </p>
                      <div className="bg-white border border-[#a9bb9d]/20 p-4">
                        <p className="text-[#5a7a52]/80 text-sm leading-relaxed whitespace-pre-wrap">
                          {result.explanation}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {result.recommendation && (
                    <div>
                      <p className="text-[10px] font-medium tracking-[0.18em] uppercase text-[#a9bb9d]/70 mb-2">
                        CPIC Recommendation
                      </p>
                      <div className="border border-[#a9bb9d]/40 bg-[#a9bb9d]/10 p-4">
                        <div className="flex gap-3">
                          <div className="shrink-0 mt-0.5 text-[#a9bb9d]">
                            {config.icon}
                          </div>
                          <p className="text-sm leading-relaxed text-[#5a7a52]">
                            {result.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Activity score */}
                  {result.activity_score != null && (
                    <div className="flex items-center gap-2 text-xs text-[#a9bb9d]/70">
                      <span className="tracking-widest uppercase text-[10px]">
                        Activity Score
                      </span>
                      <span className="font-mono text-[#5a7a52] border border-[#a9bb9d]/30 bg-white px-2 py-0.5">
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

      {/* ── Disclaimer ── */}
      <div className="mt-6 p-4 border border-[#a9bb9d]/30 bg-[#a9bb9d]/5 flex gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 text-[#a9bb9d] shrink-0 mt-0.5"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
        <p className="text-[#a9bb9d]/80 text-xs leading-relaxed">
          <span className="text-[#5a7a52] font-medium">Research Use Only —</span>{" "}
          This analysis is for research and educational purposes. All clinical
          decisions should be made in consultation with a licensed healthcare
          professional.
        </p>
      </div>
    </div>
  );
}
