import pdfplumber
import re

text = []

with pdfplumber.open('testfile.pdf') as pdf:
    for page in pdf.pages:
        left_col = page.crop((0, 0, page.width/2, page.height))
        right_col = page.crop((page.width/2, 0, page.width, page.height))

        left_col_lines = left_col.extract_text_lines()
        right_col_lines = right_col.extract_text_lines()

        for line in left_col_lines:
            text.append(line['text'])

        for line in right_col_lines:
            text.append(line['text'])


course_code_regex = r"[A-Z]{3}\d{3}"


# parse for credits that are valid:
    # match course code
    # sort into buckets of credits transfer vs unsure
    # if transfer -> unsure
    # if match course but 0 creds, skip

grades = ['F', 'D', 'D+']
courses = []
for line in text:
    if re.search(course_code_regex, line):
        elements = line.split()

        # skip if no credit or not passing grade or course currently in prog
        if elements[-1] == '0.0' or elements[-2] in grades or elements[-2] == 'CIP':
            continue

        course = {
            'course_code' : elements[0],
            'credits' : elements[-3],
            'TR' : 1 if 'TR' in line else 0
        }

        courses.append(course)
print(courses)
            
        # add check for if course was widthdraw










