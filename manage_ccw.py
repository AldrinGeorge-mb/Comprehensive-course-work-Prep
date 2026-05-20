import re
import json
import os
import sys
import argparse

HTML_FILE = 'CCW MOCK TEST.html'
IMAGES_DIR = 'images'

def parse_questions(html_content):
    subjects = ['DSA', 'OS', 'COA', 'DBMS', 'FLAT']
    all_questions = {}
    
    for s in subjects:
        # Match the array content: const S_QUESTIONS = [...];
        pattern = r'const\s+' + s + r'_QUESTIONS\s*=\s*\[(.*?)\]\s*;'
        match = re.search(pattern, html_content, re.DOTALL)
        if not match:
            print(f"Warning: Could not find question array for subject {s}")
            all_questions[s] = []
            continue
            
        array_content = match.group(1)
        questions = []
        idx = 0
        while True:
            start = array_content.find('{q:', idx)
            if start == -1:
                break
            
            # Read until matching '}'
            in_str = False
            str_char = None
            escaped = False
            end = -1
            for i in range(start, len(array_content)):
                char = array_content[i]
                if escaped:
                    escaped = False
                    continue
                if char == '\\':
                    escaped = True
                    continue
                if char in ('"', "'"):
                    if not in_str:
                        in_str = True
                        str_char = char
                    elif str_char == char:
                        in_str = False
                        str_char = None
                elif char == '}' and not in_str:
                    end = i
                    break
            
            if end == -1:
                break
            
            obj_str = array_content[start:end+1]
            
            # Parse fields using robust string literal regexes
            q_match = re.search(r'q\s*:\s*("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', obj_str)
            ans_match = re.search(r'ans\s*:\s*(\d+)', obj_str)
            exp_match = re.search(r'exp\s*:\s*("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', obj_str)
            img_match = re.search(r'img\s*:\s*("(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\')', obj_str)
            
            # Extract options array manually to support bracket characters in strings
            options_idx = obj_str.find('options:')
            opts = []
            if options_idx != -1:
                open_bracket = obj_str.find('[', options_idx)
                if open_bracket != -1:
                    in_str = False
                    str_char = None
                    escaped = False
                    close_bracket = -1
                    bracket_level = 0
                    for i in range(open_bracket, len(obj_str)):
                        char = obj_str[i]
                        if escaped:
                            escaped = False
                            continue
                        if char == '\\':
                            escaped = True
                            continue
                        if char in ('"', "'"):
                            if not in_str:
                                in_str = True
                                str_char = char
                            elif str_char == char:
                                in_str = False
                                str_char = None
                        elif char == '[' and not in_str:
                            bracket_level += 1
                        elif char == ']' and not in_str:
                            bracket_level -= 1
                            if bracket_level == 0:
                                close_bracket = i
                                break
                    if close_bracket != -1:
                        opts_str = obj_str[open_bracket+1:close_bracket]
                        opt_literals = re.findall(r'"(?:\\.|[^"\\])*"|\'(?:\\.|[^\'\\])*\'', opts_str)
                        for opt_lit in opt_literals:
                            try:
                                val = json.loads(opt_lit) if opt_lit.startswith('"') else opt_lit[1:-1].replace("\\'", "'")
                            except Exception:
                                val = opt_lit[1:-1]
                            opts.append(val)
            
            if q_match and opts and ans_match:
                try:
                    q_val = json.loads(q_match.group(1)) if q_match.group(1).startswith('"') else q_match.group(1)[1:-1].replace("\\'", "'")
                except Exception:
                    q_val = q_match.group(1)[1:-1]
                
                ans_val = int(ans_match.group(1))
                
                exp_val = ""
                if exp_match:
                    try:
                        exp_val = json.loads(exp_match.group(1)) if exp_match.group(1).startswith('"') else exp_match.group(1)[1:-1].replace("\\'", "'")
                    except Exception:
                        exp_val = exp_match.group(1)[1:-1]
                
                img_val = None
                if img_match:
                    try:
                        img_val = json.loads(img_match.group(1)) if img_match.group(1).startswith('"') else img_match.group(1)[1:-1].replace("\\'", "'")
                    except Exception:
                        img_val = img_match.group(1)[1:-1]
                
                questions.append({
                    'q': q_val,
                    'options': opts,
                    'ans': ans_val,
                    'exp': exp_val,
                    'img': img_val,
                    'raw': obj_str
                })
            else:
                print(f"Warning: Failed to parse fields for an object in {s} at position {start}. String: {obj_str[:100]}...")
            
            idx = end + 1
        all_questions[s] = questions
        
    return all_questions

def load_html():
    if not os.path.exists(HTML_FILE):
        print(f"Error: {HTML_FILE} not found in the current directory.")
        sys.exit(1)
    with open(HTML_FILE, 'r', encoding='utf-8') as f:
        return f.read()

def cmd_stats(args):
    html = load_html()
    all_qs = parse_questions(html)
    
    print("=" * 50)
    print(" CCW PROJECT QUESTION DATABASE STATISTICS")
    print("=" * 50)
    total = 0
    for s, qs in all_qs.items():
        img_count = sum(1 for q in qs if q['img'])
        print(f"Subject: {s:<6} | Total Questions: {len(qs):<3} | With Diagrams: {img_count}")
        total += len(qs)
    print("-" * 50)
    print(f"Total Questions across all subjects: {total}")
    print("=" * 50)

def cmd_verify(args):
    html = load_html()
    
    # 1. Check for basic format issues (missing commas between objects, unclosed properties)
    print("Verifying file syntax...")
    broken_exps = re.findall(r'exp:\"[^\"]+?,{q:\"', html)
    broken_objs = re.findall(r'\}\s*\{q:\"', html)
    
    errors = 0
    if broken_exps:
        print(f"[ERROR] Found {len(broken_exps)} broken/unclosed explanation blocks (missing quotes/escape characters).")
        errors += len(broken_exps)
    if broken_objs:
        print(f"[ERROR] Found {len(broken_objs)} adjacent question objects missing separating commas.")
        errors += len(broken_objs)
        
    # 2. Parse questions and verify structural integrity
    all_qs = parse_questions(html)
    
    referenced_images = set()
    for s, qs in all_qs.items():
        for idx, q in enumerate(qs):
            # Check options count
            if len(q['options']) != 4:
                print(f"[ERROR] Subject {s} Q{idx+1} has {len(q['options'])} options instead of 4.")
                errors += 1
            # Check answer range
            if q['ans'] < 0 or q['ans'] >= len(q['options']):
                print(f"[ERROR] Subject {s} Q{idx+1} has invalid answer index {q['ans']}.")
                errors += 1
            # Track referenced images
            if q['img']:
                referenced_images.add(q['img'])
                # Verify physical image exists
                if not os.path.exists(q['img']):
                    print(f"[ERROR] Subject {s} Q{idx+1} references missing file: {q['img']}")
                    errors += 1
                    
    # 3. Check for orphan images in images directory
    if os.path.exists(IMAGES_DIR):
        physical_images = []
        for root, _, files in os.walk(IMAGES_DIR):
            for file in files:
                rel_path = os.path.join(root, file).replace('\\', '/')
                physical_images.append(rel_path)
                
        unused_images = [img for img in physical_images if img not in referenced_images]
        if unused_images:
            print(f"[INFO] Found {len(unused_images)} unused images in '{IMAGES_DIR}/':")
            for img in sorted(unused_images):
                print(f"  - {img}")
                
    if errors == 0:
        print("[SUCCESS] All checks passed! The database is clean and structurally 100% correct.")
    else:
        print(f"[FAILURE] Found {errors} integrity errors. Please fix before deploying.")
        sys.exit(1)

def cmd_dump(args):
    html = load_html()
    all_qs = parse_questions(html)
    
    if args.format == 'json':
        output_file = args.output or 'ccw_questions_dump.json'
        # Remove 'raw' field before dumping to keep JSON clean
        clean_qs = {}
        for s, qs in all_qs.items():
            clean_qs[s] = []
            for q in qs:
                clean_q = {k: v for k, v in q.items() if k != 'raw'}
                clean_qs[s].append(clean_q)
                
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(clean_qs, f, indent=2, ensure_ascii=False)
        print(f"Successfully dumped questions to JSON file: {output_file}")
    else:
        output_file = args.output or 'ccw_questions_dump.txt'
        with open(output_file, 'w', encoding='utf-8') as f:
            for s, qs in all_qs.items():
                f.write(f"=== SUBJECT: {s} ({len(qs)} Questions) ===\n\n")
                for i, q in enumerate(qs):
                    f.write(f"Q{i+1}: {q['q']}\n")
                    for idx, opt in enumerate(q['options']):
                        marker = "[✓]" if idx == q['ans'] else "[ ]"
                        f.write(f"  {marker} {chr(65+idx)}. {opt}\n")
                    if q['img']:
                        f.write(f"  [Diagram]: {q['img']}\n")
                    if q['exp']:
                        f.write(f"  [Explanation]: {q['exp']}\n")
                    f.write("\n")
        print(f"Successfully dumped questions to text file: {output_file}")

def cmd_search(args):
    html = load_html()
    all_qs = parse_questions(html)
    query = args.query.lower()
    
    print(f"Searching for '{args.query}'...")
    found = 0
    for s, qs in all_qs.items():
        for i, q in enumerate(qs):
            match = False
            if query in q['q'].lower():
                match = True
            for opt in q['options']:
                if query in opt.lower():
                    match = True
            if q['exp'] and query in q['exp'].lower():
                match = True
                
            if match:
                found += 1
                print(f"\n[{s} Q{i+1}] {q['q']}")
                for idx, opt in enumerate(q['options']):
                    marker = "✓" if idx == q['ans'] else " "
                    print(f"  [{marker}] {chr(65+idx)}. {opt}")
                if q['img']:
                    print(f"  Diagram: {q['img']}")
                if q['exp']:
                    print(f"  Explanation: {q['exp']}")
    print(f"\nFound {found} matching questions.")

def main():
    parser = argparse.ArgumentParser(description="CCW Project Management Utility")
    subparsers = parser.add_subparsers(dest='command', required=True)
    
    # Stats command
    subparsers.add_parser('stats', help='Show question database statistics')
    
    # Verify command
    subparsers.add_parser('verify', help='Verify database syntax, structure, options, and referenced images')
    
    # Dump command
    dump_parser = subparsers.add_parser('dump', help='Dump database to JSON or text file')
    dump_parser.add_argument('--format', choices=['json', 'text'], default='json', help='Output format (default: json)')
    dump_parser.add_argument('-o', '--output', help='Output filename')
    
    # Search command
    search_parser = subparsers.add_parser('search', help='Search questions by keyword')
    search_parser.add_argument('query', help='Search term or phrase')
    
    args = parser.parse_args()
    
    if args.command == 'stats':
        cmd_stats(args)
    elif args.command == 'verify':
        cmd_verify(args)
    elif args.command == 'dump':
        cmd_dump(args)
    elif args.command == 'search':
        cmd_search(args)

if __name__ == '__main__':
    main()
