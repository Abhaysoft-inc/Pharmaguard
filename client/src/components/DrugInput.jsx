"use client";
import { useState } from "react";

const SUPPORTED_DRUGS = [
  { name: "CODEINE", gene: "CYP2D6", desc: "Pain reliever / opioid" },
  { name: "WARFARIN", gene: "CYP2C9 / VKORC1", desc: "Blood thinner" },
  { name: "CLOPIDOGREL", gene: "CYP2C19", desc: "Antiplatelet" },
  { name: "SIMVASTATIN", gene: "SLCO1B1", desc: "Cholesterol statin" },
  { name: "AZATHIOPRINE", gene: "TPMT", desc: "Immunosuppressant" },
  { name: "FLUOROURACIL", gene: "DPYD", desc: "Chemotherapy" },
];

export default function DrugInput({ drugs, onChange }) {
  const [customValue, setCustomValue] = useState("");

  const toggleDrug = (name) => {
    onChange(
      drugs.includes(name) ? drugs.filter((d) => d !== name) : [...drugs, name],
    );
  };

  const removeDrug = (name) => onChange(drugs.filter((d) => d !== name));

  const addCustom = () => {
    const trimmed = customValue.trim().toUpperCase();
    if (trimmed && !drugs.includes(trimmed)) {
      onChange([...drugs, trimmed]);
    }
    setCustomValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustom();
    }
    // Support comma-separated entry
    if (e.key === ",") {
      e.preventDefault();
      addCustom();
    }
  };

  return (
    <div className="bg-[#0d1526] border border-[#1e3a5f] rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-teal-500/15 border border-teal-500/25 flex items-center justify-center text-teal-400 text-sm font-bold">
          02
        </div>
        <div>
          <h3 className="text-slate-100 font-semibold text-sm">
            Select Drug(s)
          </h3>
          <p className="text-slate-600 text-xs">
            Click to toggle • supports multiple
          </p>
        </div>
      </div>

      {/* Drug grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {SUPPORTED_DRUGS.map((drug) => {
          const active = drugs.includes(drug.name);
          return (
            <button
              key={drug.name}
              onClick={() => toggleDrug(drug.name)}
              className={`
                relative p-3 rounded-xl border text-left transition-all duration-150 group
                ${
                  active
                    ? "border-teal-400/50 bg-teal-500/10"
                    : "border-[#1e3a5f] hover:border-slate-600 hover:bg-[#111e35]"
                }
              `}
            >
              {/* Checkmark */}
              {active && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-teal-500 flex items-center justify-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-2.5 h-2.5 text-[#060b18]"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              )}
              <div
                className={`text-xs font-bold mb-0.5 ${active ? "text-teal-300" : "text-slate-300"}`}
              >
                {drug.name}
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                {drug.gene}
              </div>
              <div
                className={`text-[10px] mt-0.5 ${active ? "text-teal-600" : "text-slate-700"}`}
              >
                {drug.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom drug input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add other drug (e.g. METFORMIN)..."
            className="w-full bg-[#111e35] border border-[#1e3a5f] focus:border-teal-500/50 text-slate-300 text-xs px-3 py-2.5 rounded-xl outline-none placeholder:text-slate-700 transition-colors"
          />
        </div>
        <button
          onClick={addCustom}
          disabled={!customValue.trim()}
          className="px-3 py-2.5 bg-[#111e35] border border-[#1e3a5f] hover:border-teal-500/40 hover:bg-teal-500/10 disabled:opacity-40 disabled:cursor-not-allowed text-slate-400 hover:text-teal-400 rounded-xl transition-all text-xs font-medium"
        >
          Add
        </button>
      </div>

      {/* Selected tags row */}
      {drugs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-[#1e3a5f]">
          <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest mb-2">
            Selected ({drugs.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {drugs.map((d) => (
              <span
                key={d}
                className="inline-flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs px-2.5 py-1 rounded-full font-medium"
              >
                {d}
                <button
                  onClick={() => removeDrug(d)}
                  className="hover:text-red-400 transition-colors -mr-0.5 ml-0.5 w-3 h-3 flex items-center justify-center"
                  aria-label={`Remove ${d}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-3 h-3"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
