from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
from bs4 import BeautifulSoup
import re
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI()

# Enable CORS (frontend can call backend)
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
        # Fix for extra quotes
        url = url.strip('"').strip("'")

        # Request with SSL disabled
        res = requests.get(url, timeout=5, verify=False)

        soup = BeautifulSoup(res.text, "html.parser")

        colors = set()

        # Extract HEX colors from inline styles
        for tag in soup.find_all(style=True):
            style = tag.get("style", "")
            matches = re.findall(r'#[0-9a-fA-F]{3,6}', style)
            for m in matches:
                colors.add(m)

        # Fallback if no colors found
        if not colors:
            colors = {"#000000", "#ffffff", "#007bff"}

        return {
            "colors": list(colors)[:5],
            "fonts": ["Arial", "Helvetica"],
            "spacing": [4, 8, 16]
        }

    except Exception as e:
        return {
            "error": str(e),
            "colors": ["#000000", "#ffffff", "#ff5733"],
            "fonts": ["Arial"],
            "spacing": [4, 8, 16]
        }
    