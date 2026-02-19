"use client";
import { useState, useCallback } from "react";
import FileUpload from "./FileUpload";
import DrugInput from "./DrugInput";
import ResultsDisplay from "./ResultsDisplay";
import { validateVCFFile, validateVCFContent } from "@/utils/vcfValidator";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function AnalysisTool() {
  const [file, setFile] = useState(null);
  const [drugs, setDrugs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);

  // ── File handling ────────────────────────────────────────────────────────────
  const handleFileSelect = useCallback(async (selectedFile) => {
    setFileError(null);
    setResults(null);
    setError(null);

    // 1. Validate size + extension
    const validation = validateVCFFile(selectedFile);
    if (!validation.valid) {
      setFileError(validation.error);
      setFile(null);
      return;
    }

    // 2. Read & validate content
    try {
      const text = await selectedFile.text();
      const contentValidation = validateVCFContent(text);
      if (!contentValidation.valid) {
        setFileError(contentValidation.error);
        setFile(null);
        return;
      }
      setFile(selectedFile);
    } catch {
      setFileError("Could not read the file. Please try again.");
    }
  }, []);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setFileError(null);
    setResults(null);
    setError(null);
  }, []);

  // ── Analysis ─────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a VCF file before running the analysis.");
      return;
    }
    if (drugs.length === 0) {
      setError("Please select at least one drug to analyze.");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("vcf_file", file);
      formData.append("drugs", drugs.join(","));

      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let errMsg = `Server returned ${response.status}`;
        try {
          const errData = await response.json();
          errMsg = errData.error || errData.message || errMsg;
        } catch {
          // keep generic message
        }
        throw new Error(errMsg);
      }

      const data = await response.json();
      setResults(data);

      // Scroll to results
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      if (err instanceof TypeError && err.message.includes("fetch")) {
        setError(
          "Unable to reach the analysis server. Please ensure the backend is running at " +
            BACKEND_URL,
        );
      } else {
        setError(
          err.message || "An unexpected error occurred. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const canAnalyze = !!file && drugs.length > 0 && !loading;

  return (
    <section id="analyze" className="py-24 px-4 relative">
      {/* Section separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#1e3a5f] to-transparent" />

      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#0d1526] border border-[#1e3a5f] text-slate-500 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5 tracking-widest uppercase">
            Analysis Tool
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Pharmacogenomic Risk Analyzer
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto leading-relaxed">
            Upload your VCF file and select medications to receive personalized
            risk predictions with LLM-generated clinical explanations.
          </p>
        </div>

        {/* ── Input Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <FileUpload
            file={file}
            onFileSelect={handleFileSelect}
            error={fileError}
            onClear={handleClearFile}
          />
          <DrugInput drugs={drugs} onChange={setDrugs} />
        </div>

        {/* ── Global error ── */}
        {error && (
          <div className="mb-5 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 shrink-0 mt-0.5"
            >
              <path
                fillRule="evenodd"
                d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="font-semibold mb-0.5">Analysis Error</p>
              <p className="text-red-400/80 text-xs">{error}</p>
            </div>
          </div>
        )}

        {/* ── Analyze Button ── */}
        <button
          onClick={handleAnalyze}
          disabled={!canAnalyze}
          className={`
            w-full py-4 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-3
            ${
              canAnalyze
                ? "bg-teal-500 hover:bg-teal-400 text-[#060b18] hover:shadow-2xl hover:shadow-teal-500/30 hover:-translate-y-0.5 cursor-pointer"
                : "bg-[#0d1526] border border-[#1e3a5f] text-slate-600 cursor-not-allowed"
            }
          `}
        >
          {loading ? (
            <>
              <svg
                className="w-5 h-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing Pharmacogenomic Risk...
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-5 h-5"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
              Analyze Pharmacogenomic Risk
              {!file && (
                <span className="text-xs font-normal opacity-70">
                  — upload a VCF file to continue
                </span>
              )}
              {file && drugs.length === 0 && (
                <span className="text-xs font-normal opacity-70">
                  — select at least one drug
                </span>
              )}
            </>
          )}
        </button>

        {/* Checklist indicator */}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div
            className={`flex items-center gap-1.5 text-xs ${file ? "text-teal-400" : "text-slate-600"}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              {file ? (
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V11.25A.75.75 0 0112 10.5zm0 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            VCF file {file ? "uploaded" : "required"}
          </div>
          <div
            className={`flex items-center gap-1.5 text-xs ${drugs.length > 0 ? "text-teal-400" : "text-slate-600"}`}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              {drugs.length > 0 ? (
                <path
                  fillRule="evenodd"
                  d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm0 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V11.25A.75.75 0 0112 10.5zm0 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z"
                  clipRule="evenodd"
                />
              )}
            </svg>
            Drug{drugs.length !== 1 ? "s" : ""}{" "}
            {drugs.length > 0 ? `selected (${drugs.length})` : "required"}
          </div>
        </div>

        {/* ── Results ── */}
        {results && (
          <div id="results-section">
            <ResultsDisplay results={results} />
          </div>
        )}
      </div>
    </section>
  );
}
