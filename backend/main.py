from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import re
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "StyleSync Backend Running"}

@app.post("/scrape")
def scrape(url: str):
    try:
        url = url.strip('"').strip("'")

        res = requests.get(url, timeout=5, verify=False)
        soup = BeautifulSoup(res.text, "html.parser")

        colors = set()
        fonts = set()

        # 🔥 Extract colors from inline styles
        for tag in soup.find_all(style=True):
            style = tag.get("style", "")

            color_matches = re.findall(r'#[0-9a-fA-F]{3,6}', style)
            for c in color_matches:
                colors.add(c)

            font_matches = re.findall(r'font-family:\s*([^;]+);?', style)
            for f in font_matches:
                fonts.add(f.strip())

        # 🔥 Extract from <style> tags
        for style_tag in soup.find_all("style"):
            css = style_tag.text

            color_matches = re.findall(r'#[0-9a-fA-F]{3,6}', css)
            for c in color_matches:
                colors.add(c)

            font_matches = re.findall(r'font-family:\s*([^;]+);?', css)
            for f in font_matches:
                fonts.add(f.strip())

        # 🔥 Fallbacks
        if not colors:
            colors = {"#000000", "#ffffff", "#2563eb"}

        if not fonts:
            fonts = {"Arial", "Helvetica"}

        # 🔥 Simple spacing heuristic
        spacing = [4, 8, 16, 24]

        return {
            "colors": list(colors)[:6],
            "fonts": {
                "heading": list(fonts)[0],
                "body": list(fonts)[-1]
            },
            "spacing": spacing
        }

    except Exception as e:
        return {
            "error": str(e),
            "colors": ["#000000", "#ffffff", "#2563eb"],
            "fonts": {
                "heading": "Arial",
                "body": "Helvetica"
            },
            "spacing": [4, 8, 16]
        }