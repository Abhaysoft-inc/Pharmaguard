"""
Pharmaguard — Flask API Server
================================
Provides the /analyze endpoint that accepts a VCF file + drug list
and returns pharmacogenomic risk assessments.
"""

from __future__ import annotations

import os
import json
import time
import tempfile
import traceback

from flask import Flask, request, jsonify
from flask_cors import CORS

from parser import parse_vcf, parse_vcf_bytes
from analyzer import analyze
from pgx_knowledgebase import get_all_drugs, KNOWN_GENES

app = Flask(__name__)
CORS(app)

# Max upload size: 50 MB
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/", methods=["GET"])
def index():
    return jsonify({
        "service": "Pharmaguard API",
        "version": "1.0.0",
        "endpoints": {
            "/analyze": "POST — Upload VCF + drugs for pharmacogenomic analysis",
            "/drugs":   "GET  — List all supported drugs",
            "/genes":   "GET  — List all screened genes",
            "/health":  "GET  — Health check",
        },
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/drugs", methods=["GET"])
def list_drugs():
    """Return all drugs supported by the knowledge base."""
    return jsonify({"drugs": get_all_drugs()})


@app.route("/genes", methods=["GET"])
def list_genes():
    """Return all genes screened."""
    return jsonify({"genes": KNOWN_GENES})


@app.route("/analyze", methods=["POST"])
def analyze_endpoint():
    """
    Analyze a VCF file against a list of drugs.

    Expects multipart/form-data with:
      - vcf_file: the VCF file (.vcf, .vcf.gz, .vcf.bgz)
      - drugs: comma-separated drug names (e.g. "codeine,warfarin,simvastatin")
      - sample: (optional) sample/patient ID to analyze (defaults to first)
    """
    # ── Validate inputs ──
    if "vcf_file" not in request.files:
        return jsonify({"error": "Missing 'vcf_file' in form data"}), 400

    vcf_file = request.files["vcf_file"]
    if not vcf_file.filename:
        return jsonify({"error": "Empty VCF file"}), 400

    drugs_raw = request.form.get("drugs", "")
    if not drugs_raw.strip():
        return jsonify({"error": "Missing 'drugs' parameter (comma-separated drug names)"}), 400

    drugs = [d.strip() for d in drugs_raw.split(",") if d.strip()]
    sample = request.form.get("sample", None)

    # ── Parse VCF ──
    tmp_path = None
    try:
        filename = vcf_file.filename.lower()
        file_data = vcf_file.read()

        if not file_data:
            return jsonify({"error": "Uploaded VCF file is empty"}), 400

        t_parse_start = time.perf_counter()

        # For compressed files, save to temp file; for plain text, use bytes parser
        if filename.endswith(".gz") or filename.endswith(".bgz"):
            suffix = ".vcf.bgz" if filename.endswith(".bgz") else ".vcf.gz"
            with tempfile.NamedTemporaryFile(
                suffix=suffix, delete=False
            ) as tmp:
                tmp.write(file_data)
                tmp_path = tmp.name
            vcf = parse_vcf(tmp_path)
        else:
            vcf = parse_vcf_bytes(file_data, filename=filename)

        t_parse_end = time.perf_counter()
        parse_time_ms = (t_parse_end - t_parse_start) * 1000

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": f"Failed to parse VCF file: {str(e)}",
            "detail": "Ensure the file is a valid VCF (v4.x) file."
        }), 400
    finally:
        if tmp_path and os.path.exists(tmp_path):
            try:
                os.unlink(tmp_path)
            except OSError:
                pass

    # ── Run analysis ──
    try:
        result = analyze(vcf, drugs, sample=sample)
        result._parse_time_ms = parse_time_ms
        return jsonify(result.to_dict()), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "error": f"Analysis failed: {str(e)}"
        }), 500


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug = os.environ.get("FLASK_DEBUG", "1") == "1"
    print(f"🧬 Pharmaguard API starting on http://localhost:{port}")
    print(f"   Supported drugs: {', '.join(get_all_drugs())}")
    print(f"   Screened genes:  {', '.join(KNOWN_GENES)}")
    app.run(host="0.0.0.0", port=port, debug=debug)
