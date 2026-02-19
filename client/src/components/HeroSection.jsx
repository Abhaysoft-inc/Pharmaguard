export default function HeroSection() {
  const stats = [
    { value: "100K+", label: "Preventable Deaths/Year" },
    { value: "6", label: "Critical Genes Analyzed" },
    { value: "CPIC", label: "Guideline Aligned" },
  ];

  const genes = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"];
  const geneColors = [
    "#10b981",
    "#14b8a6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 1.5px 1.5px, #1e3a5f 1.5px, transparent 0)`,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Radial gradient fade at edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#060b18_75%)]" />

      {/* Atmospheric glow blobs */}
      <div className="absolute top-1/4 left-1/3 w-125 h-125 bg-teal-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-400/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* ── Left: Copy ── */}
          <div>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-7 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
              AI-Powered Pharmacogenomics
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6">
              <span className="text-white">Prevent</span>{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-cyan-400">
                Adverse Drug
              </span>
              <br />
              <span className="text-white">Reactions with</span>
              <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-400">
                AI Genomics
              </span>
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
              Upload your{" "}
              <span className="text-slate-200 font-medium">VCF file</span>,
              select medications, and receive AI-powered risk assessments with
              clinical recommendations. Powered by real pharmacogenomic data and
              aligned with{" "}
              <span className="text-teal-400 font-semibold">
                CPIC Guidelines
              </span>
              .
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-9">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center p-4 bg-[#0d1526] border border-[#1e3a5f] rounded-xl hover:border-teal-500/30 transition-colors"
                >
                  <span className="text-2xl font-extrabold text-teal-400">
                    {s.value}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 text-center leading-snug">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3">
              <a
                href="#analyze"
                className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-[#060b18] font-bold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-2xl hover:shadow-teal-500/35 hover:-translate-y-0.5"
              >
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
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
                Analyze My VCF
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-[#0d1526] hover:bg-[#111e35] border border-[#1e3a5f] hover:border-slate-600 text-slate-300 font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                How It Works
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-4 h-4"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Right: Gene map visual ── */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-95 h-105">
              {/* Outer rings */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-72 h-72 rounded-full border border-[#1e3a5f]/60" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 rounded-full border border-[#1e3a5f]/40" />
              </div>

              {/* Center badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-[#0d1526] border-2 border-teal-500/40 flex flex-col items-center justify-center shadow-2xl shadow-teal-500/20">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-8 h-8 text-teal-400 mb-1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <span className="text-[10px] text-teal-400 font-bold tracking-widest">
                    VCF
                  </span>
                </div>
              </div>

              {/* Gene labels orbiting */}
              {genes.map((gene, i) => {
                const angle = (i / genes.length) * 2 * Math.PI - Math.PI / 2;
                const r = 145;
                const cx = 190;
                const cy = 210;
                const x = cx + r * Math.cos(angle);
                const y = cy + r * Math.sin(angle);
                return (
                  <div
                    key={gene}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{ left: x, top: y }}
                  >
                    <div
                      className="px-3 py-1.5 rounded-full border text-xs font-mono font-bold whitespace-nowrap shadow-lg"
                      style={{
                        backgroundColor: `${geneColors[i]}15`,
                        borderColor: `${geneColors[i]}45`,
                        color: geneColors[i],
                        boxShadow: `0 0 20px ${geneColors[i]}20`,
                      }}
                    >
                      {gene}
                    </div>
                  </div>
                );
              })}

              {/* Connector lines from center to gene labels */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 380 420"
              >
                {genes.map((gene, i) => {
                  const angle = (i / genes.length) * 2 * Math.PI - Math.PI / 2;
                  const r = 145;
                  const cx = 190;
                  const cy = 210;
                  const x2 = cx + r * Math.cos(angle);
                  const y2 = cy + r * Math.sin(angle);
                  const x1 = cx + 56 * Math.cos(angle);
                  const y1 = cy + 56 * Math.sin(angle);
                  return (
                    <line
                      key={gene}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke={geneColors[i]}
                      strokeOpacity="0.25"
                      strokeWidth="1"
                      strokeDasharray="4 3"
                    />
                  );
                })}
              </svg>

              {/* Floating particles */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-teal-400/40"
                  style={{
                    left: `${20 + i * 13}%`,
                    top: `${15 + (i % 3) * 30}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-16">
          <a
            href="#how-it-works"
            className="flex flex-col items-center gap-2 text-slate-600 hover:text-teal-400 transition-colors group"
          >
            <span className="text-xs font-medium tracking-wider uppercase">
              Scroll to explore
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5 group-hover:translate-y-1 transition-transform"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
