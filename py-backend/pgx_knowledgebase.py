"""
Pharmacogenomics Knowledge Base (CPIC-aligned)
===============================================
Maps gene–star-allele combinations to metabolizer phenotypes,
and maps (gene, drug) pairs to risk predictions and dosing guidance
based on CPIC (Clinical Pharmacogenetics Implementation Consortium)
guidelines.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple

# ---------------------------------------------------------------------------
# Risk levels
# ---------------------------------------------------------------------------
SAFE = "Safe"
ADJUST = "Adjust Dosage"
TOXIC = "Toxic"
INEFFECTIVE = "Ineffective"
UNKNOWN = "Unknown"

# ---------------------------------------------------------------------------
# Metabolizer phenotype definitions
# ---------------------------------------------------------------------------
ULTRA_RAPID = "Ultra-rapid Metabolizer"
EXTENSIVE = "Normal Metabolizer"       # aka Extensive
INTERMEDIATE = "Intermediate Metabolizer"
POOR = "Poor Metabolizer"
INDETERMINATE = "Indeterminate"

# ---------------------------------------------------------------------------
# Star-allele → function mapping
# ---------------------------------------------------------------------------
# Function categories:  "normal", "decreased", "no_function", "increased"
ALLELE_FUNCTION: Dict[str, Dict[str, str]] = {
    "CYP2D6": {
        "*1":  "normal",
        "*2":  "normal",
        "*3":  "no_function",
        "*4":  "no_function",
        "*5":  "no_function",
        "*6":  "no_function",
        "*9":  "decreased",
        "*10": "decreased",
        "*17": "decreased",
        "*29": "decreased",
        "*41": "decreased",
    },
    "CYP2C19": {
        "*1":  "normal",
        "*2":  "no_function",
        "*3":  "no_function",
        "*4":  "no_function",
        "*17": "increased",
    },
    "CYP2C9": {
        "*1":  "normal",
        "*2":  "decreased",
        "*3":  "no_function",
        "*5":  "decreased",
        "*6":  "no_function",
        "*8":  "decreased",
        "*11": "decreased",
    },
    "SLCO1B1": {
        "*1":  "normal",
        "*5":  "decreased",
        "*15": "decreased",
        "*17": "decreased",
    },
    "TPMT": {
        "*1":  "normal",
        "*2":  "no_function",
        "*3A": "no_function",
        "*3B": "no_function",
        "*3C": "no_function",
    },
    "DPYD": {
        "*1":   "normal",
        "*2A":  "no_function",
        "*13":  "no_function",
        "c.2846A>T":  "decreased",
        "c.1236G>A/HapB3": "decreased",
    },
}

# rsID → (gene, star-allele) lookup for VCFs that lack GENE/STAR INFO tags
RSID_TO_ALLELE: Dict[str, Tuple[str, str]] = {
    # CYP2D6
    "rs3892097":  ("CYP2D6", "*4"),
    "rs5030655":  ("CYP2D6", "*6"),
    "rs1065852":  ("CYP2D6", "*10"),
    "rs28371706": ("CYP2D6", "*17"),
    "rs16947":    ("CYP2D6", "*2"),
    "rs28371725": ("CYP2D6", "*41"),
    # CYP2C19
    "rs4244285":  ("CYP2C19", "*2"),
    "rs4986893":  ("CYP2C19", "*3"),
    "rs12248560": ("CYP2C19", "*17"),
    # CYP2C9
    "rs1799853":  ("CYP2C9", "*2"),
    "rs1057910":  ("CYP2C9", "*3"),
    # SLCO1B1
    "rs4149056":  ("SLCO1B1", "*5"),
    # TPMT
    "rs1800462":  ("TPMT", "*2"),
    "rs1800460":  ("TPMT", "*3B"),
    "rs1142345":  ("TPMT", "*3C"),
    # DPYD
    "rs3918290":  ("DPYD", "*2A"),
    "rs55886062": ("DPYD", "*13"),
    "rs67376798": ("DPYD", "c.2846A>T"),
}

# ---------------------------------------------------------------------------
# Phenotype inference
# ---------------------------------------------------------------------------

def _function_score(func: str) -> float:
    return {"normal": 1.0, "decreased": 0.5, "no_function": 0.0, "increased": 1.5}.get(func, 1.0)


def infer_phenotype(gene: str, detected_alleles: List[dict]) -> str:
    """
    Given detected variant alleles for a gene, infer the metabolizer phenotype.

    Each item in *detected_alleles* should have keys:
      - star_allele: str   (e.g. "*4")
      - genotype: str      (e.g. "0/1" or "1/1")
    
    We compute an activity score from the two allele copies.
    """
    gene_funcs = ALLELE_FUNCTION.get(gene, {})
    
    # Collect functional impacts — we assume diploid
    scores: List[float] = []
    for a in detected_alleles:
        star = a.get("star_allele", "")
        gt = a.get("genotype", "0/0")
        func = gene_funcs.get(star, "normal")
        
        if gt in ("1/1", "1|1"):
            # Homozygous variant — both copies affected
            scores.extend([_function_score(func), _function_score(func)])
        elif gt in ("0/1", "0|1", "1|0", "1/0"):
            # Heterozygous — one copy affected, one normal
            scores.extend([_function_score(func)])
        # 0/0 means ref-homozygous — allele not actually present

    # If no variant alleles detected, both copies are wild-type (*1/*1)
    if not scores:
        return EXTENSIVE  # Normal metabolizer

    # Fill remaining copies with normal function (assuming diploid)
    while len(scores) < 2:
        scores.append(1.0)  # wild-type copy
    
    # Take the two lowest scores (worst case for diploid)
    scores.sort()
    total = scores[0] + scores[1]

    if total >= 2.5:
        return ULTRA_RAPID
    elif total >= 1.5:
        return EXTENSIVE
    elif total >= 1.0:
        return INTERMEDIATE
    else:
        return POOR


# ---------------------------------------------------------------------------
# Drug–Gene interaction database (CPIC-aligned)
# ---------------------------------------------------------------------------

@dataclass
class DrugGeneInteraction:
    drug: str
    gene: str
    phenotype: str           # metabolizer phenotype
    risk: str                # SAFE / ADJUST / TOXIC / INEFFECTIVE
    recommendation: str      # CPIC dosing guidance
    mechanism: str           # biological explanation
    cpic_level: str = ""     # e.g. "A" (strongest evidence)
    guidelines_url: str = ""


# Master drug-gene interaction table
_INTERACTIONS: List[DrugGeneInteraction] = [
    # ── CYP2D6 ──────────────────────────────────────────────────────────
    DrugGeneInteraction("codeine", "CYP2D6", ULTRA_RAPID, TOXIC,
        "AVOID codeine. Use alternative analgesic not metabolized by CYP2D6 (e.g., morphine, non-opioids).",
        "CYP2D6 ultra-rapid metabolizers convert codeine to morphine at extremely high rates, leading to potentially fatal respiratory depression.",
        "A", "https://cpicpgx.org/guidelines/guideline-for-codeine-and-cyp2d6/"),
    DrugGeneInteraction("codeine", "CYP2D6", EXTENSIVE, SAFE,
        "Use codeine per standard dosing guidelines.",
        "Normal CYP2D6 activity produces expected morphine levels from codeine.",
        "A"),
    DrugGeneInteraction("codeine", "CYP2D6", INTERMEDIATE, ADJUST,
        "Use codeine with caution at reduced dose, or consider alternative analgesic.",
        "Reduced CYP2D6 activity leads to lower morphine formation; analgesic effect may be diminished.",
        "A"),
    DrugGeneInteraction("codeine", "CYP2D6", POOR, INEFFECTIVE,
        "AVOID codeine. Use alternative analgesic. Codeine will provide insufficient pain relief.",
        "CYP2D6 poor metabolizers cannot convert codeine to its active metabolite morphine, rendering it ineffective.",
        "A"),

    DrugGeneInteraction("tramadol", "CYP2D6", ULTRA_RAPID, TOXIC,
        "AVOID tramadol. Risk of respiratory depression and seizures.",
        "Ultra-rapid CYP2D6 metabolism converts tramadol to O-desmethyltramadol at dangerously high rates.",
        "A"),
    DrugGeneInteraction("tramadol", "CYP2D6", EXTENSIVE, SAFE,
        "Use tramadol per standard dosing.",
        "Normal CYP2D6 metabolism produces expected levels of active metabolite.",
        "A"),
    DrugGeneInteraction("tramadol", "CYP2D6", INTERMEDIATE, ADJUST,
        "Use tramadol with caution; consider lower dose or alternative.",
        "Intermediate CYP2D6 activity may reduce active metabolite formation.",
        "A"),
    DrugGeneInteraction("tramadol", "CYP2D6", POOR, INEFFECTIVE,
        "AVOID tramadol. Consider alternative analgesic.",
        "Poor CYP2D6 metabolism prevents formation of the active O-desmethyltramadol metabolite.",
        "A"),

    DrugGeneInteraction("tamoxifen", "CYP2D6", ULTRA_RAPID, SAFE,
        "Use tamoxifen per standard dosing.",
        "Adequate endoxifen formation with ultra-rapid CYP2D6 metabolism.",
        "A"),
    DrugGeneInteraction("tamoxifen", "CYP2D6", EXTENSIVE, SAFE,
        "Use tamoxifen per standard dosing (20 mg/day).",
        "Normal CYP2D6 converts tamoxifen to endoxifen at therapeutic levels.",
        "A"),
    DrugGeneInteraction("tamoxifen", "CYP2D6", INTERMEDIATE, ADJUST,
        "Consider higher dose (40 mg/day) or alternative (aromatase inhibitor if post-menopausal).",
        "Reduced CYP2D6 activity decreases endoxifen formation, possibly lowering efficacy for breast cancer treatment.",
        "A"),
    DrugGeneInteraction("tamoxifen", "CYP2D6", POOR, INEFFECTIVE,
        "AVOID tamoxifen. Use aromatase inhibitor (if post-menopausal) or alternative endocrine therapy.",
        "CYP2D6 poor metabolizers produce subtherapeutic endoxifen levels, compromising tamoxifen's anti-cancer efficacy.",
        "A"),

    # ── CYP2C19 ─────────────────────────────────────────────────────────
    DrugGeneInteraction("clopidogrel", "CYP2C19", ULTRA_RAPID, SAFE,
        "Use clopidogrel per standard dosing.",
        "Ultra-rapid CYP2C19 metabolism provides enhanced activation of clopidogrel to its active thiol metabolite.",
        "A"),
    DrugGeneInteraction("clopidogrel", "CYP2C19", EXTENSIVE, SAFE,
        "Use clopidogrel per standard dosing (75 mg/day).",
        "Normal CYP2C19 function activates clopidogrel adequately for anti-platelet effect.",
        "A"),
    DrugGeneInteraction("clopidogrel", "CYP2C19", INTERMEDIATE, ADJUST,
        "Consider alternative antiplatelet (prasugrel or ticagrelor) if undergoing PCI.",
        "Reduced CYP2C19 function decreases clopidogrel bioactivation, increasing risk of cardiovascular events.",
        "A"),
    DrugGeneInteraction("clopidogrel", "CYP2C19", POOR, INEFFECTIVE,
        "Use ALTERNATIVE antiplatelet agent (prasugrel or ticagrelor). Clopidogrel will not provide adequate platelet inhibition.",
        "CYP2C19 poor metabolizers cannot bioactivate clopidogrel, leading to treatment failure and increased thrombotic risk.",
        "A"),

    DrugGeneInteraction("omeprazole", "CYP2C19", ULTRA_RAPID, INEFFECTIVE,
        "Increase dose to 2-3× standard or use alternative PPI (rabeprazole).",
        "Ultra-rapid CYP2C19 metabolism clears omeprazole too quickly for adequate acid suppression.",
        "A"),
    DrugGeneInteraction("omeprazole", "CYP2C19", EXTENSIVE, SAFE,
        "Use omeprazole per standard dosing (20 mg/day).",
        "Normal CYP2C19 activity provides expected omeprazole pharmacokinetics.",
        "A"),
    DrugGeneInteraction("omeprazole", "CYP2C19", INTERMEDIATE, SAFE,
        "Use omeprazole per standard dosing. Slightly elevated drug levels are clinically beneficial.",
        "Intermediate CYP2C19 metabolism results in higher omeprazole exposure, which may improve acid suppression.",
        "A"),
    DrugGeneInteraction("omeprazole", "CYP2C19", POOR, ADJUST,
        "Consider 50% dose reduction. Monitor for adverse effects.",
        "CYP2C19 poor metabolizers have markedly elevated omeprazole exposure (up to 10×), increasing risk of adverse effects.",
        "A"),

    DrugGeneInteraction("escitalopram", "CYP2C19", ULTRA_RAPID, INEFFECTIVE,
        "Consider alternative SSRI not metabolized by CYP2C19 or increase dose with monitoring.",
        "Ultra-rapid CYP2C19 metabolism may result in subtherapeutic escitalopram levels.",
        "A"),
    DrugGeneInteraction("escitalopram", "CYP2C19", EXTENSIVE, SAFE,
        "Use escitalopram per standard dosing (10-20 mg/day).",
        "Normal CYP2C19 metabolism provides expected escitalopram exposure.",
        "A"),
    DrugGeneInteraction("escitalopram", "CYP2C19", INTERMEDIATE, SAFE,
        "Use escitalopram per standard dosing.",
        "Intermediate CYP2C19 metabolism has modest impact on escitalopram levels.",
        "A"),
    DrugGeneInteraction("escitalopram", "CYP2C19", POOR, ADJUST,
        "Reduce dose by 50%. Consider alternative SSRI if adverse effects occur.",
        "CYP2C19 poor metabolizers have significantly elevated escitalopram plasma concentrations, increasing side-effect risk.",
        "A"),

    DrugGeneInteraction("voriconazole", "CYP2C19", ULTRA_RAPID, INEFFECTIVE,
        "Use alternative antifungal agent or increase dose with therapeutic drug monitoring.",
        "Ultra-rapid CYP2C19 metabolism clears voriconazole too rapidly for adequate antifungal activity.",
        "A"),
    DrugGeneInteraction("voriconazole", "CYP2C19", EXTENSIVE, SAFE,
        "Use voriconazole per standard dosing.",
        "Normal CYP2C19 function provides expected voriconazole pharmacokinetics.",
        "A"),
    DrugGeneInteraction("voriconazole", "CYP2C19", INTERMEDIATE, SAFE,
        "Use voriconazole per standard dosing.",
        "Intermediate CYP2C19 metabolism has minimal clinical impact on voriconazole levels.",
        "A"),
    DrugGeneInteraction("voriconazole", "CYP2C19", POOR, TOXIC,
        "Reduce dose by 50% or use alternative antifungal. Monitor trough levels closely.",
        "CYP2C19 poor metabolizers have dramatically elevated voriconazole exposure, risking hepatotoxicity and visual disturbances.",
        "A"),

    # ── CYP2C9 ──────────────────────────────────────────────────────────
    DrugGeneInteraction("warfarin", "CYP2C9", EXTENSIVE, SAFE,
        "Use standard warfarin dosing algorithm with INR monitoring.",
        "Normal CYP2C9 metabolism clears S-warfarin at expected rates.",
        "A", "https://cpicpgx.org/guidelines/guideline-for-warfarin-and-cyp2c9-and-vkorc1/"),
    DrugGeneInteraction("warfarin", "CYP2C9", INTERMEDIATE, ADJUST,
        "Reduce initial dose by 25-50%. Increase INR monitoring frequency.",
        "Reduced CYP2C9 function decreases S-warfarin clearance, increasing bleeding risk at standard doses.",
        "A"),
    DrugGeneInteraction("warfarin", "CYP2C9", POOR, TOXIC,
        "Reduce initial dose by 50-80%. Use frequent INR monitoring. Consider alternative anticoagulant (DOAC).",
        "CYP2C9 poor metabolizers accumulate S-warfarin to dangerously high levels, causing severe bleeding risk.",
        "A"),

    DrugGeneInteraction("celecoxib", "CYP2C9", EXTENSIVE, SAFE,
        "Use celecoxib per standard dosing.",
        "Normal CYP2C9 metabolism provides expected celecoxib clearance.",
        "A"),
    DrugGeneInteraction("celecoxib", "CYP2C9", INTERMEDIATE, ADJUST,
        "Reduce starting dose by 50%. Use lowest effective dose.",
        "Intermediate CYP2C9 metabolism results in elevated celecoxib exposure.",
        "A"),
    DrugGeneInteraction("celecoxib", "CYP2C9", POOR, TOXIC,
        "Reduce dose by 75% or avoid celecoxib. Use alternative NSAID or analgesic.",
        "CYP2C9 poor metabolizers have significantly impaired celecoxib clearance, increasing GI and cardiovascular toxicity risk.",
        "A"),

    DrugGeneInteraction("phenytoin", "CYP2C9", EXTENSIVE, SAFE,
        "Use phenytoin per standard dosing with therapeutic drug monitoring.",
        "Normal CYP2C9 function provides expected phenytoin pharmacokinetics.",
        "A"),
    DrugGeneInteraction("phenytoin", "CYP2C9", INTERMEDIATE, ADJUST,
        "Reduce dose by 25%. Monitor phenytoin levels closely.",
        "Reduced CYP2C9 activity leads to higher phenytoin levels and narrower therapeutic window.",
        "A"),
    DrugGeneInteraction("phenytoin", "CYP2C9", POOR, TOXIC,
        "Reduce dose by 50% or use alternative antiepileptic. Monitor drug levels closely.",
        "CYP2C9 poor metabolizers accumulate phenytoin, risking CNS toxicity (ataxia, nystagmus, seizures).",
        "A"),

    # ── SLCO1B1 ─────────────────────────────────────────────────────────
    DrugGeneInteraction("simvastatin", "SLCO1B1", EXTENSIVE, SAFE,
        "Use simvastatin per standard dosing (up to 40 mg/day).",
        "Normal SLCO1B1 transporter function provides adequate hepatic uptake of simvastatin acid.",
        "A", "https://cpicpgx.org/guidelines/guideline-for-simvastatin-and-slco1b1/"),
    DrugGeneInteraction("simvastatin", "SLCO1B1", INTERMEDIATE, ADJUST,
        "Limit simvastatin to ≤20 mg/day or use alternative statin (rosuvastatin/pravastatin).",
        "Reduced SLCO1B1 function increases systemic simvastatin acid exposure, raising myopathy risk (OR ~2.6 per *5 allele).",
        "A"),
    DrugGeneInteraction("simvastatin", "SLCO1B1", POOR, TOXIC,
        "AVOID simvastatin. Use alternative statin (rosuvastatin or pravastatin at lowest effective dose).",
        "SLCO1B1 poor function causes dramatically elevated simvastatin acid levels, with ~18× increased myopathy risk including rhabdomyolysis.",
        "A"),

    DrugGeneInteraction("atorvastatin", "SLCO1B1", EXTENSIVE, SAFE,
        "Use atorvastatin per standard dosing.",
        "Normal SLCO1B1 function provides expected hepatic uptake of atorvastatin.",
        "B"),
    DrugGeneInteraction("atorvastatin", "SLCO1B1", INTERMEDIATE, ADJUST,
        "Use lower dose atorvastatin or consider pravastatin/rosuvastatin.",
        "Reduced SLCO1B1 function modestly increases atorvastatin systemic exposure.",
        "B"),
    DrugGeneInteraction("atorvastatin", "SLCO1B1", POOR, ADJUST,
        "Use lowest effective dose or switch to pravastatin/rosuvastatin. Monitor for muscle symptoms.",
        "Poor SLCO1B1 function significantly increases atorvastatin exposure and myopathy risk.",
        "B"),

    # ── TPMT ────────────────────────────────────────────────────────────
    DrugGeneInteraction("azathioprine", "TPMT", EXTENSIVE, SAFE,
        "Use azathioprine per standard dosing (2-3 mg/kg/day).",
        "Normal TPMT activity provides expected thiopurine metabolism and safe thioguanine nucleotide (TGN) levels.",
        "A", "https://cpicpgx.org/guidelines/guideline-for-thiopurines-and-tpmt-and-nudt15/"),
    DrugGeneInteraction("azathioprine", "TPMT", INTERMEDIATE, ADJUST,
        "Reduce dose to 30-70% of standard. Monitor CBC weekly for first months.",
        "Intermediate TPMT activity causes higher TGN accumulation, increasing myelosuppression risk.",
        "A"),
    DrugGeneInteraction("azathioprine", "TPMT", POOR, TOXIC,
        "Reduce dose to 10% of standard or AVOID. Use alternative immunosuppressant. Mandatory CBC monitoring.",
        "TPMT-deficient patients accumulate lethal TGN concentrations, causing severe/fatal myelosuppression (pancytopenia).",
        "A"),

    DrugGeneInteraction("mercaptopurine", "TPMT", EXTENSIVE, SAFE,
        "Use mercaptopurine per protocol dosing.",
        "Normal TPMT activity provides safe thiopurine metabolism.",
        "A"),
    DrugGeneInteraction("mercaptopurine", "TPMT", INTERMEDIATE, ADJUST,
        "Reduce dose to 30-70% of standard. Monitor CBC closely.",
        "Intermediate TPMT activity increases TGN accumulation and myelosuppression risk.",
        "A"),
    DrugGeneInteraction("mercaptopurine", "TPMT", POOR, TOXIC,
        "Reduce dose to 10% of standard or AVOID. Mandatory intensive CBC monitoring.",
        "TPMT deficiency causes dangerous TGN accumulation and life-threatening myelotoxicity.",
        "A"),

    # ── DPYD ────────────────────────────────────────────────────────────
    DrugGeneInteraction("fluorouracil", "DPYD", EXTENSIVE, SAFE,
        "Use 5-fluorouracil per standard dosing.",
        "Normal DPD enzyme activity provides expected fluorouracil catabolism.",
        "A", "https://cpicpgx.org/guidelines/guideline-for-fluoropyrimidines-and-dpyd/"),
    DrugGeneInteraction("fluorouracil", "DPYD", INTERMEDIATE, ADJUST,
        "Reduce initial dose by 50%. Titrate based on toxicity and efficacy.",
        "Reduced DPD activity impairs fluorouracil catabolism, increasing exposure and toxicity risk (mucositis, myelosuppression).",
        "A"),
    DrugGeneInteraction("fluorouracil", "DPYD", POOR, TOXIC,
        "AVOID fluorouracil and all fluoropyrimidines. Use alternative chemotherapy.",
        "DPD-deficient patients cannot catabolize fluorouracil, resulting in severe/fatal toxicity (mucositis, neutropenia, neurotoxicity).",
        "A"),

    DrugGeneInteraction("capecitabine", "DPYD", EXTENSIVE, SAFE,
        "Use capecitabine per standard dosing.",
        "Normal DPD activity provides expected capecitabine/fluorouracil metabolism.",
        "A"),
    DrugGeneInteraction("capecitabine", "DPYD", INTERMEDIATE, ADJUST,
        "Reduce initial dose by 50%. Monitor closely for toxicity.",
        "Reduced DPD activity impairs fluoropyrimidine catabolism, increasing toxicity risk.",
        "A"),
    DrugGeneInteraction("capecitabine", "DPYD", POOR, TOXIC,
        "AVOID capecitabine. Use alternative chemotherapy regimen.",
        "DPD deficiency causes life-threatening fluoropyrimidine toxicity.",
        "A"),
]

# Build fast lookup:  (drug_lower, gene_upper, phenotype) → interaction
_INTERACTION_INDEX: Dict[Tuple[str, str, str], DrugGeneInteraction] = {}
for _ix in _INTERACTIONS:
    _key = (_ix.drug.lower(), _ix.gene.upper(), _ix.phenotype)
    _INTERACTION_INDEX[_key] = _ix

# All drug names in the knowledge base
KNOWN_DRUGS = sorted({ix.drug for ix in _INTERACTIONS})

# All gene names in the knowledge base
KNOWN_GENES = sorted({ix.gene for ix in _INTERACTIONS})

# Drug → list of relevant genes
DRUG_GENES: Dict[str, List[str]] = {}
for _ix in _INTERACTIONS:
    DRUG_GENES.setdefault(_ix.drug.lower(), [])
    if _ix.gene not in DRUG_GENES[_ix.drug.lower()]:
        DRUG_GENES[_ix.drug.lower()].append(_ix.gene)


def lookup_interaction(drug: str, gene: str, phenotype: str) -> Optional[DrugGeneInteraction]:
    """Look up a drug–gene interaction by drug name, gene, and metabolizer phenotype."""
    return _INTERACTION_INDEX.get((drug.lower(), gene.upper(), phenotype))


def get_genes_for_drug(drug: str) -> List[str]:
    """Return the gene(s) relevant to a drug."""
    return DRUG_GENES.get(drug.lower(), [])


def get_all_drugs() -> List[str]:
    """Return all supported drug names."""
    return KNOWN_DRUGS
