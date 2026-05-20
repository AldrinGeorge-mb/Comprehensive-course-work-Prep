"""
deep_extract.py
Extracts all text from each CCW PDF page by page and saves raw text
so we can read it and identify missing questions.
Saves output per-PDF so we can check one at a time.
"""
import pdfplumber
import os

PDF_DIR = "."
OUTPUT_DIR = "pdf_text"
os.makedirs(OUTPUT_DIR, exist_ok=True)

PDFS = ["ccw 1.pdf", "ccw2.pdf", "ccw3.pdf", "ccw4.pdf", "ccw5.pdf", "ccw6.pdf"]

for pdf_name in PDFS:
    pdf_path = os.path.join(PDF_DIR, pdf_name)
    if not os.path.exists(pdf_path):
        print(f"[MISSING] {pdf_name}")
        continue

    out_name = pdf_name.replace(".pdf","").replace(" ","_") + "_text.txt"
    out_path = os.path.join(OUTPUT_DIR, out_name)

    with pdfplumber.open(pdf_path) as pdf:
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(f"=== {pdf_name} ({len(pdf.pages)} pages) ===\n\n")
            for i, page in enumerate(pdf.pages):
                text = page.extract_text() or ""
                f.write(f"--- Page {i+1} ---\n")
                f.write(text)
                f.write("\n\n")
        
        size = os.path.getsize(out_path)
        # Count lines with question-like content
        with open(out_path, encoding="utf-8") as f:
            content = f.read()
        
        print(f"{pdf_name:15s} -> {out_name:30s} | {size:7,} bytes | chars: {len(content):,}")

print(f"\nAll text files saved to: {OUTPUT_DIR}/")

# Also print a count of current DB questions
print("\n--- Current questions.js counts ---")
import subprocess
result = subprocess.run(
    ["python", "-c", """
import re
with open('src/data/questions.js', encoding='utf-8') as f:
    content = f.read()
arrays = {
    'DSA':  len(re.findall(r'\{q:', content[:content.index('OS_QUESTIONS')])),
    'OS':   len(re.findall(r'\{q:', content[content.index('OS_QUESTIONS'):content.index('COA_QUESTIONS')])),
    'COA':  len(re.findall(r'\{q:', content[content.index('COA_QUESTIONS'):content.index('DBMS_QUESTIONS')])),
    'DBMS': len(re.findall(r'\{q:', content[content.index('DBMS_QUESTIONS'):content.index('FLAT_QUESTIONS')])),
    'FLAT': len(re.findall(r'\{q:', content[content.index('FLAT_QUESTIONS'):])),
}
for k, v in arrays.items():
    print(f"  {k}: {v} questions")
print(f"  TOTAL: {sum(arrays.values())} questions")
print(f"  MISSING: {300 - sum(arrays.values())} questions to reach 300")
"""],
    capture_output=True, text=True, cwd="."
)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr[:300])
