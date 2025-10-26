import pdfplumber

text = ''
with pdfplumber.open('Sepulveda_Jonathan_0928129_8_10_2025.pdf') as pdf:
    for page in pdf.pages:
        left = page.crop((0, 0, page.width/2, page.height))
        right = page.crop((page.width/2, 0, page.width, page.height))

        text += left.extract_text()
        text += right.extract_text()





