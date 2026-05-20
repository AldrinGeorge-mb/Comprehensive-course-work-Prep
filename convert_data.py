import re
import os

html_file = 'CCW MOCK TEST.html'
js_file = 'src/data/questions.js'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract the script block containing the arrays
script_match = re.search(r'<script>(.*?)</script>', content, re.DOTALL)
if not script_match:
    print("Script not found")
    exit(1)

script_content = script_match.group(1)

# We need to extract the parts where the arrays are defined.
# The arrays are DSA_QUESTIONS, OS_QUESTIONS, COA_QUESTIONS, DBMS_QUESTIONS, FLAT_QUESTIONS, and SUBJECTS.
arrays_to_extract = ['DSA_QUESTIONS', 'OS_QUESTIONS', 'COA_QUESTIONS', 'DBMS_QUESTIONS', 'FLAT_QUESTIONS', 'SUBJECTS']

extracted_code = []

for arr in arrays_to_extract:
    # Match const ARR_NAME = [...];
    match = re.search(rf'const {arr} = (\[.*?\]);', script_content, re.DOTALL)
    if match:
        extracted_code.append(f'export const {arr} = {match.group(1)};\n')
    else:
        print(f"{arr} not found")

# Now we need to handle image imports.
# In the extracted code, images are like img:"images/ccw6_p1_img1.jpeg" or img: "images/..."
# We will use regex to find all such occurrences, create import statements, and replace the strings.

full_code = '\n'.join(extracted_code)

img_matches = set(re.findall(r'img\s*:\s*["\']images/([^"\']+)["\']', full_code))

imports = []
for idx, img_filename in enumerate(img_matches):
    var_name = f'img_{idx}'
    imports.append(f"import {var_name} from '../assets/question-images/{img_filename}';")
    # Replace in code
    # We must replace img:"images/filename.jpeg" with img: img_0
    full_code = re.sub(rf'img\s*:\s*["\']images/{img_filename}["\']', f'img: {var_name}', full_code)

final_js = '\n'.join(imports) + '\n\n' + full_code

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(final_js)

print("Data extracted successfully!")
