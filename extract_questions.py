"""
extract_questions.py
Extracts all text from each CCW PDF and saves per-subject question text
to a single structured output file for comparison.
"""
import pdfplumber
import os
import re

PDF_DIR = "."
OUTPUT_FILE = "extracted_questions.txt"

# PDFs to scan
PDFS = ["ccw 1.pdf", "ccw2.pdf", "ccw3.pdf", "ccw4.pdf", "ccw5.pdf", "ccw6.pdf"]

# Subject keywords to help categorise pages
SUBJECT_KEYWORDS = {
    "DSA": ["data structure", "algorithm", "sorting", "linked list", "stack", "queue",
            "heap", "tree", "graph", "hash", "bfs", "dfs", "search", "traversal"],
    "OS":  ["operating system", "process", "scheduling", "deadlock", "semaphore",
            "paging", "memory", "thread", "cpu", "page fault", "virtual memory"],
    "COA": ["cache", "pipeline", "addressing mode", "register", "alu", "memory hierarchy",
            "instruction", "cisc", "risc", "dma", "bus", "hazard", "clock cycle"],
    "DBMS":["sql", "relation", "normalization", "normal form", "bcnf", "transaction",
            "acid", "b+ tree", "index", "join", "functional dependency", "query"],
    "FLAT":["automata", "turing", "grammar", "regular expression", "context free",
            "pushdown", "dfa", "nfa", "pumping lemma", "chomsky", "finite automaton"],
}

def detect_subject(text_lower):
    scores = {s: 0 for s in SUBJECT_KEYWORDS}
    for subj, kws in SUBJECT_KEYWORDS.items():
        for kw in kws:
            scores[subj] += text_lower.count(kw)
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "UNKNOWN"

def extract_questions_from_text(text):
    """
    Try to extract numbered MCQ questions from a block of text.
    Matches patterns like:  1. question text
    """
    # Normalise whitespace
    text = re.sub(r'\r\n|\r', '\n', text)
    
    # Find numbered question starts: lines beginning with digit(s) followed by . or )
    pattern = re.compile(r'^(\d{1,3})[.)]\s+(.+?)(?=\n\d{1,3}[.)]\s|\Z)', re.MULTILINE | re.DOTALL)
    matches = pattern.findall(text)
    questions = []
    for num, body in matches:
        body = body.strip()
        # Skip very short matches (likely page numbers / headings)
        if len(body) > 20:
            questions.append((int(num), body[:400]))  # cap at 400 chars per Q
    return questions

total_by_subject = {s: [] for s in SUBJECT_KEYWORDS}
total_by_subject["UNKNOWN"] = []

with open(OUTPUT_FILE, "w", encoding="utf-8") as out:
    for pdf_name in PDFS:
        pdf_path = os.path.join(PDF_DIR, pdf_name)
        if not os.path.exists(pdf_path):
            out.write(f"\n{'='*60}\n[MISSING] {pdf_name}\n{'='*60}\n")
            continue

        out.write(f"\n{'='*60}\n PDF: {pdf_name}\n{'='*60}\n")
        try:
            with pdfplumber.open(pdf_path) as pdf:
                num_pages = len(pdf.pages)
                out.write(f" Pages: {num_pages}\n\n")
                
                # Extract all text page by page grouped by detected subject
                page_texts = {}
                for i, page in enumerate(pdf.pages):
                    raw = page.extract_text() or ""
                    page_texts[i+1] = raw

                # Combine all text and extract questions
                full_text = "\n".join(page_texts.values())
                full_lower = full_text.lower()
                
                subject = detect_subject(full_lower)
                questions = extract_questions_from_text(full_text)
                
                out.write(f" Detected Subject: {subject}\n")
                out.write(f" Questions found:  {len(questions)}\n\n")
                
                for num, body in questions:
                    first_line = body.split('\n')[0][:200]
                    out.write(f"  Q{num:03d}: {first_line}\n")
                    total_by_subject[subject].append(first_line)

        except Exception as e:
            out.write(f" ERROR reading {pdf_name}: {e}\n")

    # Summary
    out.write(f"\n{'='*60}\n SUMMARY\n{'='*60}\n")
    grand_total = 0
    for subj, qs in total_by_subject.items():
        if qs:
            out.write(f" {subj:10s}: {len(qs):3d} questions extracted\n")
            grand_total += len(qs)
    out.write(f" {'TOTAL':10s}: {grand_total:3d} questions extracted across all PDFs\n")

print(f"Done. Output written to {OUTPUT_FILE}")
print(f"File size: {os.path.getsize(OUTPUT_FILE):,} bytes")
